import { emailQueue } from '../queues/bull';

export const sendEmail = (to: string, subject: string, text: string, html: string) => {
    emailQueue.add({ to, subject, text, html });
};
// Example: add a job with retries and exponential backoff
emailQueue.add({ to: String, subject: String, text: String, html: String }, {
  attempts: 5,
  backoff: {
    type: 'exponential',
    delay: 1000 // initial delay in ms
  },
  removeOnComplete: true,
  removeOnFail: false
});
