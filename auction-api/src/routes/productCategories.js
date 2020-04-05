import { Router } from 'express';
import models from '../models';
import APIError from '../utils/apiError';

const router = Router();

router.get('/', async (req, res) => {
    try{
        const allCategories = await getProductCategories();
        return res.send(allCategories.map((category) => {
            return {
                id: category._id,
                name: category.name,
                parentCategoryId: category.parentCategoryId
            };
        }));
    }
    catch(e){
        return res.status(e.httpStatusCode).send({
            errorMessage: `${e.errorMessage}`
        });
    }
});

async function getProductCategories(){
    try{
        return await models.ProductCategory.find();
    }
    catch(e){
        throw new APIError('An error occured while getting the list of product categories.', 500);
    }
}

export default router;