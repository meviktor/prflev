import { Router } from 'express';
import mongoose from 'mongoose';
import models from '../models';
import utils from '../utils';

const router = Router();

router.post('/', async (req, res) => {
    let queryJson;
    let auctionQuery = {};
    try{
        if(req.query.queryJson){
            queryJson = JSON.parse(decodeURI(req.query.queryJson));
        }
        else throw new Error('The parameter contains the query (queryJson) is missing.');

        // endDate
        const minEndDate = new Date(queryJson.endDateMin);
        const maxEndDate = new Date(queryJson.endDateMax);
        if(queryJson.endDateMin){
            if(!utils.dates.isValidDate(minEndDate)){
                throw new Error('Invalid minimum value for auction end date.');
            }
            else{
                auctionQuery.endDate = { $gte: minEndDate };
            }
        }
        if(queryJson.endDateMax){
            if(!utils.dates.isValidDate(maxEndDate) || !(maxEndDate >= minEndDate)){
                throw new Error('Invalid maximum value for auction end date.');
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
            else throw new Error('Invalid minimum value for starting price.');
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
            else throw new Error('Invalid maximum value for starting price.');
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
            else throw new Error('Invalid minimum value for highest bid.');
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
            else throw new Error('Invalid maximum value for highest bid.');
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
    }
    catch(e){
        return res.status(400).send({
            errorMessage: `${e}`
        });
    }
    
    console.log(auctionQuery);
    produceAuctionList(auctionQuery)
    .then((documents) => {
        res.send(documents);
    })
    .catch((error) => {
        res.status(500).send({
            errorMessage: `An error occured while getting auction list. ${error}`
        });
    });
});

async function produceAuctionList(auctionQuery){
    const auctionDocs = await models.Auction.find(auctionQuery);
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