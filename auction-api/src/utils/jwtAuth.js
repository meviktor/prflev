import 'dotenv/config';
import jwt from 'express-jwt';

const jwtAuth = {};

jwtAuth.validateJwt = function(){
    return jwt({
        secret: process.env.API_SECRET
    }).unless({
        path:[
            '/regiter',
            '/authenticate'
        ]
    });
};

export default jwtAuth;