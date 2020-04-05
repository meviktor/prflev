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
        const maxEndDate = new Date(queryJson.endDateMax);
        if(queryJson.endDateMin){
            if(!utils.dates.isValidDate(minEndDate)){
                throw new APIError('Invalid minimum value for auction end date.', 400);
            }
            else{
                auctionQuery.endDate = { $gte: minEndDate };
            }
        }
        if(queryJson.endDateMax){
            if(!utils.dates.isValidDate(maxEndDate) || !(maxEndDate >= minEndDate)){
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

        // highestBid
        const minHighestBid = 
            (queryJson.highestBidMin && !isNaN(queryJson.highestBidMin)) ? Number(queryJson.highestBidMin) : 0;
        const maxHighestBid =
            (queryJson.highestBidMax && !isNaN(queryJson.highestBidMax)) ? Number(queryJson.highestBidMax) : 0;
        if(queryJson.highestBidMin){
            if(minHighestBid > 0){
                auctionQuery.highestBid = { $gte: minHighestBid};
            }
            else throw new APIError('Invalid minimum value for highest bid.', 400);
        }
        if(queryJson.highestBidMax){
            if(minHighestBid <= maxHighestBid){
                if(auctionQuery.highestBid){
                    auctionQuery.highestBid.$lte = maxHighestBid;
                }
                else{
                    auctionQuery.highestBid = { $lte: maxHighestBid };
                }
            }
            else throw new APIError('Invalid maximum value for highest bid.', 400);
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
            if(queryJson.searchInDescription){
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

        //keywords
        //TODO: implement this...

        //sending the query to the database...
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
        throw new APIError('An error occured while getting the auction list.', 500);
    }

    const auctionList = auctionDocs.map(auctionDoc => {
        return {
            id: auctionDoc._id,
            startedAt: auctionDoc.createdDate,
            endsAt: auctionDoc.endDate,
            productName: auctionDoc.product.name,
            startingPrice: auctionDoc.startingPrice,
            highestBid: auctionDoc.highestBid
        };
    });

    return auctionList;
}

export default router;