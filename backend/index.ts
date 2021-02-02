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

const activitiesCollection = db.collection('activities');

type ActivityWithIDs = Activity & {
  id: string,
  uid: string
}

// add an activity
app.post('/activities', async (req, res) => {
  const { activity, uid } = req.body;
  const newDoc = activitiesCollection.doc();
  await newDoc.set({
    name: activity.name,
    uid: uid
  }).catch(error => console.log(error));

  const linkCollection = newDoc.collection('links');
  for (let link of activity.links) {
    const linkDoc = linkCollection.doc();
    await linkDoc.set(link).catch(error => console.log(error));
  }

  const sessionCollection = newDoc.collection('liveSessions');
  for (let session of activity.liveSessions) {
    const sessionDoc = sessionCollection.doc();
    await sessionDoc.set(session).catch(error => console.log(error));
  }

  res.send(newDoc.id);
});

// get a user's activities
app.get('/activities', async (req, res) => {
  const query = await activitiesCollection.where('uid', '==', req.query.uid).get();
  let activities: Activity[] = [];
  for (let docSnapshot of query.docs) {
    const name = docSnapshot.data().name;

    const sessionCollection = db.collection('activities/' + docSnapshot.id + '/liveSessions');
    const sessionDocs = await sessionCollection.get();
    const liveSessions = sessionDocs.docs.map((sessionSnapshot) => sessionSnapshot.data() as LiveSession);

    const linkCollection = db.collection('activities/' + docSnapshot.id + '/links');
    const linkDocs = await linkCollection.get();
    const links = linkDocs.docs.map((linkSnapshot) => linkSnapshot.data() as Link);

    const activity: Activity = {
      name: name,
      liveSessions: liveSessions,
      links: links
    }
    activities.push(activity);
  }
  res.send(activities);
});


app.listen(process.env.PORT || 8080, () => console.log(`Server started!`));