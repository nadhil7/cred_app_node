require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

//databasae
const app = express();
const PORT =process.env.PORT || 4000;

mongoose.connect(process.env.dburi)
const db =mongoose.connection;

db.on('error',(error)=> console.log(error))
db.once('open',()=>console.log('succefully connected'))

//middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(session({
   secret:"secret message",
   saveUninitialized:true,
    resave:false
}))
app.use(express.static('public'))
app.use(express.static('uploads'))

app.use((req,res,next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})

app.set('view engine','ejs')

app.use("",require('./routes/routes'))

app.listen(PORT,()=>{
  console.log(`server is running in http://localhost:${PORT}`);
})



