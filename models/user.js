import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    name: {type: String, trim: true, required: true},
    email: {type: String, trim: true, required: [true, "email must be required"]},
    password: {type: String, trim: true, required: [true, "password must be required"], minLength: [5, "password must be at least 5 characters"]},
    isAdmin: {
        type: Boolean,
        default: false,
    }
    // id: {type: String, required: true}
})

export default mongoose.model('User', userSchema);