const express = require('express');
const msql = require('./database');

const app = express();
app.use(express.json());

 const ss = msql.connect((err)=>{

    if(err) console.error(err);
    console.log("dataBase Connected");

    //    <<--------MIDDLEWARE ROUTERS-------->

    app.use("/test",(req,res,next) => {
        res.send("happy response");
        next();
    });
    app.use("/hello",(req,res,next)=>{
        res.send("hello hello");
        next();
    })


    //    <<-------- INSERT DATA IN DATABASE -------->


    app.post("/post",(req,res)=>{
        const sid = req.body.id;
        const name = req.body.name;

        msql.query('insert into st values(?,?)',[sid,name],(err,result)=>{
            if(err) console.error(err);
            else res.send("Posted");
        })
    })

    //    <<--------SHOW DATA-------->

    app.get("/fetch",(req,res)=>{
        msql.query('select * from student',function(err,result,feild){
            if(err) console.error(err);  
            else res.send(result);
        })
    })


//    <<--------SHOW DATA-------->

    app.get("/fetchbyid/:id",(req,res)=>{
        const fetchid = req.params.id;
        
        msql.query( 'select * from student where sid = ?;',fetchid,(err,result)=>{
            if(err) console.error(err);
            else  res.send(result);
        })
    })


    // <---------UPDATE-------->

    app.put("/update/:id",(req,res)=>{
        const sid = req.params.id;
        const name =req.body.name;

        msql.query('update student set name=? where sid = ?',[name,sid],(err,result)=>{
            if(err) console.log(err);
            else res.send("UPDATES");
            
        })
    })

    //    <<--------DELETE DATA-------->

    app.delete("/deletedata/:id",(req,res)=>{
        const delid = req.params.id;

        msql.query('delete from student where sid=?',delid,(err,result)=>{
            if(err) console.error(err);
            else res.send("deleted");
            console.log(result);
            
            
        })
    })

    app.listen(7777,()=>{
        console.log("server are connected");
        
    })
})

module.exports = ss;


