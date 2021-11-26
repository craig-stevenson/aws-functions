
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const AWS = require("aws-sdk");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const getEc2Client = async (email, region) => {
  const data = await admin.firestore().collection("keys").doc(email).get();
  const ec2 = new AWS.EC2({
    apiVersion: "2016-11-15",
    region: region ? region : "us-east-1",
    credentials: {
      accessKeyId: data.awsKeyId,
      secretAccessKey: data.awsSecretAccessKey,
    },
  });
  return ec2;
}

exports.azure = require('./azure');

exports.verifyAccount = require('./verifyAccount');

exports.describeNetworkAcls = require('./describeNetworkAcls');

exports.getRouteTables = functions.runWith({minInstances: 1}).https.onCall(async (data, context) => {
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

    const ec2Promise = ec2.describeRouteTables().promise();
    return ec2Promise.then((err, result) => {
      if (err) {
        return {
          "message": err,
        };
      }
      return result;
    });
  });
});

exports.getNatGateways = functions.runWith({minInstances: 1}).https.onCall((data, context) => {
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

    const ec2Promise = ec2.describeNatGateways().promise();
    return ec2Promise.then((err, result) => {
      if (err) {
        return {
          "message": err,
        };
      }
      return result;
    });
  });
});

// Requires the id of the security group
exports.getSecurityGroupRules = functions.runWith({minInstances: 1}).https.onCall((data, context) => {
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

    const params = {
      MaxResults: 900,
      Filters: [{
        Name: "group-id",
        Values: [data.id],
      }],
    };

    const ec2Promise = ec2.describeSecurityGroupRules(params).promise();
    return ec2Promise.then((err, result) => {
      if (err) {
        return {
          "message": err,
        };
      }

      return result;
    });
  });
});

exports.getInternetGateways = functions.runWith({minInstances: 1}).https.onCall((data, context) => {
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

    const ec2Promise = ec2.describeInternetGateways().promise();
    return ec2Promise.then((err, result) => {
      if (err) return err;

      return result;
    });
  });
});


exports.stopEc2Instance = functions.runWith({minInstances: 1}).https.onCall((data, context) => {
  const email = context.auth.token.email;
  const region = data.region;
  if (!email) {
    return {
      "message": "no auth data",
    };
  }

  if (!data.InstanceIds) {
    return {
      "message": "no instances",
    };
  }

  const params = {
    InstanceIds: data.InstanceIds,
  };

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
    const ec2Promise = ec2.stopInstances(params).promise();
    return ec2Promise.then((err, result) => {
      if (err) return err;

      return result;
    });
  });
});

exports.startEc2Instance = functions.runWith({minInstances: 1}).https.onCall((data, context) => {
  const email = context.auth.token.email;
  const region = data.region;
  if (!email) {
    return {
      "message": "no auth data",
    };
  }

  if (!data.InstanceIds) {
    return {
      "message": "no instances",
    };
  }

  const params = {
    InstanceIds: data.InstanceIds,
  };

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
    const ec2Promise = ec2.startInstances(params).promise();
    return ec2Promise.then((err, result) => {
      if (err) return err;

      return result;
    });
  });
});


exports.getEc2Data = functions.runWith({minInstances: 1}).https.onCall((data, context) => {
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
    const ec2Promise = ec2.describeInstances().promise();
    return ec2Promise.then((result) => {
      return result;
    });
  });
});

exports.getVpcData = functions.runWith({minInstances: 1}).https.onCall((data, context) => {
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
    const ec2Promise = ec2.describeVpcs().promise();
    return ec2Promise.then((result) => {
      return result;
    });
  });
});

exports.getSubnetData = functions.runWith({minInstances: 1}).https.onCall((data, context) => {
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
    const ec2Promise = ec2.describeSubnets().promise();
    return ec2Promise.then((result) => {
      return result;
    });
  });
});

exports.describeSecurityGroups = functions.runWith({minInstances: 1}).https.onCall((data, context) => {
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
    const ec2Promise = ec2.describeSecurityGroups().promise();
    return ec2Promise.then((result) => {
      return result;
    });
  });
});

exports.describeRegions = functions.runWith({minInstances: 1}).https.onCall(async (data, context) => {
  const email = context.auth.token.email;
  if (!email) {
    return {
      "message": "no auth data",
    };
  }

  const keys = await admin.firestore().collection("keys").doc(email).get();
  const _json = keys.data();
  const ec2 = new AWS.EC2({
    apiVersion: "2016-11-15",
    region: "us-east-1",
    credentials: {
      accessKeyId: _json.awsKeyId,
      secretAccessKey: _json.awsSecretAccessKey,
    },
  });
  const securityGroups = await ec2.describeRegions().promise();
  return securityGroups;
});
