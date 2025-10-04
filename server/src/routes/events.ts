import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { emailQueue, smsQueue, inappQueue, getQueueForChannel } from "../queues";
import { validate as validateUuid } from "uuid";

const router = Router();

router.post("/", async (req, res) => {
  const body = req.body || {};
  const type = body.type;
  if (!type) return res.status(400).json({ error: "type is required" });

  const eventId = typeof body.id === "string" && validateUuid(body.id) ? body.id : uuidv4();

  const payload = {
    eventId,
    type,
    recipient: body.recipient || {},
    channel: body.channel || "in-app",
    payload: body.payload || {},
    meta: body.meta || {},
  };


  const jobId = `evt:${eventId}`;

  try {
    const queue = getQueueForChannel(payload.channel as any);
    await queue.add(type, payload, {
      jobId,
      attempts: 5,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: true,
      removeOnFail: false,
    });

    res.status(202).json({ status: "accepted", eventId });
  } catch (err: any) {
    console.error("Error queueing event", err);
    return res.status(500).json({ error: "failed_to_queue_event" });
  }
});

export default router;
