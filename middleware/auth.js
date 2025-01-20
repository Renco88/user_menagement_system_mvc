const isLogin = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            // User is logged in, proceed to the next middleware or route handler
            next();
        } else {
            // User is not logged in, redirect to the login page
            res.redirect('/');
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};

const isLogOut = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            // User is logged in, redirect to home page
            res.redirect('/home');
        } else {
            // User is not logged in, proceed to the next middleware or route handler
            next();
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    isLogin,
    isLogOut,
};
