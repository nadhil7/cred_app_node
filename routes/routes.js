const express = require('express');
const router = express.Router();
const User= require('../models/users')
const multer= require('multer')
const fs = require('fs')

var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads')
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    }
})
var upload = multer({
    storage:storage,
}).single('image');

router.post('/add',upload,async(req,res)=>{
    try{
        const user=new User({
            name: req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            image:req.file.filename
        });
        await user.save();
        req.session.message={
            type:"success",
            message:"user added successfully"
        }
        res.redirect('/');
    }
    catch(err){
        res.json({message:err.message,type:"danger"})
    }
})

router.get("/login",(req,res)=>{
    res.render  ("login",{title:'Users Page'})
})
router.get("/",async(req,res)=>{
    try{
        const users =await User.find();
        res.render  ("index",{title:'Home Page',users :users});
    }
    catch(err){
        res.json({message:err.message})
        
    }
});
router.get("/users",(req,res)=>{
    res.render  ("add",{title:'Users Page'})
})

router.get("/edit/:id", async(req,res)=>{
    try{
        const user= await User.findById(req.params.id);  
        res.render("edit_user",{title:"edit_page",user:user});
    }
    catch(err){
        res.status(500).send("user not found");
    }
});
router.post('/update/:id', upload, async (req, res) => {
    let id = req.params.id
    let new_image = ""

    if (req.file) {
        new_image = req.file.filename
        try {
            fs.unlinkSync("./uploads/" + req.body.old_image)
        }
        catch (err) {
            console.log(err);

        }
    }
    else {
        new_image = req.body.old_image
    }
    try {
        await User.findByIdAndUpdate(id, {
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
            image: new_image,
        })
        req.session.message = {
            type: "success",
            message: "User Updated from the table"

        }
        res.redirect("/")
    }
    catch (err) {
        res.json({ message: err.message, type: "danger !" })
    }
});

router.get("/delete/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found !");
        }

        try {
            fs.unlinkSync("./uploads/" + user.image);
        } catch (err) {
            console.log("Image deletion error:", err);
        }

        await User.findByIdAndDelete(req.params.id);

        req.session.message = {
            type: "info",
            message: "User deleted from the table",
        };

        res.redirect("/");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;