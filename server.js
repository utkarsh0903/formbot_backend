const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDB = require("./config/data");
const userRoute = require("./routes/user"); 

dotenv.config();
const PORT = process.env.PORT || 7000

const app = express();

connectDB();

app.use(bodyParser.json());
app.use("/api/user", userRoute);

app.listen(PORT, ()=>{
    console.log(`Server runnning on port ${PORT}`);  
})