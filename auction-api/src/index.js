import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import { connectDb } from './models';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/queryAuctions', routes.queryAuctions);
app.use('/createAuction', routes.createAuction);
app.use('/productCategories', routes.productCategories);
app.use('/auctionDetails', routes.auctionDetails);
app.use('/addBid', routes.addBid);
app.use('/createProductCategory', routes.createProductCategory);
app.use('/register', routes.register);

connectDb().then(async () => {
    app.listen(process.env.API_PORT, () =>
        console.log(`auction-api is listening on port ${process.env.API_PORT}!`),
    );
});