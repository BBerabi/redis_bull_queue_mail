import Bull from 'bull';
import emailProcess from "../processes/email_process";
const { ExpressAdapter, createBullBoard, BullAdapter, BullMQAdapter } = require('@bull-board/express');

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

export { serverAdapter } 

const emailQueue = new Bull('email', {
  redis: { port: 6379, host: "127.0.0.1"},
  limiter: {
    max: 1000,
    duration: 5000
  }
});

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullAdapter(emailQueue)],
  serverAdapter: serverAdapter,
});

emailQueue.process(emailProcess);

const sendNewEmail = (data: any) => {
  console.log("data: ", data);
  emailQueue.add(data, {
    attempts: 5,
    // lifo: true,
    // delay: 5000,
    // priority: 11,
    // repeat: "*/5 * * * *",
    // check documentation for more.
  });
}

export {
  sendNewEmail
}
