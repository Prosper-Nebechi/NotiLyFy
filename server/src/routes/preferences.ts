import { Request, Response, Router } from 'express';
import { requireAuth } from '../middleware/auth';
import Preferences from '../db/models/Preferences';

const router = Router();

//Fetchs current user's notification preferences
router.get("/", requireAuth, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const prefs = await Preferences.findOne({ userId: userId });

        if (!prefs) {
            return res.status(404).json({ message: "Preferences not found" });
        }

        return res.json({
            emailNotifications: prefs.emailNotifications,
            pushNotifications: prefs.pushNotifications,
        });
    }catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }
});

//Updates the user's preferences
router.put("/", requireAuth, async (req: Request, res: Response) => {
    try{
        const userId = (req as any).user.id;
        const { emailNotifications, pushNotifications } = req.body;

        const prefs = await Preferences.findOneAndUpdate(
            { userId: userId },
            { emailNotifications, pushNotifications },
            { new: true, upsert: true }//creates new if it doesn't exists 
        );

        return res.json({
            emailNotifications: prefs.emailNotifications,
            pushNotifications: prefs.pushNotifications,
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err});
    }
});

export default router;