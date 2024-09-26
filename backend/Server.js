const express = require("express")

const mongoose = require("mongoose")
require("dotenv").config()

const cors = require("cors")

//const routes = require("./routes/TaskRoute")
const routes = require("./routes/GuestBookRoute")

const app = express()
const PORT = process.env.PORT | 5000

app.use(express.json())
app.use(cors())

// 이미지 용량 제한 걸기
// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb', extended: true}));

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=> console.log("MongoDB Connected..."))
    .catch((err)=> console.log(err));
    

app.use("/api", routes)


app.listen(PORT, ()=> console.log(`Listening at ${PORT}`))
