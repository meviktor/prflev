import { Router } from 'express';
import models from '../models';
import utils from '../utils';

const router = Router();
const APIError = utils.APIError;

router.post('/', async (req, res) => {
    let userDataJson;

    try{
        if(req.query.userDataJson){
            userDataJson = JSON.parse(decodeURI(req.query.userDataJson));
        }
        else throw new APIError('The parameter contains the user info (userDataJson) is missing.', 400);

        if(!userDataJson.username || !userDataJson.email || !userDataJson.password){
            throw new APIError('The username and/or email is missing!', 400);
        }
    }
    catch(e){
        return res.status(e.httpStatusCode).send({
            errorMessage: `${e.errorMessage}`
        });
    }

    try{
        if(await isThisUsernameAlreadyUsed(userDataJson.username)){
            throw new APIError(`The username '${userDataJson.username}' is already in use.`, 400);
        }
    }
    catch(e){
        return res.status(e.httpStatusCode).send({
            success: false,
            errorMessage: `${e.errorMessage}`
        });
    }

    const newUser = new models.User({
        username: userDataJson.username,
        password: userDataJson.password,
        email: userDataJson.email
    });

    try{
        await newUser.save();
        return res.send({
            success: true
        });
    }
    catch(e){
        return res.status(500).send({
            success: false,
            errorMessage: `An error occured while saving a user. ${e.errorMessage}`
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
        throw new APIError(`An error occured while checking if the username is unique. ${e}`, 500);
    }
    return false;
}

export default router;