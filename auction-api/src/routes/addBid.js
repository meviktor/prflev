import { Router } from 'express';
import models from '../models';
import APIError from '../utils/apiError';

const router = Router();

router.post('/', async (req, res) => {
    const userId = req.user.sub;
    let bidJson = req.body;

    try{
        if(!bidJson.auctionId || !bidJson.amount || isNaN(bidJson.amount)){
            throw new APIError('You have to provide all of the following parameters: auctionId, amount.', 400);
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

        const updatedAuctionId = await updateAuctionWithNewBid(foundAuction, bidJson.amount, userId);

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

async function updateAuctionWithNewBid(auctionToUpdate, bidAmount, userId){
    auctionToUpdate.bids.push({
        biddingUserId: userId,
        createdDate: new Date(),
        amount: Number(bidAmount)
    });
    auctionToUpdate.highestBid = Number(bidAmount);

    try{
        const updatedAuction = await auctionToUpdate.save();
        return updatedAuction._id;
    }
    catch(e){
        throw new APIError('An error occured while saving auction.', 500);
    }
}

export default router;