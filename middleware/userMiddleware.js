const jwt = require('jsonwebtoken')

const userMiddleware = (req,res,next)=>{
    console.log('inside uwt middleware');
    const token = req.headers['authorization'].split(" ")[1]
    console.log(token);
    try{
        const uwtResponse = jwt.verify(token,"secretkey")
        req.body.userId = uwtResponse.id
        console.log(uwtResponse);
        next()
        

    }catch(error){
        res.status(401).json("Authorization failed due to",error)
        
    }

}
module.exports = userMiddleware