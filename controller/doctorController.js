const doctors = require('../models/doctorModel')
const jwt = require('jsonwebtoken')
const appointments = require('../models/appointmentModel');

exports.doctorLogin = async(req,res)=>{
    try{
     const { email,password } = req.body
     const doctor = await doctors.findOne({email})
 
     if(!doctor){
       return res.json({success:false,message:"Invalid credentials"})
     }
 
     if(password !== doctor.password){
       return res.status(401).json({ success: false, message: "Invalid Credentials" });
   }
  
       const token = jwt.sign({id:doctor._id},"secretkey")
       res.status(200).json({ success: true, token });
 
    }catch(error) {
         res.status(401).json(error)
     }
 }

 exports.doctorProfile = async(req,res)=>{
    try{
        const {docId} = req.body
        const profileData = await doctors.findById(docId).select('-password')
        res.json({success:true,profileData})

    }catch(error) {
        res.status(401).json(error)
    }
}

exports.doctorAppointment = async(req,res)=>{
    try{
        const {docId} = req.body
        const appointment = await appointments.find({docId})

        res.json({success:true,appointment})

    }catch(error) {
        res.status(401).json(error)
    }
}

exports.completeAppointment = async(req,res)=>{
    try{
        const {docId,appointmentId} = req.body
        const appointmentData = await appointments.findById(appointmentId)

        if(appointmentData && appointmentData.docId == docId){
            await appointments.findByIdAndUpdate(appointmentId,{isCompleted: true})
            return res.json({success:true,message:"Appointment completed"})
        }else{
            return res.json({success:false,message:"Appointment mark failed"})
  
        }

    }catch(error) {
        res.status(401).json(error)
    }

}

exports.cancelDoctorAppointment = async(req,res)=>{
    try{
        const {docId,appointmentId} = req.body
        const appointmentData = await appointments.findById(appointmentId)

        if(appointmentData && appointmentData.docId == docId){
            await appointments.findByIdAndUpdate(appointmentId,{cancel: true})
            return res.json({success:true,message:"Appointment cancelled"})
        }else{
            return res.json({success:false,message:"cancellation failed failed"})
  
        }

    }catch(error) {
        res.status(401).json(error)
    }

}