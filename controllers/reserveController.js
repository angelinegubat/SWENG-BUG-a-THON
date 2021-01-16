const mongoose = require("mongoose");
const Reservation = require("../models/reserve-model");

module.exports.getReserve = async function(req, res){
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
    try{
        res.render('reserve', 
            { details }
         );
    }catch(err){
        res.status(500).send("error");
        console.log(err);
    }
}

module.exports.addReserve = async function(req, res){
    console.log("At Reserve");
    if(req.session._id){
        try{
        
            let reserve = new Reservation({
                _id: new mongoose.Types.ObjectId(),
                userid: req.session._id,
                name: req.body["fullname"],
                resDate: req.body["date"],
                resTime: req.body["time"], 
                phone: req.body["phoneno"],
                people: req.body["people"],
                email: req.body["email"]

            });
            await reserve.save();
            res.redirect('/reserve');
            }
            catch(err){
                console.log(err);
                res.status(500).send("Cannot reserve at this time");
            }
         
    } else {
        console.log("In else");
        try{
        
            let reserve = new Reservation({
                _id: new mongoose.Types.ObjectId(),
                userid: null,
                name: req.body["fullname"],
                resDate: req.body["date"],
                resTime: req.body["time"], 
                phone: req.body["phoneno"],
                people: req.body["people"],
                email: req.body["email"]

            });
            console.log(reserve);
            await reserve.save();
            res.redirect('/reserve');
            }
            catch(err){
                console.log(err);
                res.status(500).send("Cannot reserve at this time");
            }
    }
   
}

module.exports.deleteReservation = async function(req, res){
    console.log("in deletes");
    let owner = await Reservation.findOne({_id: req.params._id});
    console.log(owner);
    if(owner.userid == req.session._id)
    {
        try{
            Reservation.findOneAndRemove({_id: req.params._id}, (error, deletedRecord) =>{
                if(!error){
                    console.log(deletedRecord)
                }
            });
        }
        catch{}
        res.redirect('/user');
    }
    else {
        res.redirect('/');
    }
}
