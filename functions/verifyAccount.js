const functions = require("firebase-functions");
const admin = require("firebase-admin");
const AWS = require("aws-sdk");

const verifyAccount = functions.runWith({ minInstances: 1 }).https.onCall(async (data, context) => {
    const email = context.auth.token.email;
    if (!email) {
        return {
            "message": "no auth data",
        };
    }

    const promise1 = admin.firestore().collection("billing").doc(email).get();
    return promise1
        .then((result) => { return result.data(); })
        .catch(err => { return { "error": err } });
});

module.exports = verifyAccount;