import mongoose from 'mongoose'

const ObjectId = mongoose.Types.ObjectId;

const auctionSchema = new mongoose.Schema({
    ownerUserId: {type: ObjectId},
    createdDate: {type: Date},
    endDate: {type: Date},
    startingPrice: {type: Number},
    highestBid: {type: Number},
    bids: [
        {
            biddingUserId: {type: ObjectId},
            createdDate: {type: Date},
            amount: {type: Number}
        }
    ],
    comments: [
        {
            commentingUserId: {type: ObjectId},
            createdDate: {type: Date},
            commentText: {type: String}
        }
    ],
    incr: {type: Number},
    product: {
        productCategoryId: {type: ObjectId},
        name: {type: String},
        description: {type: String},
        keywords: [{type: String}]
    }
});

const auction = mongoose.model('Auction', auctionSchema);

export default auction;