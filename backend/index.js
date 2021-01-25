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
const body_parser_1 = __importDefault(require("body-parser"));
// Path to wherever you put your service-account.json
const serviceAccount = require('./service_account.json');
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    databaseURL: 'https://zoom-university-e7cbf.firebaseapp.com',
});
const db = firebase_admin_1.default.firestore();
const app = express_1.default();
const port = 8080;
app.use(body_parser_1.default.json());
app.get('/', (_, res) => res.send('Hello World!'));
app.get('/self-check', (_, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        name: 'Hello World',
        time: firebase_admin_1.default.firestore.FieldValue.serverTimestamp(),
    };
    console.log('Sending doc to DB.');
    yield db.collection('test').doc('random-id').set(data);
    console.log('Doc recorded in DB');
    const docRef = db.collection('test').doc('random-id');
    console.log('Trying to obtain doc in DB.');
    const docSnapshot = yield docRef.get();
    console.log(`We obtained a doc with id ${docSnapshot.id}. It's content is logged below:`);
    console.log(docSnapshot.data());
    console.log('Now we will try to remove it.');
    yield docRef.delete();
    console.log('The document is deleted.');
    console.log('After all these operations, the db should be empty. We check that.');
    db.collection('test')
        .get()
        .then((querySnapshot) => {
        if (querySnapshot.docs.length === 0) {
            console.log('We passed the check. The page in browser should say OK.');
            resp.status(200).send('OK.');
        }
        else {
            console.log('We failed the check. Please check your setup.');
            resp.status(500).send('Something is messed up!');
        }
    });
}));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
