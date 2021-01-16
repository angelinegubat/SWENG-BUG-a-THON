const mongoose = require("mongoose");
const Review = require("../models/review-model");

module.exports.getReviews = async function(req, res){
    let reviews = await Review.find({}).sort({_id:-1}).limit(6).lean();
    let average = await Review.aggregate([{$group: {_id:null, AverageValue: {$avg:"$stars"} } }]);
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
    console.log(average);
    //console.log(roundave);
    try{
        res.render('reviews', {
            average,
            reviews,
            details
         });
    }catch(err){
        res.status(500).send("error");
        console.log(err);
    }
}

module.exports.addReview = async function(req, res){
    if(req.session._id){
        try{
        
            let review = new Review({
                _id: new mongoose.Types.ObjectId(),
                userid: req.session._id,
                name: req.session.name,
                stars: req.body["rate"],
                comment: req.body["content"]
            });
            await review.save();
            res.redirect('/review');
            return review;
            }
            catch(err){
                console.log(err);
                res.status(500).send("Cannot register at this time");
            }
         
    } else {
        try{
        
            let review = new Review({
                _id: new mongoose.Types.ObjectId(),
                userid: null,
                name: "Anonymous",
                stars: req.body["rate"],
                comment: req.body["content"]
            });
            await review.save();
            res.redirect('/review');
            }
            catch(err){
                console.log(err);
                res.status(500).send("Cannot register at this time");
            }
    }
   
}

// const reviewController = {
//     getReviews: function (req, res) {
//         res.render('reviews', {
//         });
//     },
//     addReviews: function (req, res){
//         const 
//     }
// };

//module.exports = reviewController;