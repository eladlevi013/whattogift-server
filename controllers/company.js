import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';

// MODELS
import Company from '../models/company.js';

router.post('/create_company', async(req, res) => {
    // Get company register data
    const id = mongoose.Types.ObjectId();
    // Check if company exist under the associate id
    const {associatedId, companyName, contact, logo, bio} = req.body;

    // Check if company exists
    Company.findOne({companyName})
    .then(async company => {
        // if company with the given name exists
        if(company)
        {
            return res.status(200).json({
                status: false,
                message: 'Company name is not available.'
            });
        } else {
            const _company = new Company({
                _id: id,
                associatedId: associatedId,
                companyName: companyName,
                contact: contact,
                logo: logo,
                bio: bio
            })
            _company.save()

            .then(company_created => {
                return res.status(200).json({
                    status: true,
                    message: "Company Created."
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

router.post('/update_company', async(req, res) => {
    // Check if company exist under the associate id
    const {associatedId, companyName, contact, logo, bio} = req.body;

    // Check if company exists
    Company.findOne({companyName})
    .then(async company => {
        if(company)
        {
            company.associatedId = associatedId;
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