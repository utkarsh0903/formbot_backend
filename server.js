const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDB = require("./config/data");
const userRoute = require("./routes/user"); 
const workspaceRoute = require("./routes/workspace");
const folderRoute = require("./routes/folder");
const formRoute = require("./routes/form");
const cors = require("cors");

dotenv.config();

const PORT = process.env.PORT || 7000

const app = express();

connectDB();

app.use(cors());   //Allows all origins
app.use(bodyParser.json());
app.use("/api/user", userRoute);
app.use("/api/workspace", workspaceRoute);
app.use("/api/folder", folderRoute);
app.use("/api/form", formRoute);

app.listen(PORT, ()=>{
    console.log(`Server runnning on port ${PORT}`);  
})