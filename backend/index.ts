import admin from 'firebase-admin';
import express from 'express';
import bodyParser from 'body-parser';

// Path to wherever you put your service-account.json
const serviceAccount = require('./service_account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://zoom-university-e7cbf.firebaseapp.com',
});

const db = admin.firestore();

const app = express();
const port = 8080;
app.use(bodyParser.json());

app.get('/', (_, res) => res.send('Hello World!'));

app.get('/self-check', async (_, resp) => {
  const data = {
    name: 'Hello World',
    time: admin.firestore.FieldValue.serverTimestamp(),
  };
  console.log('Sending doc to DB.');
  await db.collection('test').doc('random-id').set(data);
  console.log('Doc recorded in DB');
  const docRef = db.collection('test').doc('random-id');
  console.log('Trying to obtain doc in DB.');
  const docSnapshot = await docRef.get();
  console.log(
    `We obtained a doc with id ${docSnapshot.id}. It's content is logged below:`
  );
  console.log(docSnapshot.data());
  console.log('Now we will try to remove it.');
  await docRef.delete();
  console.log('The document is deleted.');
  console.log(
    'After all these operations, the db should be empty. We check that.'
  );
  db.collection('test')
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.docs.length === 0) {
        console.log('We passed the check. The page in browser should say OK.');
        resp.status(200).send('OK.');
      } else {
        console.log('We failed the check. Please check your setup.');
        resp.status(500).send('Something is messed up!');
      }
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));