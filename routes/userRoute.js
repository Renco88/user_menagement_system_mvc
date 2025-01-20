const express = require("express");
const path = require("path");
const multer = require("multer");
const userRoute = express();

const session = require("express-session");
const config = require("../config/config");

userRoute.use(
    session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: false,
    })
);
const auth = require("../middleware/auth");

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
userRoute.get('/register', auth.isLogOut, userController.loadRegister);
userRoute.post('/register', upload.single('image'), userController.insertUser);
userRoute.get('/verify', userController.veryfiMail);
userRoute.get('/', auth.isLogOut, userController.loginLoad);
userRoute.get('/login', auth.isLogOut, userController.loginLoad);
userRoute.post('/login', userController.verifyLogin);
userRoute.get('/home', auth.isLogin, userController.loadHome);


module.exports = userRoute;
