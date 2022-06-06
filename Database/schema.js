const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    userID:{
        type: String,
        required: true
    },
    marketID:{
        type: String,
        required: true
    },
    marketName:{
        type: String, 
    },
    cmdtyID: {
        type: String,
        required: true,
    },
    marketType: {
        type: String,
    },
    cmdtyName: {
        type: String,
        required: true,
    },
    priceUnit: {
        type: String,
        required: true,
    },
    convFctr: {
        type: Number,
    },
    price: {
        type: Number,
        required: true,
    },
    priceInKg: {
        type: Number,
        required: true,
    }
});

const aggregatedReportSchema = new mongoose.Schema({
    
    cmdtyName: {
        type: String,
    },
    cmdtyID: {
        type: String,
        required: true,
    },
    marketID:{
        type: String,
        required: true
    },
    marketName:{
        type: String, 
    },
    users: {
        type: Array,
        default:[]
    },
    priceUnit: {
        type: String,
        required: true,
    },
    aggrPrice: {
        type:Number,
        required: true
    },
},
{ timestamps: true });


const Report =  new mongoose.model("Report",reportSchema);
const AggregateReport = new mongoose.model("AggregateReport",aggregatedReportSchema);


module.exports = { Report , AggregateReport } ;