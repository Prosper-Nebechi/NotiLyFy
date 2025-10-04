// server/src/workers/emailWorker.ts
import { Queue, Job } from "bull";
import { emailQueue } from "../bull";
import { sendEmail } from "../../providers/email.nodemailer";
import NotificationModel from "../../db/models/Notification";
import DeliveryAttemptModel from "../../db/models/DeliveryAttempt";


emailQueue.process(async (job: Job) => {
  const data = job.data;
  const eventId = data.eventId || job.id;
  const notificationId = data.notificationId || null;

  // create or find Notification doc (if you prefer to persist events)
  let notification;
  if (notificationId) {
    notification = await NotificationModel.findById(notificationId);
  } else {
    // optional: create a notification doc for tracking if none exists
    notification = await NotificationModel.create({
      eventId,
      type: data.type,
      channel: "email",
      recipient: data.recipient || {},
      payload: data.payload || {},
      status: "processing",
      attempts: 0,
    });
  }

  try {
    await sendEmail({
      to: data.recipient?.email,
      subject: data.payload?.subject || `Notification: ${data.type}`,
      html: data.payload?.html || data.payload?.text || "",
      text: data.payload?.text || "",
    });

    // record success delivery attempt
    await DeliveryAttemptModel.create({
      notificationId: notification._id,
      channel: "email",
      status: "success",
      attemptAt: new Date(),
      jobId: job.id,
    });

    notification.status = "sent";
    notification.attempts = (notification.attempts || 0) + 1;
    notification.lastAttemptAt = new Date();
    await notification.save();

    return Promise.resolve();
  } catch (err: any) {
    // record failed attempt
    await DeliveryAttemptModel.create({
      notificationId: notification._id,
      channel: "email",
      status: "failed",
      attemptAt: new Date(),
      error: err.message,
      jobId: job.id,
    });

    notification.status = "failed";
    notification.attempts = (notification.attempts || 0) + 1;
    notification.lastAttemptAt = new Date();
    await notification.save();

    // rethrow so Bull will apply retry/backoff
    throw err;
  }
});
