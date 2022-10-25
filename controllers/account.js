import express from 'express';
const router = express.Router();

router.get('/greeting', async(request, response) => {
    return response.status(200).json({
        message: 'Hello from whattogift app'
    });
})

export default router;