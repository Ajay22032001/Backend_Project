const express = require('express');
const msql = require('../src/database');
const verifyToken = require('../src/userAuth')
const decod = require('jwt-decode');

const requestRouter = express.Router();

const Insert_Que = `insert into con(fromUserId,toUserId,status) values (?,?,?)`;

requestRouter.post('/request/send/:status/:toUserId',verifyToken,(req,res)=>{
    const fromUserId =  req.user.id;
    const status = req.params.status;
    const toUserId = req.params.toUserId;
    const f_Name = req.body.f_Name || "Guest";

    msql.query('select * from con where (fromUserId = ? AND toUserId = ?) OR (fromUserId = ? AND toUserId = ?)',[fromUserId,toUserId,toUserId,fromUserId],(err,result)=>{
        if (err) {
            console.error('Error checking request:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }
      
          if (result.length > 0) {
            return res.status(400).json({ message: 'Connection request already exists' });
          } else {
            msql.query(Insert_Que,[fromUserId,toUserId,status],(err,result)=>{
                if(err){
                    res.status(400).send("User are not Present here")
                }
                else{
                    res.json({massege:  req.user.f_Name + " is "+" "+ status+ " to "+ f_Name})
                    return result;
                }
            })

          }
        })
    })


    requestRouter.post('/request/review/:status/:requestId',verifyToken,(req,res)=>{
      const loggedInUser = req.user;
      // const allowedStatus = ["accepetd","rejected"];
      // if(!allowedStatus.includes(status)){
      //   return res.status(400).json({message: "status not allowed" });
      // }

      const requestId = req.params.requestId;
      const toUserId = req.user.id;
      const status = req.params.status;   
      const f_Name = req.body.f_Name || "Guest";

      

      msql.query('select * from con where (fromUserId = ? AND toUserId = ?) OR (fromUserId = ? AND toUserId = ?)',[requestId,toUserId,toUserId,requestId],(err,result)=>{
        if(err){
          res.json(err)
        }
        if (result.length > 0) {
            return res.status(400).json({ message: ' already accepeted' });
          }else{
          msql.query('select * from con where fromUserId = ? AND toUserId = ? AND status = ? ',[requestId,toUserId,"intrested"],(err,result)=>{
        if(err){
          console.error(err);
        }else{
           msql.query(Insert_Que,[requestId,toUserId,status],(err,result)=>{
            if(err){
            console.error("Insert time Error" + err);
            res.json({message: "User are not exits"})
            }
              return res.json({message: req.user.f_Name + " " + status+ " " + f_Name})
        })
        } 
        })
        }
      })
      })
      
module.exports = requestRouter;