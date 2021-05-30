import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const OrderSchema = new Schema({
    description: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "InProgress"
    },
    initialCredit:{
        type: Number,
        required: 'Enter credit money'
    },
    initialCreditCurrencyType:{
        type: String,
        required: 'Enter the currency for credit money'
    },
    balance:{
       type: Number,
    },
    products: {
        type: Array,
        default:[]
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