import { Router } from 'express';
import models from '../models';
import APIError from '../utils/apiError';

const router = Router();

router.post('/', async (req, res) => {
    const userId = req.user.sub;
    let commentJson = req.body;

    try{
        if(!commentJson.auctionId || !commentJson.commentText){
            throw new APIError('You have to provide all of the following parameters: auctionId, commentText.', 400);
        }

        let foundAuction;
        try{
            foundAuction = await models.Auction.findById(commentJson.auctionId);
        }
        catch(e){
            throw new APIError('An error occured whie trying to find an auction.', 500);
        }
        if(!foundAuction){
            throw new APIError('The requested auction does not exist.', 400);
        }

        const updatedAuctionId = await updateAuctionWithNewComment(foundAuction, commentJson.commentText, userId);

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

async function updateAuctionWithNewComment(auctionToUpdate, commentText, userId){
    auctionToUpdate.comments.push({
        commentingUserId: userId,
        createdDate: new Date(),
        commentText: commentText
    });

    try{
        const updatedAuction = await auctionToUpdate.save();
        return updatedAuction._id;
    }
    catch(e){
        throw new APIError('An error occured while saving auction.', 500);
    }
}

export default router;