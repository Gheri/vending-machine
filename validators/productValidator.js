import Joi from "joi";
import config from "config";
const options = config.get("joiValidationOptions");


 // define base schema rules
 const productRequestSchemaRules = {
    name: Joi.string().required(),
    description: Joi.string().required(),
    company: Joi.string().required(),
    productPriceInUSD: Joi.number().required(),
    sellerId: Joi.string().required(),
    quantity: Joi.number().positive().required(),
};


const ProductRequestSchema = Joi.object(productRequestSchemaRules);

export const validateProduct = (req) => ProductRequestSchema.validate(req.body, options)
