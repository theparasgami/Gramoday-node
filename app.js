const express = require("express");
const dotenv=require("dotenv");
const bodyParser= require("body-parser");

const app = express();

//env
dotenv.config({path:'./.env'});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

//DATABASE
require("./Database/conn");

//
app.use(require("./Routes/reports"));

//connection
const PORT = 8888;
app.listen(PORT, console.log(`Server started on port ${PORT}`));


module.exports = app;