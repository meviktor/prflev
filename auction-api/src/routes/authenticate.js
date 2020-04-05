import 'dotenv/config';
import { Router } from 'express';
import models from '../models';
import jwt from 'jsonwebtoken';
import APIError from '../utils/apiError';

const router = Router();

router.post('/', async (req, res) => {
    let userDataJson;

    try{
        if(req.query.userDataJson){
            userDataJson = JSON.parse(decodeURI(req.query.userDataJson));
        }
        else throw new APIError('The parameter contains the user info (userDataJson) is missing.', 400);

        if(!userDataJson.username || !userDataJson.password){
            throw new APIError('The username and/or password is missing!', 400);
        }

        const token = await authenticateUser(userDataJson.username, userDataJson.password);
        if(!token){
            throw new APIError('Invalid username and/or password.', 401);
        }

        return res.send({
            success: true,
            accessToken: token
        });
    }
    catch(e){
        return res.status(e.httpStatusCode).send({
            success: false,
            errorMessage: `${e.errorMessage}`
        });
    }
});

async function authenticateUser(username, password){
    let user, validCredentials;
    try{
        user = await models.User.findOne({ username });
    }
    catch(e){
        throw new APIError(`An error occured while checking the existence of the user ${username}. ${e}`, 500);
    }
    if(!user) return null;

    try{
        validCredentials = await user.isPasswordValid(password);
    }
    catch(e){
        throw new APIError(`An error occured while checking the validity of a password. ${e}`, 500);
    }
    if(!validCredentials) return null;

    return jwt.sign({sub: user._id}, process.env.API_SECRET);
}

export default router;