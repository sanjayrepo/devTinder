const express = require("express")

const app = express()

app.get('/user',(req,res)=>{
    res.send({firstName:"Sanjay", lastName:"Kumar"})
})

app.post('/user',(req,res)=>{
    console.log("Save data to database")
    res.send("Data saved successfilly to db")
})
app.use('/test',(req,res)=>{
    res.send("Hello from the server")
})

app.listen(3000,()=>{
    console.log("Server is listening on port 3000..");
})



