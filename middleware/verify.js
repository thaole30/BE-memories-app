import express from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(authHeader) {
        const token = authHeader.split(' ')[1];
        console.log("token in BE", token);
        const isCustomToken = token.length < 500;

        let decodedData;

        if(isCustomToken) {

            jwt.verify(token, process.env.JWT_SECRET, (err, decodedInfo) => {
                if (err) res.status(403).json("Token is not valid!");

                console.log("decodedData", decodedInfo);
                decodedData = decodedInfo;
                req.decodedData = decodedData;
            })
        } else {
            //google token
            decodedData = jwt.decode(token);
            console.log("decodedData of GOOGLE", decodedData);
            req.decodedData = decodedData;
        }

        next();
    } else {
        //k co header
        return res.status(401).json("You are not authenticated!");
    }
}


export const verifyTokenAndAuthorization = (req, res, next) => {
    console.log("admin updateeeeeee");
    verifyToken(req, res, () => {
        if(req.decodedData.userId === req.params.id || req.decodedData.userId || req.decodedData?.sub || req.decodedData.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that")
        }
    })
}


export const verifyTokenAndAdmin = (req, res, next) => {
    console.log("check admin or not");
    verifyToken(req, res, () => {
        if (req.decodedData.isAdmin) {
            console.log("im admin");
            next();
        } else {
            res.status(403).json("You are not allowed to do that")
        }
    })
}