const express = require('express')
// import 
const adminMiddleware = require('./middleware/adminMiddleware')
const userMiddleware = require('./middleware/userMiddleware')
const doctorMiddleware = require('./middleware/doctorMiddleware')
const userController = require('./controller/userController')
const adminController = require('./controller/adminController')
const doctorController = require('./controller/doctorController')
const multerConfig = require('./middleware/multerMiddleware')
const router = new express.Router()

// add doctor
router.post('/add-doctor',adminMiddleware,multerConfig.single("image"),adminController.addDoctor)



// admin login
router.post('/adminlogin',adminController.adminLogin)

// get admin doctor 
router.get('/all-doctor',adminController.getAllDoctor)

// userregister
router.post('/register',userController.register)

// userlogin
router.post('/login',userController.login)

// doctor list
router.get('/doctor-list',userController.DoctorsList)

// all doctors
router.get('/all-userdoctor',userController.AllUserDoctorList)

// userprofile
router.get('/get-profile',userMiddleware,userController.getProfile)

// doctor login
router.post('/doctor-login',doctorController.doctorLogin)
// doctor-profile
router.get('/doctor-profile',doctorMiddleware,doctorController.doctorProfile)

// book appointment
router.post('/book-appointment',userMiddleware,userController.bookApointment)

// user appointment
router.get('/userappointment',userMiddleware,userController.userAppointmentDetails)

// cancel appointment
router.post('/cancelappointment',userMiddleware,userController.cancelAppointment)

// admin appointment
router.get('/admin-appointment',adminMiddleware,adminController.adminAppointment)

// doctorappointmnet
router.get('/doctor-appointment',doctorMiddleware,doctorController.doctorAppointment)

// canceldoctor appointment and complete Appointment
router.post('/complete-appointment',doctorMiddleware,doctorController.completeAppointment)

router.post('/cancel-doctorappointment',doctorMiddleware,doctorController.cancelDoctorAppointment)

// add documents
router.post('/add-document',userMiddleware,multerConfig.single("docimage"),userController.addDocuments)

// display documents
router.get('/display-document',userController.displaydocuments)

// remove documents
router.delete('/remove-documents/:id',userMiddleware,userController.removeUserDocuments)


module.exports = router
