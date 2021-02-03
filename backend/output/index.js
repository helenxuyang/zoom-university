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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(JSON.parse(Buffer.from(process.env.FIREBASE_CONFIG, 'base64').toString('ascii'))),
    databaseURL: 'https://zoom-university-e7cbf.firebaseapp.com',
});
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.static(path_1.default.join(__dirname, '../../frontend/build')));
app.use(express_1.default.json());
const db = firebase_admin_1.default.firestore();
const usersCollection = db.collection('users');
// check if user exists
app.get('/users/:uid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.params.uid;
    const userDoc = yield usersCollection.doc(uid).get();
    res.send(userDoc.exists);
}));
// add a user
app.post('/users/:uid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.params.uid;
    const newDoc = usersCollection.doc(uid);
    yield newDoc.set({}).catch(error => console.log(error));
    res.send(uid);
}));
// add an activity
app.post('/activities/:uid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activity = req.body;
    const uid = req.params.uid;
    const activitiesCollection = db.collection('users/' + uid + '/activities');
    const newDoc = activitiesCollection.doc();
    const { docID } = activity, newActivity = __rest(activity, ["docID"]);
    yield newDoc.set(Object.assign({}, newActivity)).catch(error => console.log(error));
    res.send(newDoc.id);
}));
// delete an activity
app.delete('/activities/:uid/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.params.uid;
    const activitiesCollection = db.collection('users/' + uid + '/activities');
    const id = req.params.id;
    yield activitiesCollection.doc(id).delete().catch(error => console.log(error));
    res.send(id);
}));
// update an activity
app.put('/activities/:uid/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.params.uid;
    const activitiesCollection = db.collection('users/' + uid + '/activities');
    const id = req.params.id;
    const _a = req.body, { docID } = _a, activity = __rest(_a, ["docID"]);
    activitiesCollection.doc(id).update(activity);
    res.send(id);
}));
// get a user's activities
app.get('/activities/:uid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.params.uid;
    console.log(uid);
    const query = yield db.collection('users/' + uid + '/activities').get();
    let activities = query.docs.map((doc) => {
        const data = doc.data();
        return {
            name: data.name,
            liveSessions: data.liveSessions,
            links: data.links,
            docID: doc.id
        };
    });
    console.log("activities", activities);
    res.send(activities);
}));
app.listen(process.env.PORT || 8080, () => console.log(`Server started!`));
