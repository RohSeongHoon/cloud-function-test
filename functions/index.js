const functions = require("firebase-functions");
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('./cloud-function-test-c9647-9e51c18a731f.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

exports. aa =  functions.https.onRequest(async (request, response) => {
  let aa = db.collection("test").doc("testId");
  let aaResult = await aa.get();
  response.send(aaResult.data());
});






 
 
 

