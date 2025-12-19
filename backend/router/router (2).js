const express=require("express");
const router = express.Router();
const jwt=require("jsonwebtoken");
const Person=require("../model/model");
const bcrypt = require("bcryptjs");
const JWT_SECRET="mine";


router.use(express.json());

//autherisation
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

router.get("/verify-token", authMiddleware, (req, res) => {
  res.json({ message: "Token valid",user:req.user});
});

router.get("/", authMiddleware, async (req, res) => {
  const persons = await Person.find();
  res.json(persons);
});

router.post("/register", async (req, res) => {
  const { name, Rollno, password } = req.body;

  if (!name || !Rollno || !password) {
    return res.status(400).json({ message: "name, Rollno, password required" });
  }

  const existing = await Person.findOne({ Rollno });
  if (existing) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const person = new Person({
    name,
    Rollno,
    password: hashedPassword
  });

  await person.save();

  res.status(201).json({ message: "Registered successfully" });
});


router.post("/login", async (req, res) => {
  const { Rollno, password } = req.body;

  const user = await Person.findOne({ Rollno });
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ Rollno }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});


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

router.put("/marks", authMiddleware, async (req, res) => {
  const { phy, che, math, cs, eng } = req.body;

  const updated = await Person.findOneAndUpdate(
    { Rollno: req.user.Rollno },
    { phy, che, math, cs, eng },
    { new: true }
  );

  res.json({
    message: "Marks updated successfully",
    user: updated
  });
});


module.exports=router;