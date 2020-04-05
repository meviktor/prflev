import { Router } from 'express';
import models from '../models';

const router = Router();

router.get('/', (req, res) => {
    console.log(req.user.sub);
    getProductCategories()
    .then((documents) => {
        res.send(documents.map((doc) => {
            return {
                id: doc._id,
                name: doc.name,
                parentCategoryId: doc.parentCategoryId
            };
        }));
    })
    .catch((error) => {
        res.status(500).send({
            errorMessage: `An error occured while getting the list of product categories. ${error}`
        });
    });
});

async function getProductCategories(){
    return await models.ProductCategory.find();
}

export default router;