// const { resolve } = require("path")
const validator = require('validator');
const cleanupAndValidate = ({name,email,username,password}) =>{
    console.log(name,email,username,password);
    return new Promise((resolve,reject)=>{
      //reject()
      if(!name || !email || !username || !password) reject("Missing credentials");
       
       if(typeof name !== "string") reject("datatype of name is wrong");
       if(!validator.isEmail(email)) reject("Email formate is wrong");
       if(typeof username !== "string") reject("datatype of name is wrong");
       if(typeof password !== "string") reject("datatype of name is wrong"); 

      
      
      resolve();
    })
}

module.exports = {cleanupAndValidate}