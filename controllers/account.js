import express from 'express';
const router = express.Router();
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// MODELS
import Account from '../models/account.js';

router.post('/signup', async(req, res) => {
    // Get user register data
    const id = mongoose.Types.ObjectId();
    const {firstName, lastName, email, password} = req.body;

    // Check if user exist
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
    // Get code + email
    // Check if code match
    // Update db flase true

    const accountEmail = request.body.email;
    const accountPasscode = request.body.passcode;

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
})

router.post('/login', async(req, res) => {
    // Get user login data
    const {email, password} = req.body;


    Account.findOne({email: email})
    .then(async account => {

        

        
        const isMatch = await bcryptjs.compare(password, account.password);
        
        if(isMatch) {


            console.log(email, password);

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
            message: error.message
        });
    })
})

// Update account
router.post('/update_account', async(req, res) => {

})

// Update password
router.post('/update_password', async(req, res) => {
    // Get current password
    // Get new password
})

router.get('/getOverview', async(req, res) => {
    
})

export default router;