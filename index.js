require('dotenv').config()

require('./connection')

const express = require('express')

const cors = require('cors')

const router = require('./router')

const healthcareServer = express()

healthcareServer.use(cors())

healthcareServer.use(express.json())

healthcareServer.use('/upload',express.static('./uploads'))


healthcareServer.use(router)

const PORT = 4000 || process.env.PORT

healthcareServer.listen(PORT,()=>{
    console.log(`healthcare Server connected at port: ${PORT}`);
    
})
// get
healthcareServer.get('/',(req,res)=>{
    res.send(`get request received`)
})