"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
// Path to wherever you put your service-account.json
const serviceAccount = require('../service_account.json');
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    databaseURL: 'https://zoom-university-e7cbf.firebaseapp.com',
});
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.static(path_1.default.join(__dirname, '../frontend/build')));
app.use(express_1.default.json());
const db = firebase_admin_1.default.firestore();
const activitiesCollection = db.collection('activities');
// add an activity
app.post('/activities', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { activity, uid } = req.body;
    const newDoc = activitiesCollection.doc();
    yield newDoc.set({
        name: activity.name,
        uid: uid
    }).catch(error => console.log(error));
    const linkCollection = newDoc.collection('links');
    for (let link of activity.links) {
        const linkDoc = linkCollection.doc();
        yield linkDoc.set(link).catch(error => console.log(error));
    }
    const sessionCollection = newDoc.collection('liveSessions');
    for (let session of activity.liveSessions) {
        const sessionDoc = sessionCollection.doc();
        yield sessionDoc.set(session).catch(error => console.log(error));
    }
    res.send(newDoc.id);
}));
// get a user's activities
app.get('/activities', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = yield activitiesCollection.where('uid', '==', req.query.uid).get();
    let activities = [];
    for (let docSnapshot of query.docs) {
        const name = docSnapshot.data().name;
        const sessionCollection = db.collection('activities/' + docSnapshot.id + '/liveSessions');
        const sessionDocs = yield sessionCollection.get();
        const liveSessions = sessionDocs.docs.map((sessionSnapshot) => sessionSnapshot.data());
        const linkCollection = db.collection('activities/' + docSnapshot.id + '/links');
        const linkDocs = yield linkCollection.get();
        const links = linkDocs.docs.map((linkSnapshot) => linkSnapshot.data());
        const activity = {
            name: name,
            liveSessions: liveSessions,
            links: links
        };
        activities.push(activity);
    }
    res.send(activities);
}));
app.listen(8080, () => console.log(`Server started!`));
