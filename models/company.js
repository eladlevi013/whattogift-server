import mongoose from "mongoose";
const Schema = mongoose.Schema;

const companySchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    associatedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
    companyName: {type:String, required: true},
    contact: {
        address: String,
        city: String,
        state: String,
        zipcode: String,
        mobile: String,
        latitude: String,
        longitude: String,
    },
    logo: { type: String, default: 'https://res.cloudinary.com/united-app/image/upload/v1638879014/avatars/character4_vk2ven.png'},
    bio: String,
    createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Account', accountSchema);