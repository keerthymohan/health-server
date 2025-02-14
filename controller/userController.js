const jwt = require('jsonwebtoken')
const users = require('../models/userModel')
const doctors = require('../models/doctorModel');
const appointments = require('../models/appointmentModel');
const documents = require('../models/documentModel');

exports.register = async(req,res)=>{
    console.log('inside register function');
    const { patientname, email, mobileNumber, password } = req.body
    console.log(patientname, email, mobileNumber, password);
    try{
        const existingUsers = await users.findOne({email})
        if(existingUsers){
            res.status(406).json("User Already Exists")

        }else{
            const newUser = new users({
                patientname,
                email,
                mobileNumber,
                password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }

    }catch (error) {
        res.status(401).json(error)
    }

}

exports.login = async(req,res)=>{
    const { email, password } = req.body
    console.log(email, password);
    try{
        const existingUsers = await users.findOne({ email, password })

        if(existingUsers) {
            const token = jwt.sign({ id: existingUsers._id }, "secretkey")
            res.status(200).json({ existingUsers, token })

        }else {
            res.status(406).json("Incorrect email or password")

        }

    }catch (error) {
        res.status(401).json(error)
    }

}

// doctor data
exports.DoctorsList = async(req,res)=>{
    try{
        const doctorList = await doctors.find().select(['-password','-email'])
    res.status(200).json(doctorList)

    }catch(error) {
        res.status(401).json(error)
    }

}

// doctors
exports.AllUserDoctorList = async(req,res)=>{
    const searchKey = req.query.search 
    console.log(searchKey);
    const query = {
        speciality:{
            $regex: searchKey, $options :"i"
        }
    }

    try{
        const userdoctorlist = await doctors.find(query).select(['-password','-email'])
    res.status(200).json(userdoctorlist)

    }catch(error) {
        res.status(401).json(error)
    }

}
// api to get user profile data
exports.getProfile = async (req, res) => {
    try {
        const { userId } = req.body
        const userData = await users.findById(userId).select('-password')
        res.json({ success: true, userData })

    } catch (error) {
        res.status(401).json(error)

    }
}

exports.bookApointment = async(req,res)=>{
    try{
        const {userId,docId,slotDate,slotTime} = req.body

        const docData = await doctors.findById(docId).select('-password')

        let slots_booked = docData.slots_booked

        // slot availability

        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:'slot not available'})
            }else{
                slots_booked[slotDate].push(slotTime) 
            }
        }else{
            slots_booked[slotDate]=[]
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await users.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount :docData.fees,
            slotDate,
            slotTime,
            date:Date.now()
        }

        const newAppointment = new appointments(appointmentData)
        await newAppointment.save()

        // save newslots data 

        await doctors.findByIdAndUpdate(docId,{slots_booked})
        res.json({success:true,message:'Appointment Booked'})

    }catch (error) {
        res.status(401).json(error)

    }
}

// user appointment
exports.userAppointmentDetails = async(req,res)=>{
    try{
        const {userId} = req.body
        const appointment = await appointments.find({userId})
        res.json({ success: true,appointment})

    }catch (error) {
        res.status(401).json(error)

    }
}

// cancel appointment
exports.cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body

        const appointmentData = await appointments.findById(appointmentId)

        if (appointmentData.userId != userId) {
            return res.json({ success: false, message: 'unauthorized action' })
        }
        await appointments.findByIdAndUpdate(appointmentId, { cancel: true })

        // releasing doctor slot

        const { docId, slotDate, slotTime } = appointmentData
        const doctorData = await doctors.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e != slotTime)

        await doctors.findByIdAndUpdate(docId, { slots_booked })

        res.status(200).json('Appointment cancelled')




    } catch (error) {
        res.status(401).json(error)

    }
}

exports.addDocuments = async(req,res)=>{
    console.log(`inside add document controller`);
    const {title} = req.body
    const docimage = req.file.filename
    try{
        const uploadDocuments = new documents({
            title,
            docimage
        })
        await uploadDocuments.save()
        res.status(200).json(uploadDocuments)

        
    }catch(error){
        res.status(401).json(`documents uploaded failed due to ${error}`)
    }
    
}


// display documents
exports.displaydocuments = async(req,res)=>{
    try{
        const displayalldocuments = await documents.find()
        res.status(200).json(displayalldocuments)

    }catch(error) {
        res.status(401).json(error)
    }

}

// delete documents
exports.removeUserDocuments = async(req,res)=>{
    const {id} = req.params
    try{
        await documents.findByIdAndDelete({_id:id})
        res.status(200).json(`Documents Deleted Successfully`)


    }catch (error){
        res.status(401).json(error)
    }
}