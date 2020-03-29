import mongoose from 'mongoose'

const ObjectId = mongoose.Types.ObjectId

const productCategorySchema = new mongoose.Schema({
    name: {type: String},
    parentCategoryId: {type: ObjectId},
});

const productCategory = mongoose.model('ProductCategory', productCategorySchema);

export default productCategory;