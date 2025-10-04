import { smsQueue } from "../bull";
import { sendSms } from "../../providers/sms.twilio";
import NotificationModel from "../../db/models/Notification";
import DeliveryAttemptModel from "../../db/models/DeliveryAttempt";

smsQueue.process(async (job: any) => {
  const data = job.data;
  const eventId = data.eventId || job.id;

  const notification = await NotificationModel.create({
    eventId,
    type: data.type,
    channel: "sms",
    recipient: data.recipient || {},
    payload: data.payload || {},
    status: "processing",
    attempts: 0,
  });

  try {
    const sid = await sendSms(data.recipient?.phone, data.payload?.text || data.payload?.message || "You have a notification");
    await DeliveryAttemptModel.create({
      notificationId: notification._id,
      channel: "sms",
      status: "success",
      attemptAt: new Date(),
      info: { sid },
      jobId: job.id,
    });

    notification.status = "sent";
    notification.attempts = (notification.attempts || 0) + 1;
    notification.lastAttemptAt = new Date();
    await notification.save();
  } catch (err: any) {
    await DeliveryAttemptModel.create({
      notificationId: notification._id,
      channel: "sms",
      status: "failed",
      attemptAt: new Date(),
      error: err.message,
      jobId: job.id,
    });

    notification.status = "failed";
    notification.attempts = (notification.attempts || 0) + 1;
    notification.lastAttemptAt = new Date();
    await notification.save();
    throw err;
  }
});
