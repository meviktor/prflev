import { Router } from 'express';
import models from '../models';
import utils from '../utils';

const router = Router();
const APIError = utils.APIError;

router.post('/', async (req, res) => {
    const queryJson = req.body;
    let auctionQuery = {};

    try{
        // endDate
        const minEndDate = new Date(queryJson.endDateMin);
        console.log(minEndDate);
        const maxEndDate = new Date(queryJson.endDateMax);
        console.log(maxEndDate);
        if(queryJson.endDateMin){
            if(!utils.dates.isValidDate(minEndDate)){
                throw new APIError('Invalid minimum value for auction end date.', 400);
            }
            else{
                auctionQuery.endDate = { $gte: minEndDate };
                console.log(auctionQuery);
            }
        }
        if(queryJson.endDateMax){
            if(!utils.dates.isValidDate(maxEndDate) || (!(maxEndDate >= minEndDate) && utils.dates.isValidDate(minEndDate))){
                throw new APIError('Invalid maximum value for auction end date.', 400);
            }
            else{
                if(auctionQuery.endDate){
                    auctionQuery.endDate.$lte = maxEndDate;
                }
                else{
                    auctionQuery.endDate = { $lte: maxEndDate };
                }
            } 
        }
        console.log(auctionQuery);

        // startingPrice
        const minStartingPrice = 
            (queryJson.startingPriceMin && !isNaN(queryJson.startingPriceMin)) ? Number(queryJson.startingPriceMin) : 0;
        const maxStartingPrice =
            (queryJson.startingPriceMax && !isNaN(queryJson.startingPriceMax)) ? Number(queryJson.startingPriceMax) : 0;
        if(queryJson.startingPriceMin){
            if(minStartingPrice > 0){
                auctionQuery.startingPrice = { $gte: minStartingPrice};
            }
            else throw new APIError('Invalid minimum value for starting price.', 400);
        }
        if(queryJson.startingPriceMax){
            if(minStartingPrice <= maxStartingPrice){
                if(auctionQuery.startingPrice){
                    auctionQuery.startingPrice.$lte = maxStartingPrice;
                }
                else{
                    auctionQuery.startingPrice = { $lte: maxStartingPrice };
                }
            }
            else throw new APIError('Invalid maximum value for starting price.', 400);
        }

        // actualPrice
        const minActualPrice= 
            (queryJson.actualPriceMin && !isNaN(queryJson.actualPriceMin)) ? Number(queryJson.actualPriceMin) : 0;
        const maxActualPrice =
            (queryJson.actualPriceMax && !isNaN(queryJson.actualPriceMax)) ? Number(queryJson.actualPriceMax) : 0;
        if(queryJson.actualPriceMin){
            if(minActualPrice > 0){
                auctionQuery.actualPrice = { $gte: minActualPrice};
            }
            else throw new APIError('Invalid value for minimum price.', 400);
        }
        if(queryJson.actualPriceMax){
            if(minActualPrice <= maxActualPrice){
                if(auctionQuery.actualPrice){
                    auctionQuery.actualPrice.$lte = maxActualPrice;
                }
                else{
                    auctionQuery.actualPrice = { $lte: maxActualPrice };
                }
            }
            else throw new APIError('Invalid value for maximum price.', 400);
        }

        // productCategory
        if(queryJson.productCategoryId){
            auctionQuery[`product.productCategoryId`] = queryJson.productCategoryId;
        }

        // contains
        const searchWords = 
            (queryJson.contains && queryJson.contains.split(' ').length > 0) ? queryJson.contains.split(' ') : undefined;
        const searchOptions = 'i';
        if(searchWords){
            // searchInDescription
            // TODO: this case (also search in description) needs to be fixed...
            if(queryJson.searchInDescription === true){
                auctionQuery.$or = [];
                const condition1 = {}, condition2 = {};

                condition1[`product.name`] = { $regex: utils.regex.buildContainsRegex(searchWords), $options: searchOptions };
                condition2[`product.description`] = condition1[`product.name`];

                auctionQuery.$or.push(condition1, condition2);

                // console.log(condition1[`product.name`]);
                // console.log(condition2[`product.description`]);
                // console.log(auctionQuery.$or);
            }
            else{
                auctionQuery[`product.name`] = { $regex: utils.regex.buildContainsRegex(searchWords), $options: searchOptions };
            }
        }

        // owner user
        if(queryJson.ownerUserId){
            auctionQuery.ownerUserId = queryJson.ownerUserId;
        }

        // only active auctions (now =< endDate)
        if(queryJson.onlyActive === true){
            if(auctionQuery.endDate){
                if(auctionQuery.endDate.$gte){
                    auctionQuery.endDate.$gte = new Date(auctionQuery.endDate.$gte) > new Date() ? auctionQuery.endDate.$gte : new Date();
                }
                else{
                    auctionQuery.endDate.$gte = new Date();
                }
            }
            else{
                auctionQuery.endDate = {$gte: new Date()};
            }
        }

        //keywords
        //TODO: implement this...

        //sending the query to the database...
        console.log(auctionQuery);
        const foundAuctions = await produceAuctionList(auctionQuery);

        return res.send(foundAuctions);
    }
    catch(e){
        return res.status(e.httpStatusCode).send({
            errorMessage: `${e.errorMessage}`
        });
    }
});

async function produceAuctionList(auctionQuery){
    let auctionDocs;
    
    try{
        auctionDocs = await models.Auction.find(auctionQuery);
    }
    catch(e){
        throw new APIError(`An error occured while getting the auction list. Error: ${e}`, 500);
    }

    const auctionList = auctionDocs.map(auctionDoc => {
        return {
            id: auctionDoc._id,
            startedAt: auctionDoc.createdDate,
            endsAt: auctionDoc.endDate,
            productName: auctionDoc.product.name,
            startingPrice: auctionDoc.startingPrice,
            actualPrice: auctionDoc.actualPrice,
            numberOfComments: auctionDoc.comments ? auctionDoc.comments.length : 0
        };
    });

    return auctionList;
}

export default router;