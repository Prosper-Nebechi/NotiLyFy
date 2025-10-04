// server/src/workers/inAppWorker.ts
import { inappQueue } from "../bull";
import NotificationModel from "../../db/models/Notification";
import DeliveryAttemptModel from "../../db/models/DeliveryAttempt";



inappQueue.process(async (job: any) => {
  const data = job.data;
  const eventId = data.eventId || job.id;

  const notification = await NotificationModel.create({
    eventId,
    type: data.type,
    channel: "in-app",
    recipient: data.recipient || {},
    payload: data.payload || {},
    status: "processing",
    attempts: 0,
  });

  try {
    // Usually in-app means storing a notification row and the client polls/gets it
    // NotificationModel already represents that; consider sending socket events here if you have websockets

    await DeliveryAttemptModel.create({
      notificationId: notification._id,
      channel: "in-app",
      status: "success",
      attemptAt: new Date(),
      jobId: job.id,
    });

    notification.status = "sent";
    notification.attempts = (notification.attempts || 0) + 1;
    notification.lastAttemptAt = new Date();
    await notification.save();
  } catch (err: any) {
    await DeliveryAttemptModel.create({
      notificationId: notification._id,
      channel: "in-app",
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
