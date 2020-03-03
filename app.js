const express = require('express');
var app=express();

var port=process.env.PORT ||3000;
var apiController=require('./controllers/apiController');

apiController(app);
app.listen(port);