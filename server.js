const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/data");

dotenv.config();
const PORT = process.env.PORT || 7000

const app = express();

connectDB();

app.listen(PORT, ()=>{
    console.log(`Server runnning on port ${PORT}`);  
})