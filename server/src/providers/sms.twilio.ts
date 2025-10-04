// server/src/providers/sms.twilio.ts
import Twilio from "twilio";
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM } from "../config";

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM) {
 throw new Error("Twilio credentials are required (TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN/TWILIO_FROM)");
}

let client: Twilio.Twilio | null = null;
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  client = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

export async function sendSms(to: string, body: string) {
  if (!client) {
    throw new Error("Twilio client is not configured. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.");
  }
  const message = await client.messages.create({
    from: TWILIO_FROM,
    to,
    body,
  });
  return message.sid;
}
