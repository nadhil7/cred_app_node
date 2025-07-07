const express = require('express');
const router = express.Router();
const User= require('../models/users')
const multer= require('multer')

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
module.exports = router;