import { Router } from 'express';
import models from '../models';
import APIError from '../utils/apiError';

const router = Router();

router.get('/', async (req, res) => {
    let userId = req.user.sub;

    try{
        const auctionList = await findAuctionsWonByUser(userId)
        return res.send(auctionList);
    }
    catch(e){
        console.log(e);
        return res.status(e.httpStatusCode).send({
            errorMessage: `${e.errorMessage}`
        });
    }
});

async function findAuctionsWonByUser(userId){
    try{
        let mapRed = {};
        mapRed.map = function(){
            if(this.bids.length){
                if(this.bids.sort((bid1, bid2) => bid1.amount - bid2.amount).reverse()[0].biddingUserId == USER_ID
                    && new Date(this.endDate) < new Date()){
                    emit(USER_ID, {
                        id: this._id,
                        startedAt: this.createdDate,
                        endsAt: this.endDate,
                        productName: this.product.name,
                        startingPrice: this.startingPrice,
                        actualPrice: this.actualPrice,
                        numberOfComments: this.comments.length
                    });
                }
            }
        }
        mapRed.reduce = function(key, values){
            return {values};
        }
        mapRed.scope = {
            USER_ID: userId
        }
        const mapReduceOutput = (await models.Auction.mapReduce(mapRed)).results;
        // no auction found
        if(!mapReduceOutput.length){
            return mapReduceOutput;
        }
        // more than one auctions found
        else if(Array.isArray(mapReduceOutput[0].value.values)){
            return mapReduceOutput[0].value.values;
        }
        // one auction found
        else{
            return [mapReduceOutput[0].value];
        }
    }
    catch(e){
        throw new APIError(`An error occured while searching for auctions.`, 500);
    }
}

export default router;