const mongoose = require("mongoose");
const Customer = require("../models/customer-model");
const Review = require("../models/review-model");
const Reservation = require("../models/reserve-model");
const bcrypt = require('bcrypt');
const customerModel = require("../models/customer-model");
const session = require("express-session");
const db = require('../models/db.js');

module.exports.getLogin = async function(req, res){
    try{
        res.render('login', {
         });
    }catch(err){
        res.status(500).send("error");
        console.log(err);
    }
}

module.exports.getSignup = async function(req, res){
    try{
        res.render('signup', {
         });
    }catch(err){
        res.status(500).send("error");
        console.log(err);
    }
}

module.exports.getUPage = async function(req, res){
    var query = {_id: req.session._id};
    var projection = 'fName lName _id';
    var details = {};
    if(req.session._id){
        //console.log("In 1");
        try{
            details = {
                flag: true,
                name: req.session.name,
                lname: req.session.lname,
                _id: req.session._id
            };
            
        } catch {
            
        }
    }
    else{
        details.flag = false
        try{
            res.redirect('/login');
        } catch {

        }
        
    }

    db.findOne(Customer, query, projection, function(result){
        if(result != null){
            console.log(result);
            details.name = result.fName;
            details.lname = result.lName;
            details._id = result._id;
            //res.render('user', {details});
        }
        else{
            try{
                res.redirect('/login');
            }
            catch
            {

            }
            
        }
    });
    
    let userReviews = await Review.find({userid: req.session._id}).lean();
    let userReservations = await Reservation.find({userid: req.session._id}).lean();
    try{
    //console.log(userReviews);
    res.render('user', {details, userReviews, userReservations});
    }
    catch {}

}

// module.exports.registerMaker = async function(req, res){
//     let customer;
//     try{
//         customer = new Customer({
//             email: req.body["email"],
//             fName: req.body["first-name"],
//             lName: req.body["last-name"],
//             birthday: req.body["birthday"],
//             phoneNum: req.body["phoneNum"],
//             password: req.body["password"]
//         });
//         await customer.save();
//         // res.status(201).send({
//         //     id: maker._id,
//         //     name: format.getNameFormat(maker.firstName, maker.middleName, maker.lastName),
//         //     email: maker.email,
//         // });
//     }
//     catch(err){
//         if(err.name === "MongoError" && err.code === 11000 && err.keyPattern["email"] === 1)
//             res.status(400).send("Email already exists");
//         else
//             res.status(500).send("Cannot register at this time")
//     }
// }

module.exports.loginUser = async function(req, res){
    var email = req.body.email;
    var password = req.body.psw;

    db.findOne(Customer, {email: email}, '', function(result){
        if(result){
            var user = {
                fName: result.fName,
                lName: result.lName,
                _id: result._id
            };
            console.log(user);
            
            bcrypt.compare(password, result.password, function(err, equal){
                if(equal){
                    console.log('Equal');
                    req.session._id = user._id;
                    req.session.name = user.fName;
                    req.session.lname = user.lName;
                    console.log(req.session._id);
                    var details = {
                        flag: true,
                        name: req.session.name,
                        lname: req.session.lname
                    };
                    res.redirect('/user');
                }
            })
            
        }
        else{
            var details = {
                flag: false,
                error: `Email Number and/or Password is incorrect.`
            };
            res.render('login', details);

        }
    })
}

module.exports.registerUser = async function(req, res){
    Customer.find({email: req.body.email})
        .exec()
        .then(customer => {
            if (customer.length >= 1){
                return res.status(422).json({
                    message: 'Email already exists'
                });
            } else {
                bcrypt.hash(req.body["psw"], 10, (err, hash) => {
                    if(err) {
                        return res.status(500).json({
                            error: err
                        });
                        console.log(err);
                    }
                    else {
                        const customer = new Customer({
                            _id: new mongoose.Types.ObjectId(),
                            fName: req.body["fname"],
                            lName: req.body["lname"],
                            birthday: req.body["bday"],
                            phoneNum: req.body["phone"], 
                            email: req.body["email"],
                            password: hash
                        });
                        customer
                        .save()
                        
                        .then(result => {
                            // res.status(201).json({
                            //     message: 'User created'
                            // });
                            res.redirect('/login');
                        })
                        console.log(customer);
                    }
                });
            }
        })
}

module.exports.logoutUser = async function(req, res){
    req.session.destroy(function(err) {
        if(err) throw err;
        res.redirect('/');
    });

}