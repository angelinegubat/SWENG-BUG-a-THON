const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    fName: {
        type: String,
        required: true
    },
    lName: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true,
        set: (v) => {
            let date = new Date(v);
            date.setHours(0, 0, 0, 0);
            return date;
        }
    },
    phoneNum: {
        type: String,
        required: true,
        trim: true,
        match:[ /^(09|\+639)\d{9}$/, "Mobile number must be a valid Philippine mobile number"]
    },
    email: {
        type: String,
        required: true
    }
});