import { Router } from 'express';
import models from '../models';
import APIError from '../utils/apiError';

const router = Router();

router.get('/', async (req, res) => {
    let userId;

    try{
        if(req.query.userId){
            userId = decodeURI(req.query.userId);
        }
        else{
            userId = req.user.sub;
        }

        const userDetails = await getUserDetails(userId);

        return res.send(userDetails);
    }
    catch(e){
        return res.status(e.httpStatusCode).send({
            errorMessage: `${e.errorMessage}`
        });
    }
});

async function getUserDetails(userId){
   let foundUser;

   try{
       foundUser = await models.User.findById(userId);
   }
   catch(e){
        throw new APIError('An error occured wile trying to find a user.', 500);
   }

   const userDetails = {
       id: foundUser._id,
       username: foundUser.username,
       email: foundUser.email
   };

   return userDetails;
}

export default router;