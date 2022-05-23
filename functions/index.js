const functions = require("firebase-functions");
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const serviceAccount = require("./cloud-function-test-c9647-9e51c18a731f.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

exports.getTest = functions.https.onRequest(async (req, res) => {
  let docId = req.query.docId;
  let docRef = db.collection("test").doc(docId);
  let docResult = await docRef.get();
  console.log(docResult.data());
});

exports.addLike = functions.https.onRequest(async (req, res) => {
  const userId = req.query.userId;
  const postId = req.query.postId;

  const postRef = db.collection("testPosts").doc(postId);
  postRef.collection("likedUsers").doc(userId).set({});
  await postRef.update({
    likeCount: FieldValue.increment(1),
  });
  const postSnapshot = await postRef.get();
  console.log(postSnapshot.data());
});
