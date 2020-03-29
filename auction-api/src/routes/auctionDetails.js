import { Router } from 'express';
import models from '../models';

const router = Router();

router.get('/', (req, res) => {
    let auctionId;
    try{
        if(req.query.auctionId){
            auctionId = decodeURI(req.query.auctionId);
        }
        else throw new Error('The parameter contains the auction id (auctionId) is missing.');
    }
    catch(e){
        return res.status(400).send({
            errorMessage: `${e}`
        });
    }

    getAuctionDetails(auctionId)
    .then((result) => {
        res.send(result);
    })
    .catch((error) => {
        res.status(500).send({
            errorMessage: `An error occured while getting auction details. ${error}`
        });
    });
});

async function getAuctionDetails(auctionId){
   const foundAuctionDoc = await models.Auction.findById(auctionId);
   const foundUser  = await models.User.findById(foundAuctionDoc.ownerUserId);

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
        const biddingUser = await models.User.findById(foundAuctionDoc.bids[i].biddingUserId);
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