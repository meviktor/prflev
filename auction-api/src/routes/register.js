import { Router } from 'express';
import models from '../models';
import APIError from '../utils/apiError';

const router = Router();

router.post('/', async (req, res) => {
    const userDataJson = req.body;
    
    try{
        if(!userDataJson.username || !userDataJson.email || !userDataJson.password){
            throw new APIError('You have to provide all of the following parameters: username, email, password.', 400);
        }

        if(await isThisUsernameAlreadyUsed(userDataJson.username)){
            throw new APIError(`The username '${userDataJson.username}' is already in use.`, 400);
        }

        await registerNewUser(userDataJson);

        return res.send({
            success: true
        });
    }
    catch(e){
        return res.status(e.httpStatusCode).send({
            success: false,
            errorMessage: `${e.errorMessage}`
        });
    }
});

async function isThisUsernameAlreadyUsed(username){
    try{
        if(await models.User.findOne({username: username})){
            return true;
        }
    }
    catch(e){
        throw new APIError('An error occured while checking if the username is unique.', 500);
    }
    return false;
}

async function registerNewUser(userDataJson){
    const newUser = new models.User({
        username: userDataJson.username,
        password: userDataJson.password,
        email: userDataJson.email
    });
    try{
        await newUser.save();
    }
    catch(e){
        throw new APIError('An error occured while saving a new user.', 500);
    }
}

export default router;