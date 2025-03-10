const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system");

const express = require("express");
const app =express();

app.use(express.urlencoded({ extended: true }));


//for user route
const userRoute = require('./routes/userRoute');
app.use('/', userRoute);

app.listen(5000,function(){
    console.log("service is running....");
})