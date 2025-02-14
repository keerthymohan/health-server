const jwt = require('jsonwebtoken')
const adminMiddleware =(req,res,next)=>{
    console.log('inside admin middleware');

    
    try{
        const admintoken = req.headers['authorization'].split(" ")[1]
    console.log(admintoken);
        
    const adminResponse = jwt.verify(admintoken,"secretkey")
        console.log(adminResponse);
        next()
       

    }catch(error){
console.log(error);
res.json({success:false,message:error.message})
        
    }

}
module.exports = adminMiddleware