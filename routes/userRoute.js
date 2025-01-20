const express = require("express");
const path = require("path");
const multer = require("multer");
const userRoute = express();

const userController = require("../controllers/userController");

// Configure view engine
userRoute.set('view engine', 'ejs');
userRoute.set('views', path.join(__dirname, '../views/users'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/userimages'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Routes
userRoute.get('/register', userController.loadRegister);
userRoute.post('/register', upload.single('image'), userController.insertUser);
userRoute.get('/verify', userController.veryfiMail);

module.exports = userRoute;
