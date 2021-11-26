const functions = require("firebase-functions");
const admin = require("firebase-admin");
const AWS = require("aws-sdk");

const describeNetworkAcls = functions.runWith({minInstances: 1}).https.onCall(async (data, context) => {
  const email = context.auth.token.email;
  const region = data.region;
  if (!email) {
    return {
      "message": "no auth data",
    };
  }

  const promise1 = admin.firestore().collection("keys").doc(email).get();
  return promise1.then((result) => {
    const _json = result.data();
    const ec2 = new AWS.EC2({
      apiVersion: "2016-11-15",
      region: region,
      credentials: {
        accessKeyId: _json.awsKeyId,
        secretAccessKey: _json.awsSecretAccessKey,
      },
    });

    const ec2Promise = ec2.describeNetworkAcls().promise();
    return ec2Promise
      .then((result) => { return result; })
      .catch(err => { return { "error": err } });
  });
});

module.exports = describeNetworkAcls;