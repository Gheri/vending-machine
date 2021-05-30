import Joi from "joi";
import config from "config";
const options = config.get("joiValidationOptions");


 // define base schema rules
 const orderRequestSchemaRules = {
    description: Joi.string(),
    initialCredit: Joi.number().required(),
    initialCreditCurrencyType: Joi.string().required()
};


const OrderRequestSchema = Joi.object(orderRequestSchemaRules);

export const validateOrder = (req) => OrderRequestSchema.validate(req.body, options)
