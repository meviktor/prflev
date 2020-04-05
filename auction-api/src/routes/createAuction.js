import { Router } from 'express';
import models from '../models';
import APIError from '../utils/apiError';

const router = Router();

router.post('/', async (req, res) => {
    let auctionJson;

    try{
        if(req.query.auctionJson){
            auctionJson = JSON.parse(decodeURI(req.query.auctionJson));
        }
        else throw new APIError('The parameter contains the query (auctionJson) is missing.', 400);

        if(!auctionJson.ownerUserId || !auctionJson.endDate || !auctionJson.startingPrice || !auctionJson.incr
            || !auctionJson.product.productCategoryId || !auctionJson.product.name){
            throw new APIError('One or more required field is missing.', 400);
        }

        const createdAuctionId = await createAuction(auctionJson);

        return res.send({
            auctionId: createdAuctionId
        });
    }
    catch(e){
        return res.status(e.httpStatusCode).send({
            errorMessage: `${e.errorMessage}`
        });
    }
});

async function createAuction(auctionJson){
    const auctionToSave = new models.Auction({
        ownerUserId: auctionJson.ownerUserId,
        createdDate: new Date(),
        endDate: new Date(auctionJson.endDate),
        startingPrice: auctionJson.startingPrice,
        highestBid: undefined,
        bids: [],
        incr: auctionJson.incr,
        product: {
            productCategoryId: auctionJson.product.productCategoryId,
            name: auctionJson.product.name,
            description: auctionJson.product.description ? auctionJson.product.description : "",
            keywords: auctionJson.product.keywords ? auctionJson.product.keywords : []
        }
    });

    try{
        const savedAuction = await auctionToSave.save();
        return savedAuction._id;
    }
    catch(e){
        throw new APIError('An error occured while saving an auction.', 500);
    }
}

export default router;