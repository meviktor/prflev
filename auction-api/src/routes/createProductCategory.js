import { Router } from 'express';
import models from '../models';

const router = Router();

router.post('/', async (req, res) => {
    let productCategoryJson;
    try{
        if(req.query.productCategoryJson){
            productCategoryJson = JSON.parse(decodeURI(req.query.productCategoryJson));
        }
        else throw new Error('The parameter contains the product category info (productCategoryJson) is missing.');

        const pcid = productCategoryJson.parentCategoryId;
        if(pcid && !await models.ProductCategory.findById(pcid)){
            throw new Error(`Parameter parentCategoryId is invalid. No existing category found with this id: ${pcid}`);   
        }
    }
    catch(e){
        return res.status(400).send({
            errorMessage: `${e}`
        });
    }

    const newCategory = new models.ProductCategory({
        name: productCategoryJson.name,
        parentCategoryId: productCategoryJson.parentCategoryId
    });

    newCategory.save()
    .then((document) => {
        res.send({
            categoryId: document._id
        });
    })
    .catch((error) => {
        res.status(500).send({
            errorMessage: `An error occures while saving product category. ${error}`
        });
    });
});

export default router;