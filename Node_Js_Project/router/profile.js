const express = require('express');
const verifyToken = require('../src/userAuth');
const msql = require('../src/database');

const profileRouter = express.Router();


profileRouter.get('/profile/view',verifyToken,(req,res)=>{
    const user = req.user;
    
    res.send(user)
//    const cookie = req.cookies;
//    console.log(cookie);
})


profileRouter.patch('/profile/edit',verifyToken,(req,res)=>{
   const {f_Name,l_Name,age,email,phone} = req.body;

   const Insert_Qu = 'update student set  f_Name =?, l_Name =? ,age = ? where email = ? AND phone = ?'

   msql.query(Insert_Qu,[f_Name,l_Name,age,email,phone],(err,result)=>{
    if(err){
        console.error("User are not");
    }
    else{
        res.status(200).json({ message: 'All set for Login' });
        return result;
    }
   })
})

// <<=========  GET DATA  ===========>>

// profileRouter.get("/data",(req,res)=>{

//     msql.query('select * from con where toUserId = ?',[1],(err,result)=>{
//         if(err) console.error(err);
//         else res.send(result);
        
//     })
// })


 module.exports = profileRouter;