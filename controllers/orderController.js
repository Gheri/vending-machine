import mongoose from 'mongoose';
import { OrderSchema } from '../models/orderModel.js';
import { validateOrder } from '../validators/orderValidator.js';
import HTTP_STATUS from "http-status";
import { ProductSchema } from '../models/productModel.js';

const Order = mongoose.model('Order', OrderSchema);
const Product = mongoose.model('Product', ProductSchema);

export const addNewOrder = (req, res) => {
    // input validation
    // TODO move to validation middleware
    const { error, value } = validateOrder(req.body);
    console.log(value);
    if(error) {
        res.status(HTTP_STATUS.BAD_REQUEST).send(error);
        return;
    }

    // TODO take JWT Claim to set author for new document
    const orderToBeAdded = {...req.body, balance: req.body.initialCredit,createdAt: new Date(), createdBy: "Admin", modifiedBy: "Admin"};
    // adding new Order
    let newOrder = new Order(orderToBeAdded);
    newOrder.save((err, order) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
        }
        res.json(order);
    });
};

export const getOrders = (req, res) => {
    Order.find({},{ __v: 0}, (err, orders) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
        }
        res.json(orders);
    });
};

export const getOrderWithId = (req, res) => {
    //TODO validate id is of ObjectIdType

    Order.findById(req.params.orderId, {__v: 0}, (err, order) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
        }
        res.json(order);
    });
};

export const updateOrder = async (req, res) => {
    //TODO validate id is of ObjectIdType

    // input validation
    // TODO move to validation middleware
    const { error, value } = validateOrder(req.body);
    if(error) {
        res.status(HTTP_STATUS.BAD_REQUEST).send(error);
        return;
    }
    const order = await Order.findById(req.params.orderId).exec();
    const product = await Product.findById(req.body.product).exec();
    if (order.status == "Cancelled") {
        res.status(HTTP_STATUS.BAD_REQUEST).send({message: "Order is cancelled"});
        return;
    }
    if (order.status == "Confirmed") {
        res.status(HTTP_STATUS.BAD_REQUEST).send({"message": "Order is already confirmed"});
        return;
    }
    if (order.balance < product.priceInUSD) {
        res.status(HTTP_STATUS.BAD_REQUEST).send({message: "Insufficient Balance"});
        return;
    }
    if (product.quantity == 0) {
        res.status(HTTP_STATUS.BAD_REQUEST).send({message: "Insufficient Stock for given product"});
        return;
    }
    // TODO take JWT Claim to set author for new document
    order.modifiedAt = new Date()
    order.products.push({productId: product._id, name: product.name})
    order.balance -= product.priceInUSD
    // update order
    Order.findOneAndUpdate({ _id: req.params.orderId}, order, { new: true, useFindAndModify: false }, (err, product) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
            return;
        }
        res.json(order);
    });
};

export const cancelOrder = async (req, res) => {
    //TODO validate id is of ObjectIdType
    const order = await Order.findById(req.params.orderId).exec();
    if (order.status == "Confirmed") {
        res.status(HTTP_STATUS.BAD_REQUEST).send({"message": "Order is already confirmed"});
        return;
    }
    if (order.status == "Cancelled") {
        res.status(HTTP_STATUS.BAD_REQUEST).send({"message": "Order is already cancelled"});
        return;
    }
    order.status = "Cancelled"
    order.balance = order.initialCredit
    // update order
    Order.findOneAndUpdate({ _id: req.params.orderId}, order, { new: true, useFindAndModify: false }, (err, product) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
            return;
        }
        res.json(order);
    });
};

export const confirmOrder = async (req, res) => {
    //TODO validate id is of ObjectIdType
    const order = await Order.findById(req.params.orderId).exec();
    if (order.status == "Confirmed") {
        res.status(HTTP_STATUS.BAD_REQUEST).send({"message": "Order is already confirmed"});
        return;
    }
    const products = order.products
    let priceToBeRefund = 0
    for (let i = 0; i < products.length; i++) {
        const product = await Product.findById(products[i].productId).exec();
        if (product.quantity == 0) {
            priceToBeRefund += product.priceInUSD
        }
        else {
            product.quantity -= 1
            await Product.findOneAndUpdate({ _id: product}, product, { new: true, useFindAndModify: false });
        }
    }
    order.status = "Confirmed";
    order.balance +=priceToBeRefund;
    // update order
    Order.findOneAndUpdate({ _id: req.params.orderId}, order, { new: true, useFindAndModify: false }, (err, product) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(err);
            return;
        }
        if (priceToBeRefund > 0) {
            // partial success
            res.status(HTTP_STATUS.MULTI_STATUS).send(or)
        }
        res.json(order);
    });
};
