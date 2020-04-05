import { Router } from 'express';
import models from '../models';
import APIError from '../utils/apiError';

const router = Router();

router.post('/', async (req, res) => {
    let bidJson;

    try{
        if(req.query.bidJson){
            bidJson = JSON.parse(decodeURI(req.query.bidJson));
        }
        else{
            throw new APIError('The parameter contains the bid info (bidJson) is missing.', 400);
        }

        if(!bidJson.auctionId || !bidJson.biddingUserId || !bidJson.amount || isNaN(bidJson.amount)){
            throw new APIError('One or more required field is missing.', 400);
        }

        let foundAuction;
        try{
            foundAuction = await models.Auction.findById(bidJson.auctionId);
        }
        catch(e){
            throw new APIError('An error occured whie trying to find an auction.', 500);
        }
        if(!foundAuction){
            throw new APIError('The requested auction does not exist.', 400);
        }
        if(!foundAuction.highestBid){
            if(!(Number(bidJson.amount) >= foundAuction.startingPrice)){
                throw new APIError(`The starting bid cannot be lower than the starting price (${foundAuction.startingPrice}).`, 400);
            }
        }
        else{
            const lowestPossibleBid = foundAuction.highestBid + foundAuction.incr;
            if(!(Number(bidJson.amount) >= lowestPossibleBid)){
                throw new APIError(`The new bid must be greater than or equal to the last bid plus the increment (${lowestPossibleBid}).`, 400);
            }
        }

        const updatedAuctionId = await updateAuctionWithNewBid(foundAuction, bidJson);

        return res.send({
            auctionId: updatedAuctionId
        });
    }
    catch(e){
        return res.status(e.httpStatusCode).send({
            errorMessage: `${e.errorMessage}`
        });
    }
});

async function updateAuctionWithNewBid(auctionToUpdate, bidJson){
    auctionToUpdate.bids.push({
        biddingUserId: bidJson.biddingUserId,
        createdDate: new Date(),
        amount: Number(bidJson.amount)
    });
    auctionToUpdate.highestBid = Number(bidJson.amount);

    try{
        const updatedAuction = await auctionToUpdate.save();
        return updatedAuction._id;
    }
    catch(e){
        throw new APIError('An error occured while saving auction.', 500);
    }
}

export default router;