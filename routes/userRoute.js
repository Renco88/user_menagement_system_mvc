const express= require("express");
const user_route = express();

const path = require("path");

user_route.set('view engine', 'ejs');
user_route.set('views', path.join(__dirname, '../views/users'));


user_route.get('/registration', (req, res) => {
    res.render('users/registration');
});

const userController =require("../controllers/userController");

user_route.get('/register',userController.loadRegister);


module.exports=user_route;