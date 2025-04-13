const cookieParser = require('cookie-parser');
const express = require('express')
const jwt = require('jsonwebtoken');
const app = express();
app.use(cookieParser());

 const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: " Unauthorized!" });
  
    jwt.verify(token,"DEV@AJAY123@", (err, decod) => {
      if (err) return res.status(401).json({ error: " Invalid Token!" });
      
      req.user = decod;
      next();
    });
  };

  module.exports = verifyToken;

