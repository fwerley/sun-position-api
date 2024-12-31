import express = require("express");
// import * as functions from "firebase-functions";
import {
    createUserWithEmailAndPassword, getAuth,
    sendEmailVerification, sendPasswordResetEmail,
    signInWithEmailAndPassword, signOut,
} from "../config/firebase";

const auth = getAuth();

export default {
    async create(req: express.Request, res: express.Response) {
        /*
           #swagger.tags = ["Users"]
           #swagger.summary = "Create a new user"
           #swagger.description = "This endpoint will create a new user...""
       */
        const { email, password } = req.body;
        /*  #swagger.requestBody = {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/someBody"
                        }
                    }
                }
            }
        */
        if (!email || !password) {
            res.status(422).json({
                email: "Email is required",
                password: "Password is required",
            });
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            if (auth.currentUser) {
                sendEmailVerification(auth.currentUser);
            }
            res.status(201).send({ status: "Success", msg: "Verification email sent! User created successfully!" });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: "Failed", msg: error });
        }
    },
    async signin(req: express.Request, res: express.Response) {
        /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Perform user login"
            #swagger.description = 'This endpoint will return a user after login succefully...'
        */
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(422).json({
                email: "Email is required",
                password: "Password is required",
            });
        }
        /*  #swagger.requestBody = {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/signinSomeBody"
                        }
                    }
                }
            }
            #swagger.responses[200] = {
                 description: "Some description...",
                 content: {
                     "application/json": {
                         schema:{
                             $ref: "#/components/schemas/signinSomeResponse"
                         }
                     }
                 }
             }
         */
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            res.status(200).send({ user });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: "Failed", msg: error });
        }
    },
    async signout(req: express.Request, res: express.Response) {
        try {
            await signOut(auth);
            req.user = undefined;
            res.status(200).send({ msg: "User logged out successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: "Failed", msg: "Internal Server Error" });
        }
    },
    async resetEmail(req: express.Request, res: express.Response) {
        /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Perform user logout"
            #swagger.description = 'This endpoint will return a user after login succefully...'
        */
        const { email } = req.body;
        if (!email) {
            res.status(422).json({
                email: "Email is required",
            });
        }
        /*  #swagger.requestBody = {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/signinSomeBody"
                        }
                    }
                }
            }
            #swagger.responses[200] = {
                 description: "Some description...",
                 content: {
                     "application/json": {
                         schema:{
                             $ref: "#/components/schemas/signinSomeResponse"
                         }
                     }
                 }
             }
         */
        try {
            await sendPasswordResetEmail(auth, email);
            res.status(200).send({ msg: "Password reset email sent successfully!" });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: "Failed", msg: "Internal Server Error" });
        }
    },
};
