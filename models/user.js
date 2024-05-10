const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
    },
})

// THE passportLocalMongoose AS A plugin BELOW WILL ADD THE USERNAME & PASSWORD FIELDS TO OUR UserSchema AUTOMATICALLY, IT WILL MAKE SURE
// THE USERNAMES AREN'T DUPLICATED, AND IT WILL ALSO MAKE AVAILABLE TO US SOME ADDITIONAL METHODS THAT WE CAN USE
UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("User", UserSchema);