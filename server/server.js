const express = require('express'); 
const app = express(); 
const port =  5000; 
const dotenv = require("dotenv").config();
const bodyParser = require('body-parser');

const cors = require('cors');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions');

const connectDb = require('./config/dbConnection');
const errorHandler = require('./middleware/errorHandler');



app.use(express.json());
app.use(errorHandler)
require('dotenv').config();
app.use(cookieParser())

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);


app.use(credentials); 

// Cross Origin Resource Sharing
app.use("*",cors(corsOptions));
'use strict';


connectDb()

app.use("/api/auth", require("./routes/userroutes"));
app.use('/api/invoices', require('./routes/invoiceroutes'))


app.listen(port, () => console.log(`Listening on port ${port}`)); 
