import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import System from "../db/models/systems";
import { maintenanceGuard } from "../middleware/auth";
import NotificationModel from "../db/models/Notification";
import { emailQueue, smsQueue, inappQueue } from "../queues/bull";
import { getQueueForChannel } from "../queues";

const router = Router();

/**
 * GET /admin/notifications
 * Admins and superadmins can filter notifications
 */
router.get(
  "/notifications",
  requireAuth,
  requireRole(["admin", "superadmin"]),
  async (req, res) => {
    const { status, channel, type, userId } = req.query;
    const limit = Math.min(Number(req.query.limit || 50), 500);
    const skip = Number(req.query.skip || 0);

    const filter: any = {};
    if (status) filter.status = status;
    if (channel) filter.channel = channel;
    if (type) filter.type = type;
    if (userId) filter.userId = userId;

    const docs = await NotificationModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.json({ data: docs, count: docs.length });
  }
);

/**
 * POST /admin/notifications/:id/retry
 * Admins and superadmins can retry failed notifications
 */
router.post(
  "/notifications/:id/retry",
  requireAuth,
  requireRole(["admin", "superadmin"]),
  async (req, res) => {
    const id = req.params.id;
    const notification = await NotificationModel.findById(id);
    if (!notification) return res.status(404).json({ error: "not_found" });

    const channel = notification.channel || "in-app";
    const queue = getQueueForChannel(channel as any);

    const payload = {
      eventId: notification.eventId || `notif:${notification._id}`,
      type: notification.type || "manual.retry",
      recipient: notification.recipient || {},
      channel,
      payload: notification.payload || {},
      meta: { retryBy: req.user?.id || "admin" },
    };

    try {
      await queue.add(payload.type, payload, {
        jobId: `retry:${payload.eventId}:${Date.now()}`,
        attempts: 5,
        backoff: { type: "exponential", delay: 2000 },
      });

      notification.status = "pending";
      await notification.save();

      return res.json({ message: "requeued" });
    } catch (err: any) {
      console.error("failed to requeue", err);
      return res.status(500).json({ error: "failed_to_requeue" });
    }
  }
);

/**
 * POST /admin/shutdown
 * ONLY superadmins can shutdown the system
 */
router.post(
  "/shutdown",
  requireAuth,
  requireRole(["superadmin"]),
  async (req, res) => {
    console.warn("Superadmin triggered shutdown at", new Date().toISOString());
    res.json({ message: "System shutdown initiated by superadmin" });
    process.exit(0); // optional: kills the process
  }
);

export default router;
