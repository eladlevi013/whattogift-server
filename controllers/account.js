// IMPORTS
import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// ROUTER
const router = express.Router();

// MODELS
import Account from '../models/account.js';

router.post('/signup', async(req, res) => {
    // Get user register data
    const id = mongoose.Types.ObjectId();
    const {firstName, lastName, email, password} = req.body;

    // Check if user exists
    Account.findOne({email:email})
    .then(async account => {
        if(account){
            return res.status(200).json({
                status: false,
                message: 'Account not available'
            });
        } else  {
            const hash = await bcryptjs.hash(password, 10);
            const code = Math.floor(1000 + Math.random() * 9000);
            const _account = new Account({
                _id: id,
                email: email, 
                password: hash,
                firstName: firstName,
                lastName: lastName,
                passcode: code
            })
            _account.save()

            .then(account_created => {
                return res.status(200).json({
                    status: true,
                    message: account_created.passcode
                });
            })
            .catch(error => {
                return res.status(500).json({
                    status: false,
                    message: error.message
                });
            })
        }
    })
    .catch(error => {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    })
})

router.post('/verify', async(request, response) => {
    const accountEmail = request.body.email;
    const accountPasscode = request.body.passcode;

    // if account exists, check if passcode correct
    Account.findOne({email: accountEmail})
    .then(account => {
        if(account.passcode == accountPasscode)
        {
            account.isVerified = true;
            account.save();

            return response.status(200).json({
                message: "The account is now verified!"
            })
        }
        else 
        {
            return response.status(200).json({
                message: "The code is not correct'"
            })
        }
    })
    .catch(error => {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    })
})

router.post('/login', async(req, res) => {
    // Get user login data
    const {email, password} = req.body;
    console.log(email, password);

    // if user exists - check credentails
    Account.findOne({email: email})
    .then(async account => {
        const isMatch = await bcryptjs.compare(password, account.password);
        if(isMatch) {
            const data = {account};
            const token = await jwt.sign(data, 'cfBwVCfAEY');
            
            return res.status(200).json({
                status: true,
                message: account,
                token: token
            });
        } else {
            return res.status(200).json({
                status: false,
                message: 'Username or password not match or account not verified'
            });
        }
    })
    .catch(error => {
        return res.status(500).json({
            status: false,
            message: "Could not find any user with that username\nError message: " + error
        });
    })
})

// Update account
router.post('/update_account', async(req, res) => {
    const {email, firstName, lastName, gender, avatar, contact} = req.body;
    
    // check if user with that email exists
    Account.findOne({email: email})
    .then(async account => {
        account.firstName = firstName;
        account.lastName = lastName;
        account.gender = gender;
        account.avatar = avatar;
        account.contact = contact;
        account.save();
        
        return res.status(200).json({
            status: false,
            message: account
        });
    })
    .catch(async err => {
        return res.status(500).json({
            status: false,
            message: "Could'nt find an account with that email\nerror: " + err 
        });
    })
})

// Update password
router.post('/update_password', async(req, res) => {
    const {email, password, newPassword} = req.body;

    // if user with that email exists
    Account.findOne({email: email})
    .then(async account => {
        const isMatch = await bcryptjs.compare(password, account.password);
        // what we would save in the db - new pass hashed
        const hash = await bcryptjs.hash(newPassword, 10);

        if(isMatch) {
            account.password = hash;
            account.save();

            return res.status(200).json({
                status: false,
                message: 'Password updated.'
            });
        } else {
            return res.status(200).json({
                status: false,
                message: 'Username or password not match.'
            });
        }
    })
    .catch(error => {
        return res.status(500).json({
            status: false,
            message: "Could not find any user with that email."
        });
    })
})

router.get('/getOverview', async(req, res) => {
    // TODO
})

export default router;