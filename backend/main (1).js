const express = require("express");
const condb=require("./controler/control")
const personRouter= require("./router/router");

const app = express();

app.use("/",personRouter);

app.use(express.json());

condb();

app.listen(3000,()=>{
    console.log("server running");
})

      