require('dotenv').config();
const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const port=3000;
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
});

database.once('connected', () => {
    console.log('Database Connected');
});


const app=express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

const routes = require('./routes/routes');

app.use('/api', routes)





app.listen(port,()=>{
    console.log(`server listening on port ${port}`);
});
