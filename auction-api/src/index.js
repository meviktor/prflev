import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import { connectDb } from './models';
import utils from './utils';

const app = express();

app.use(express.json());
app.use(cors());
app.use(utils.jwtAuth.validateJwt());
app.use(function(err, req, res, next) {
    if (err && err.name === 'UnauthorizedError') {
      res.status(401).send({
          errorMessage: 'Access token is missing or invalid!'
      });
    }
});

app.use('/queryAuctions', routes.queryAuctions);
app.use('/createAuction', routes.createAuction);
app.use('/productCategories', routes.productCategories);
app.use('/auctionDetails', routes.auctionDetails);
app.use('/addBid', routes.addBid);
app.use('/createProductCategory', routes.createProductCategory);
app.use('/register', routes.register);
app.use('/authenticate', routes.authenticate);
app.use('/addComment', routes.addComment);
app.use('/userDetails', routes.userDetails);

connectDb().then(async () => {
    app.listen(process.env.API_PORT, () =>
        console.log(`auction-api is listening on port ${process.env.API_PORT}!`),
    );
});