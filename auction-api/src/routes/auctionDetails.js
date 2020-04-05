import { Router } from 'express';
import models from '../models';
import APIError from '../utils/apiError';

const router = Router();

router.get('/', async (req, res) => {
    let auctionId;

    try{
        if(req.query.auctionId){
            auctionId = decodeURI(req.query.auctionId);
        }
        else{
            throw new APIError('The parameter contains the auction id (auctionId) is missing.', 500);
        }

        const auctionDetails = await getAuctionDetails(auctionId);

        return res.send(auctionDetails);
    }
    catch(e){
        return res.status(e.httpStatusCode).send({
            errorMessage: `${e.errorMessage}`
        });
    }
});

async function getAuctionDetails(auctionId){
   let foundAuctionDoc, foundUser;

   try{
       foundAuctionDoc = await models.Auction.findById(auctionId);
   }
   catch(e){
       throw new APIError('An error occured wile trying to find an auction.', 500);
   }
   try{
       foundUser = await models.User.findById(foundAuctionDoc.ownerUserId);
   }
   catch(e){
        throw new APIError('An error occured wile trying to find a user.', 500);
   }

   const auctionDetails = {
       id: foundAuctionDoc._id,
       ownerUserId: foundAuctionDoc.ownerUserId,
       ownerUserName: foundUser.username,
       startedAt: foundAuctionDoc.createdDate,
       endsAt: foundAuctionDoc.endDate,
       startingPrice: foundAuctionDoc.startingPrice,
       highestBid: foundAuctionDoc.highestBid,
       incr: foundAuctionDoc.incr,
       product: {
           productCategoryId: foundAuctionDoc.product.productCategoryId,
           name: foundAuctionDoc.product.name,
           description: foundAuctionDoc.product.description,
           keywords: foundAuctionDoc.product.keywords
       }
   };

   let bids = [];
   for(let i = 0; i < foundAuctionDoc.bids.length; ++i){
        let biddingUser;
        try{
            biddingUser = await models.User.findById(foundAuctionDoc.bids[i].biddingUserId);
        } 
        catch(e){
            throw new APIError('An error occured wile trying to find a user.', 500);
        }
        const biddingUserName = biddingUser.username;

        bids[i] = {
            biddingUserId: foundAuctionDoc.bids[i].biddingUserId,
            biddingUserName: biddingUserName,
            amount: foundAuctionDoc.bids[i].amount,
            createdDate: foundAuctionDoc.bids[i].createdDate
        };
   }
   auctionDetails.bids = bids;

   return auctionDetails;
}

export default router;