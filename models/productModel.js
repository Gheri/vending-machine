import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const ProductSchema = new Schema({
    name: {
        type: String,
        required: 'Enter a name'
    },
    description: {
        type: String,
        required: 'Enter a description'
    },
    sellerId: {
        type: String,
        required: 'Seller'
    },
    company: {
        type: String,
        required: 'Enter product company name'
    },
    priceInUSD: {
        type: Number,
        required: 'Enter product price in USD'
    },
    quantity: {
        type: Number,
        required: 'Enter quantity'
    },
    createdAt: {
        type: Date,
    },
    createdBy: {
        type: String,
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    },
    modifiedBy: {
        type: String
    }
});
