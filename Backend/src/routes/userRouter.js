const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

//Create a new user
router.post("/users/create", async(req,res)=>{
    const userData = req.body;
    try {
        const newUser = new User(userData);
        await newUser.save();
        
        res.status(201).send({message: "User created successfully!",user:newUser});
    } catch (error) {
        res.status(400).send({error});
        
    }
})

//Login registered User
router.post("/users/login", async(req,res)=>{
    const{email, password} = req.body;
    const user = await User.findByCredentials(email, password);
     if(user.error) {
        return res.status(400).send({error: user.error});
     }  
        const token = await user.generateAuthToken()
        res.status(201).send({message: "Logged in successfully!", user,token});
 
});

//View User Profile
router.get("/users/profile", auth, (req,res)=>{
    res.status(200).send(req.user);
})

module.exports = router