const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const msql = require('../src/database');

const authRouter = express.Router();

 // Generate JWT token
 const generateToken = (user)=>{
    return jwt.sign({ email: user.email, id: user.id, f_Name: user.f_Name }, "DEV@AJAY123@", { expiresIn: '10m' });
} 

    authRouter.post("/signup",

        [
            body('f_Name').isString().isLength({ min: 3, max: 50 }).withMessage('Name must be between 3-50 characters'),
            body('l_Name').isString().isLength({ min: 3, max: 50 }).withMessage('Name must be between 3-50 characters'),
            body('phone').isNumeric().withMessage("Enter number").isLength({min:10,max:12}),
            body('email').isEmail().withMessage('Invalid email format'),
            body('age').isNumeric().isLength({min:1,max:2}),
            body('password').isStrongPassword().withMessage("Invalid Password").isLength({max:8}).withMessage("length upto 8 digit"),
            body('photo_url').isString().isLength({ min: 3, max: 500 }).withMessage('Name must be between 3-50 characters'),
            body('skill').isString().isLength({ min: 3, max: 50 }).withMessage('Name must be between 3-50 characters'),

        ],

        async (req,res)=>{

        const error = validationResult(req);
        if(!error.isEmpty()) return res.status(400).json({error : error})

        const f_Name  = req.body.f_Name;
        const l_Name  = req.body.l_Name;
        const phone = req.body.phone;
        const skill  = req.body.skill;
        const photo_url  = req.body.photo_url;
        const age = req.body.age;
        const email = req.body.email;
        const password = req.body.password;

        const passwordHash = await bcrypt.hash(password, 10);
        // console.log(passwordHash);



        msql.query("SELECT * FROM student WHERE email = ?", [email], async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: "User already exists" });
            }else{

                const INSERT_QUERY = ('insert into student(f_Name,l_Name,phone,email,age,password,photo_url,skill) values (?,?,?,?,?,?,?,?)');
                msql.query(INSERT_QUERY,[f_Name,l_Name,phone,email,age,passwordHash,photo_url,skill],(err,result)=>{
    
                    if(err) console.error(err);
                    res.status(200).send("User Register Successfully");
                    return result;
                })
            }
        })
    })

    const loggedInUser = authRouter.post("/login",
        [
            body('email').isEmail().withMessage('Plese Enter Vailid email')
        ],
        (req,res)=>{

            const error = validationResult(req);
            if(!error.isEmpty()){
            return res.status(400).json({error : error});
            }

        const email =  req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const SELECT_QUERY = ('select * from student where email = ?');
        msql.query(SELECT_QUERY,[email],(err,result)=>{
            if(err){
                console.error(err);
            }
            else{
                if (result.length === 0) {
                    res.send({ message: 'Invalid Email', status: false });
                } else{

                    const user = result[0];

                    bcrypt.compare(password,user.password,(err,compareresult)=>{
                        if (err) {
                            return res.status(401).json({ message: 'Invalid Credentials' });
                        }

                        if (!compareresult) {
                            console.log(compareresult);
                            return res.status(401).json({ message: 'Invalid Password' });
                        }

                        const token = generateToken(user)
                        res.cookie('token',token);
                        res.status(200).send(user);

                    })
                }
            }
        })
    })


    authRouter.post("/logout", (req, res) => {

        // res.cookie("token",null,{
        //     expires: new Date(Date.now()),
        // })
        res.clearCookie("token");
        res.json({ message: "Logged out successfully!" });
      });

      


    
    module.exports = {authRouter,loggedInUser};