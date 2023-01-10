import express from 'express';
import bodyParser from 'body-parser'

import { sendNewEmail } from './queues/email_queue';
import { serverAdapter } from './queues/email_queue';
const app = express();

app.use(bodyParser.json());
app.use("/admin/queues", serverAdapter.getRouter());

app.post('/send-email', async (req, res) => {
  console.log("sending emails");
  console.log("Req body: ", req.body);
  const { message, ...restBody} = req.body;
  await sendNewEmail({
    ...req.body,
    html: `<p>${message}</p>`
  }
  );
  res.send({status: 'ok'});
});

app.get('/', async (req, res) => {
  console.log("Test works!");
  res.send({status: 'root response.'});
})

app.get('/berkay', async (req, res) => {
  console.log("Berkay works!");
  res.send({status: 'Berkay response'});
})
app.listen(5000, () => console.log('App running on port 5000'));
