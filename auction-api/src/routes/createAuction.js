import { Router } from 'express';
import models from '../models';

const router = Router();

router.post('/', (req, res) => {
    let auctionJson;
    try{
        if(req.query.auctionJson){
            auctionJson = JSON.parse(decodeURI(req.query.auctionJson));
        }
        else throw new Error('The parameter contains the query (auctionJson) is missing.');

        if(!auctionJson.ownerUserId || !auctionJson.endDate || !auctionJson.startingPrice || !auctionJson.incr
            || !auctionJson.product.productCategoryId || !auctionJson.product.name){
            throw new Error('One or more required field is missing.');
        }
    }
    catch(e){
        return res.status(400).send({
            errorMessage: `${e}`
        });
    }

    var auctionToSave = new models.Auction({
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

    auctionToSave.save()
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