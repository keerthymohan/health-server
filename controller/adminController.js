const doctors = require("../models/doctorModel")
const jwt = require('jsonwebtoken')
const appointments = require('../models/appointmentModel');

// add doctor
exports.addDoctor = async(req , res)=>{
    console.log(`Inside add doctor controller`);
    const {name,email,password,contactnumber,speciality,degree,experience,about,fees} = req.body
    console.log(name,email,password,contactnumber,speciality,degree,experience,about,fees);
    const image = req.file.filename
    console.log(image);
    try{
        const existingdoctor = await doctors.findOne({email})
        if(existingdoctor){
            res.status(406).json(`Doctor already exist`)

        }else{
            const newDoctor = new doctors({
                name,
                email,
                password,
                contactnumber,
                speciality,
                degree,
                experience,
                about,
                fees,
                image
            })
            await newDoctor.save()
            res.status(200).json(newDoctor)
        }

    }catch(error){
        res.status(401).json(`doctor adding failed due to ${error}`)
    }
    
}

exports.adminLogin = async(req,res)=>{
    try{
        const {email,password} = req.body
        if(email == "admin@gmail.com" && password == "adminpassword"){
            const token = jwt.sign(email+password,"secretkey")
            res.status(200).json({token})


        }else{
            res.status(406).json("Invalid email or password")
        }

    }catch(error){
        res.status(401).json(`doctor adding failed due to ${error}`)
    }
}

// all doctor
exports.getAllDoctor = async(req,res)=>{
    try{
        const allDoctor = await doctors.find().select('-password')
        res.status(200).json(allDoctor)

    }catch(error) {
        res.status(401).json(error)
    }
}

// api to get all appointment
exports.adminAppointment = async(req,res)=>{
    try{
        const appointment = await appointments.find({})
        res.json({successs:true,appointment})

    }catch(error) {
        res.status(401).json(error)
    }
}