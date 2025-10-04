import express from 'express';
import { sendEmail } from '../services/emailService';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.post("/", async (req, res) => {
    const { to, subject, text, html } = req.body;
    try  {
        await sendEmail(to, subject, text, html);
        res.json({ ok: true, message: "Email queued for sending..."});
    } catch (err) {
        res.status(500).json({ ok: false, message: "Failed to queue email" });
    }
});

export default router;