const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 7000

const app = express();

app.listen(PORT, ()=>{
    console.log(`Server runnning on port ${PORT}`);  
})