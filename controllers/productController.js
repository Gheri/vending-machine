import mongoose from 'mongoose';
import { ProductSchema } from '../models/productModel.js';
import { validateProduct } from '../validators/productValidator.js';
import HTTP_STATUS from "http-status";

const Product = mongoose.model('Product', ProductSchema);

export const addNewProduct = (req, res) => {
    // input validation
    // TODO move to validation middleware
    const { error, value } = validateProduct(req.body);
    console.log(value);
    if(error) {
        res.status(HTTP_STATUS.BAD_REQUEST).send(error);
        return;
    }

    // TODO take JWT Claim to set author for new document
    const productToBeAdded = {...req.body,createdAt: new Date(), createdBy: "Admin", modifiedBy: "Admin"};

    let newProduct = new Product(productToBeAdded);
    newProduct.save((err, product) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
        }
        res.json(product);
    });
};

export const getProducts = (req, res) => {
    Product.find({},{ __v: 0}, (err, products) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
        }
        res.json(products);
    });
};

export const getProductWithId = (req, res) => {
    //TODO validate id is of ObjectIdType

    Product.findById(req.params.productId, {__v: 0}, (err, product) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
        }
        res.json(product);
    });
};

export const updateProduct = (req, res) => {
    //TODO validate id is of ObjectIdType

    // input validation
    // TODO move to validation middleware
    const { error, value } = validateProduct(req.body);
    if(error) {
        res.status(HTTP_STATUS.BAD_REQUEST).send(error);
        return;
    }

    // TODO take JWT Claim to set author for new document
    const productToBeUpdated = {...req.body, modifiedAt: new Date(), modifiedBy: "Admin"};

    // update product
    Product.findOneAndUpdate({ _id: req.params.productId}, productToBeUpdated, { new: true, useFindAndModify: false }, (err, product) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
            return;
        }
        res.json(product);
    });
};

export const deleteProduct = (req, res) => {
    //TODO validate id is of ObjectIdType

    Product.findOneAndRemove({ _id: req.params.productId}, (err, product) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
            return;
        }
        res.sendStatus(HTTP_STATUS.NO_CONTENT);
    });
};
