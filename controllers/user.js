import mongoose from 'mongoose';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import user from '../models/user.js';


export const signIn = async (req, res) => {
    const {email, password: enteredPassword} = req.body;

    try {
        const existingUser = await User.findOne({email});
        console.log("existingUser", existingUser)

        if(!existingUser) return res.status(404).json({
            message: 'User does not exist',
        })

        const isPasswordCorrect = await bcrypt.compare(enteredPassword, existingUser.password);
        if(!isPasswordCorrect) return res.status(404).json({message: 'Password is incorrect'});

        const {password, ...others} = existingUser._doc;

        const token = jwt.sign(
            {
                email: existingUser.email,
                userId: existingUser._id,
                isAdmin: existingUser.isAdmin,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            user: others,
            token: token,
        })

    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

export const signUp = async (req, res) => {
    // console.log(">>>>>>>>>>SIGN UP<<<<<<<<<");
    console.log("req.body", req.body);

    const {email, password: enteredPassword, confirmPassword, firstName, lastName} = req.body;

    try {
        const existingUser = await User.findOne({email: email});

        if(existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            })
        };

        if(enteredPassword !== confirmPassword) {
            return res.status(400).json({message: 'Password dont match'});
        }
        //tạo hashedPasswword từ password ng dùng nhập
        const hashedPasswword = await bcrypt.hash(enteredPassword, 10);

        const newUser = await new User({
            email,
            password: hashedPasswword,
            name: `${firstName} ${lastName}`
        });

        const savedUser = await newUser.save();
        const {password, ...others} = savedUser._doc;

        const token = jwt.sign(
                    {
                        email: savedUser.email,
                        userId: savedUser._id,
                        isAdmin: savedUser.isAdmin,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
        );

        res.status(200).json({
            user: others,
            token: token
        })

    } catch (err) {
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}