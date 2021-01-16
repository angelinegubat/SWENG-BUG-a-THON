const express = require('express');
const customerController = require("../controllers/customerController.js");
const employeeController = require("../controllers/employee-controller.js");
const reviewController = require("../controllers/reviewController.js");
const reserveController = require("../controllers/reserveController.js");

let router = express.Router();

router.get('/', function(req, res) {
    var details;
    console.log(req.session.name);
    console.log(req.session._id);
    if(req.session._id)
    {
        details = {
            flag: true,
            name: req.session.name,
            _id: req.session._id
        };
    }
    else
    {
        details = {
            flag: false
        };
        
    }
    res.render('Homepage', {details}
    )
});

router.get('/about', function(req, res) {
    res.send('About Page')
});

router.get('/review', reviewController.getReviews);
router.post('/review', reviewController.addReview);

router.get('/reserve', reserveController.getReserve);
router.post('/reserve', reserveController.addReserve);

router.get('/login', customerController.getLogin);

router.post('/login', customerController.loginUser);

router.get('/logout', customerController.logoutUser);

router.get('/signup', customerController.getSignup);
router.post('/signup', customerController.registerUser);
router.get('/menu', function(req, res) {
    res.render('menu', {
    })
});

router.get('/deletereserve/:_id', reserveController.deleteReservation);
router.get('/user', customerController.getUPage);

module.exports = router;