import Notification from "../db/models/Notification";

export async function sendInApp(userId: string, title: string, body: string) {
  try {
    const notif = new Notification({ userId: userId.toString(), title, body });
    await notif.save();
    return notif._id;
  } catch (err) {
    console.error("In-app notification error:", err);
    throw err;
  }
}
