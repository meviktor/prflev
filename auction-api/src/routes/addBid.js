import { Router } from 'express';
import models from '../models';

const router = Router();

router.post('/', async (req, res) => {
    let bidJson;
    try{
        if(req.query.bidJson){
            bidJson = JSON.parse(decodeURI(req.query.bidJson));
        }
        else throw new Error('The parameter contains the bid info (bidJson) is missing.');

        if(!bidJson.auctionId || !bidJson.biddingUserId || !bidJson.amount || isNaN(bidJson.amount)){
            throw new Error('One or more required field is missing.');
        }
    }
    catch(e){
        return res.status(400).send({
            errorMessage: `${e}`
        });
    }

    let foundAuction = await models.Auction.findById(bidJson.auctionId);
    try{
        if(!foundAuction.highestBid){
            if(!(Number(bidJson.amount) >= foundAuction.startingPrice)){
                throw new Error(`The starting bid cannot be lower than the starting price (${foundAuction.startingPrice}).`);
            }
        }
        else{
            const lowestPossibleBid = foundAuction.highestBid + foundAuction.incr;
            if(!(Number(bidJson.amount) >= lowestPossibleBid)){
                throw new Error(`The new bid must be greater than or equal to the last bid plus the increment (${lowestPossibleBid}).`);
            }
        }
    }
    catch(e){
        return res.status(400).send({
            errorMessage: `${e}`
        });
    }

    foundAuction.bids.push({
        biddingUserId: bidJson.biddingUserId,
        createdDate: new Date(),
        amount: Number(bidJson.amount)
    });
    foundAuction.highestBid = Number(bidJson.amount);

    foundAuction.save()
    .then((document) => {
        res.send({
            auctionId: document._id
        });
    })
    .catch((error) => {
        res.status(500).send({
            errorMessage: `An error occured while saving auction. ${error}`
        });
    });
});

export default router;