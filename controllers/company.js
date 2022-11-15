import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import Auth from './auth.js';

// MODELS
import Company from '../models/company.js';
 
router.post('/create_company', Auth, async(req, res) => {
    const user = req.user;
    const company = await Company.find({associatedId: user._id});

    if(company.length > 0)
    {
        // Alert
        return res.status(200).json({
            status: false,
            message: 'Company exists.'
        });
    } else {
        const id = mongoose.Types.ObjectId();
        const {companyName, contact} = req.body;    
        const _company = new Company({
            _id: id,
            associatedId: user._id,
            companyName: companyName,
            contact: contact,
            bio: ''
        });
        _company.save()
        .then(company_created => {
            return res.status(200).json({
                status: false,
                message: company_created
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

router.post('/update_company', Auth, async(req, res) => 
{
    const user = req.user;

    // Check if company exist under the associate id
    const {companyId, companyName, contact, logo, bio} = req.body;

    // Check if company exists
    Company.findById(companyId)
    .then(async company => {
        if(company)
        {
            company.companyName = companyName;
            company.contact = contact;
            company.logo = logo;
            company.bio = bio;
            company.save();

            // update the details
            return res.status(200).json({
                status: false,
                message: 'Company details got updated.'
            });
        } else {
            return res.status(500).json({
                status: false,
                message: "Company is not exists."
            });
        }
    })
})

export default router;