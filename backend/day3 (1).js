const express = require("express");
const mongoose=require("mongoose");

const app=express();
const router = express.Router();

router.use(express.json());

mongoose.connect("mongodb://localhost:27017/pongu")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

const data=new mongoose.Schema({
    Rollno:String,
    name:String,
    age:Number,
    city:String
});

const Person=mongoose.model("Persondata",data);
 
 router.post("/save",async(req,res)=>{
    try{
        const person= new Person(req.body);
        await person.save();
        res.status(201).json({saved:person})
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
 })

router.get("/:rno",async(req,res)=>{
       const rollno=req.params.rno;
       const found = await Person.find({ Rollno: rollno });
       res.status(200).json(found);
 })

router.delete("/:id",async(req,res)=>{
    const rollno = req.params.id;
    const result = await Person.deleteOne({ Rollno: rollno });
    res.status(200).json({
      message: "User deleted successfully",
      user: result
    });
})

router.put("/:rno",async(req,res)=>{
    const rollno=req.params.rno;
    const {name,age,city}=req.body;
    const updated=await Person.findOneAndUpdate(
        {Rollno:rollno},
        {name,age,city},
        {new:true}
    )
     res.status(200).json({
      message: "User updated successfully",
      user: updated
    });
})

app.use("/api", router);

app.listen(3000,()=>{
    console.log("Server runs at port 3000")
})