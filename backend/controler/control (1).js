const express = require("express");
const mongoose=require("mongoose");
const connectdb= async ()=>{
mongoose.connect("mongodb://localhost:27017/pongu")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));
}

module.exports = connectdb;