import mongoose from 'mongoose';

import User from './user';
import ProductCategory from './productCategory';
import Auction from './auction';

const connectDb = () => {
  return mongoose.connect(process.env.DATABASE_URL);
};


const models = { User, ProductCategory, Auction };

export { connectDb };

export default models;