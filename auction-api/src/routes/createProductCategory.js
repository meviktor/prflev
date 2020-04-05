import { Router } from 'express';
import models from '../models';
import APIError from '../utils/apiError';

const router = Router();

router.post('/', async (req, res) => {
    let productCategoryJson;

    try{
        if(req.query.productCategoryJson){
            productCategoryJson = JSON.parse(decodeURI(req.query.productCategoryJson));
        }
        else{
            throw new APIError('The parameter contains the product category info (productCategoryJson) is missing.', 400);
        }

        const pcid = productCategoryJson.parentCategoryId;
        let parentCategory;
        try{
            parentCategory = await models.ProductCategory.findById(pcid);
        }
        catch(e){
            throw new APIError('An error occured while searching for a product category.', 500);
        }
        if(pcid && !parentCategory){
            throw new APIError(`No existing parent category found with this id: ${pcid}`, 400);  
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