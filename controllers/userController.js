const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodeMailar = require("nodemailer");
require('dotenv').config();

const loadRegister = async (req, res) => {
    try {
        res.render('registration');
    } catch (error) {
        console.log(error.message);
    }
};

// mail send
const sendVerifyMail=async(name,email,user_id)=>{
    try{
        const transporter = nodeMailar.createTransport({

            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:'gmrenco4@gmail.com',
                pass:'utxl bfvo kjpp uotc'
            }
        });
        const mailOptions = {
            from: 'gmrenco4@gmail.com', // Sender address
            to: email, // Receiver email
            subject: 'Verify Your Email', // Subject line
            html: `<p>Hi ${name},</p>
                   <p>Thank you for registering. Please click the link below to verify your email:</p>
                   <a href="http://localhost:5000/verify?id=${user_id}">Verify Email</a>
                   <p>If you did not register, you can safely ignore this email.</p>`,
        }; 
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully.');

    }
    catch(error){
        console.log(error.message);

    }
}

const insertUser = async (req, res) => {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create a new user instance
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            image: req.file.filename, // File uploaded via multer
            password: hashedPassword,
            is_admin: 0, // Default value for regular users
        });

        // Save the user in the database
        const userData = await user.save();

        if (userData) {
            sendVerifyMail(req.body.name, req.body.email, userData._id);
            res.render('registration', { message: "Your registration has been successful.please veryfi your email" });
        } else {
            res.render('registration', { message: "Your registration has failed." });
        }
    } catch (error) {
        console.log(error.message);
        res.render('registration', { message: "An error occurred during registration." });
    }
};

const veryfiMail = async (req, res) => {
    try {
        const userId = req.query.id;

        if (!userId) {
            return res.render("error", { message: "Invalid or missing verification link." });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { is_verified: 1 } },
            { new: true }
        );

        if (user) {
            res.render("email-verified", { message: "Your email has been verified successfully!" });
        } else {
            res.render("error", { message: "User not found or already verified." });
        }
    } catch (error) {
        console.log("Error during email verification:", error.message);
        res.render("error", { message: "An error occurred during email verification." });
    }
};

// login user methode 
const loginLoad=async(req,res)=>{
    try{

        res.render('login');
    }
    catch(error){
        console.log(error.message);

    }
}

const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                if (userData.is_verified === 0) {
                    res.render('login', { message: "Please verify your email." });
                } else {
                    req.session.user_id =userData._id;
                    // Redirect or render the dashboard/homepage
                    res.redirect('/home'); // Example: Redirecting to dashboard
                }
            } else {
                res.render('login', { message: "Invalid credentials." });
            }
        } else {
            res.render('login', { message: "Invalid credentials." });
        }
    } catch (error) {
        console.error(error.message);
    }
};
const loadHome = async(req,res)=>{
    try{
        res.render('home');

    }
    catch(error){
        console.log(error.message);

    }
}

module.exports = {
    loadRegister,
    insertUser,
    veryfiMail,
    loginLoad,
    verifyLogin,
    loadHome
};
