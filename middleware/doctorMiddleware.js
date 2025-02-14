const jwt = require('jsonwebtoken')


const doctorMiddleware = (req,res,next)=>{
    console.log('inside uwt middleware');
    const dtoken = req.headers['authorization'].split(" ")[1]
    console.log(dtoken);
    try{
        const doctorResponse = jwt.verify(dtoken,"secretkey")
        req.body.docId = doctorResponse.id
        console.log(doctorResponse);
        next()
        

    }catch(error){
        res.status(401).json("Authorization failed due to",error)
        
    }
    
}
module.exports = doctorMiddleware