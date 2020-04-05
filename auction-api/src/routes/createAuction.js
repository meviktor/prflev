import { Router } from 'express';
import models from '../models';
import APIError from '../utils/apiError';

const router = Router();

router.post('/', async (req, res) => {
    let userId = req.user.sub;
    let auctionJson = req.body;

    try{
        if(!auctionJson.endDate || !auctionJson.startingPrice || !auctionJson.incr
            || !auctionJson.product.productCategoryId || !auctionJson.product.name){
            throw new APIError('You have to provide all of the following parameters: endDate, startingPrice, incr, product.productCategoryId, product.name.', 400);
        }

        const createdAuctionId = await createAuction(auctionJson, userId);

        return res.send({
            auctionId: createdAuctionId
        });
    }
    catch(e){
        console.log(e);
        return res.status(e.httpStatusCode).send({
            errorMessage: `${e.errorMessage}`
        });
    }
});

async function createAuction(auctionJson, userId){
    const auctionToSave = new models.Auction({
        ownerUserId: userId,
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