const mongoose=require("mongoose");
const data=new mongoose.Schema({
    Rollno:String,
    name:String,
    password:String,
    phy:{type:Number,min:0,max:100},
    che:{type:Number,min:0,max:100},
    math:{type:Number,min:0,max:100},
    cs:{type:Number,min:0,max:100},
    eng:{type:Number,min:0,max:100}
});

const Person=mongoose.model("Persondata",data);

module.exports=Person;