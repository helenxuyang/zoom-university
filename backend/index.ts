require('dotenv').config();
import admin from 'firebase-admin';
import express from 'express';
import path from 'path';
import cors from 'cors';
import type { Activity, Link, LiveSession } from 'types/Types';

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(Buffer.from(process.env.FIREBASE_CONFIG as string, 'base64').toString('ascii'))),
  databaseURL: 'https://zoom-university-e7cbf.firebaseapp.com',
});

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '../../frontend/build')));
app.use(express.json());
const db = admin.firestore();

const usersCollection = db.collection('users');

type ActivityWithIDs = Activity & {
  id: string,
  uid: string
}

// check if user exists
app.get('/users/:uid', async (req, res) => {
  const uid = req.params.uid;
  const userDoc = await usersCollection.doc(uid).get();
  res.send(userDoc.exists);
})

// add a user
app.post('/users/:uid', async (req, res) => {
  const uid = req.params.uid;
  const newDoc = usersCollection.doc(uid);
  await newDoc.set({}).catch(error => console.log(error));
  res.send(uid);
})

// add an activity
app.post('/activities/:uid', async (req, res) => {
  const activity = req.body;
  const uid = req.params.uid;
  const activitiesCollection = db.collection('users/' + uid + '/activities');
  const newDoc = activitiesCollection.doc();

  const { docID, ...newActivity } = activity;
  await newDoc.set({ ...newActivity }).catch(error => console.log(error));
  res.send(newDoc.id);
});

// delete an activity
app.delete('/activities/:uid/:id', async (req, res) => {
  const uid = req.params.uid;
  const activitiesCollection = db.collection('users/' + uid + '/activities');

  const id = req.params.id;
  await activitiesCollection.doc(id as string).delete().catch(error => console.log(error));
  res.send(id);
});

// update an activity
app.put('/activities/:uid/:id', async (req, res) => {
  const uid = req.params.uid;
  const activitiesCollection = db.collection('users/' + uid + '/activities');

  const id = req.params.id;
  const { docID, ...activity } = req.body;
  await activitiesCollection.doc(id).update(activity).catch(error => console.log(error));
  res.send(id);
});

// get a user's activities
app.get('/activities/:uid', async (req, res) => {
  const uid = req.params.uid;
  const query = await db.collection('users/' + uid + '/activities').get();
  let activities = query.docs.map((doc) => {
    const data = doc.data();
    return {
      name: data.name,
      liveSessions: data.liveSessions,
      links: data.links,
      docID: doc.id
    }
  });
  res.send(activities);
});


app.listen(process.env.PORT || 8080, () => console.log(`Server started!`));