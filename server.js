const express  = require('express');
require('dotenv').config();
const clc = require('cli-color')
const mongoose = require('mongoose');



//file-imports
const { cleanupAndValidate } = require('./utils/authUtils');
const userModel =require('./models/userModel')


//constants
const app = express();
const PORT = process.env.PORT || 8000;

//middlewares
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//DB connection
mongoose
  .connect(process.env.MONGO_URL)
   .then(()=>{
    console.log(clc.yellowBright('MongoDb connected successfully'));
   })
   .catch((err)=>{
    console.log(clc.redBright(err));
  });

app.get('/',(req,res) =>{
    return res.send('server is running');
});

//register
app.get('/register',(req,res)=>{
    return res.render("register");
});

app.post("/register",async (req,res)=>{
    const {name,email,username,password} = req.body;
    //data validation
    try{
        await cleanupAndValidate({name,email,username,password});
    }catch(error){
      return res.send({
        status : 400,
        msg:"data error",
        error:error 
      })
    }
   
    //email and username are unique
    
        const userEmailExist = userModel.findOne({email:email});

        if(userEmailExist){
            return res.send({
                status:400,
                msg:"Email already exist",
            })
        }

        const userNameExist = await userModel.findOne({username});
        if(userNameExist){
            return res.send({
                status:400,
                msg:"username already exist",
            })
        }
        

    
 
    //store data in DB
    const userObj = new userModel({
        //schema key : value
        name:name,
        email:email,
        username:username,
        password:password,

    })

    try{
        const userDb = await userObj.save()

        return res.send({
            status:201,
            msg:"user created, registration successfull!",
            data:userDb
        })
    }catch(error){
        return res.send({
            status : 500,
             msg:"database error",
             error:error
        })
    }
    
    // return res.send("Registration successfull");
});

//login
app.get('/login',(req,res)=>{
    return res.render("login");
});

app.post("/login",(req,res)=>{
    console.log(req.body);
    return res.send("login successfull");
});

app.listen(PORT,()=>{
    console.log(clc.yellowBright(`http://localhost:${PORT}`));
})