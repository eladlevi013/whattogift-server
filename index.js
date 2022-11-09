import express from "express";
import mongoose, { mongo } from "mongoose";
import bp from "body-parser";

const app = express();

app.use(bp.urlencoded({extended:false}));
app.use(bp.json());

const mongoUrl = 'mongodb+srv://whattogift-user:whattogift-password@cluster0.3ffqv2n.mongodb.net/whattogift?retryWrites=true&w=majority';

///////////////////////////// ROUTES ////////////////////////////
import accountRoute from './controllers/account.js';
app.use('/api/account', accountRoute);

import companiesRoute from './controllers/company.js';
app.use('/api/company', companiesRoute);
// ------------ END OF ROUTES ----------------------------------
const PORT = 3001;

mongoose.connect(mongoUrl)
.then(results => {
    // console.log(results);
    app.listen(PORT, function() {
        console.log(`Server is running via port ${PORT}`);
    });
})
.catch(error => {console.log(error.message)})