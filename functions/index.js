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

  db.collection("users").doc(userId).collection("likedPosts").doc(postId).set({});
  postRef.collection("likedUsers").doc(userId).set({});
  await postRef.update({
    likeCount: FieldValue.increment(1),
  });
  const postSnapshot = await postRef.get();
  console.log(postSnapshot.data());
});

exports.getTestPost = functions.https.onRequest(async (req, res) => {
  const userId = req.query.userId;
  const postId = req.query.postId;

  const postRef = db.collection("testPosts").doc(postId);
  const likeSnapshot = await db
    .collection("testPosts")
    .doc(postId)
    .collection("likedUsers")
    .doc(userId)
    .get();
  const postSnapshot = await postRef.get();
  const post = postSnapshot.data();

  if (likeSnapshot.exists) {
    post.likeCheck = true;
  } else {
    post.likeCheck = false;
  }

  res.send(post);
});



  exports.likedPostList = functions.https.onRequest(async (req, res) => {
    const userId = req.query.userId;

    const userSnapshot = await db
      .collection("users")
      .doc(userId)
      .collection("likedPosts")
      .get();
    const postList = [];
    userSnapshot.forEach(async (doc) => {
      const postSnapshot = await db.collection("posts").doc(doc.id).get();
      postList.push(postSnapshot.data());
      res.send(postList);
    });
  });