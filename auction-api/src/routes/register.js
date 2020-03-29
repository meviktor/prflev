import { Router } from 'express';
import models from '../models';

const router = Router();

// This state stays until there is no authentication in the API.
router.post('/', (req, res) => {
    let userDataJson;
    try{
        if(req.query.userDataJson){
            userDataJson = JSON.parse(decodeURI(req.query.userDataJson));
        }
        else throw new Error('The parameter contains the user info (userDataJson) is missing.');

        if(!userDataJson.username || !userDataJson.email){
            throw new Error('The username and/or email is missing!');
        }

        //TODO: delete this after the API was tested and started to develop the authentication part!
        userDataJson.password = "";
    }
    catch(e){
        return res.status(400).send({
            errorMessage: `${e}`
        });
    }

    const newUser = new models.User({
        username: userDataJson.username,
        password: userDataJson.password,
        email: userDataJson.email
    });

    newUser.save()
    .then((document) => {
        res.send({
            userId: document._id
        });
    })
    .catch((error) => {
        res.status(500).send({
            errorMessage: `An error occured while saving new user. ${error}`
        });
    });
});

export default router;