import { Router } from 'express';
import models from '../models';
import APIError from '../utils/apiError';

const router = Router();

router.post('/', async (req, res) => {
    const productCategoryJson = req.body;

    try{
        if(!productCategoryJson.name){
            throw new APIError('You have to provide all of the following parameters: name.', 400);
        }

        const pcid = productCategoryJson.parentCategoryId;
        let parentCategory;
        if(pcid){
            try{
                parentCategory = await models.ProductCategory.findById(pcid);
            }
            catch(e){
                throw new APIError('An error occured while searching for a product category.', 500);
            }
            if(!parentCategory){
                throw new APIError(`No existing parent category found with this id: ${pcid}`, 400);  
            }
        }

        const createdCategoryId = await createProductCategory(productCategoryJson);

        return res.send({
            categoryId: createdCategoryId
        });
    }
    catch(e){
        return res.status(e.httpStatusCode).send({
            errorMessage: `${e.errorMessage}`
        });
    }
});

async function createProductCategory(productCategoryJson){
    const newCategory = new models.ProductCategory({
        name: productCategoryJson.name,
        parentCategoryId: productCategoryJson.parentCategoryId
    });

    try{
        const savedCategory = await newCategory.save();
        return savedCategory._id;
    }
    catch(e){
        throw new APIError('An error occured while saving a product category.', 500);
    }
}

export default router;