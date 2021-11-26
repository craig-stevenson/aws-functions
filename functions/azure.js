/*
{
  "appId": "5f427432-18b3-4beb-b9a3-ffb284d7ede5",
  "displayName": "Hello-World",
  "name": "5f427432-18b3-4beb-b9a3-ffb284d7ede5",
  "password": "WSlvJMKacW-qr68SuZRP-97vjjuVv.ofob",
  "tenant": "305bccf8-e4ef-4119-acba-a5e94e5d3065"
}
*/
const functions = require("firebase-functions");
// AZURE_TENANT_ID = 
// const { NetworkManagementClient } = require("@azure/arm-network");
// const { ComputeManagementClient } = require("@azure/arm-compute");

exports.listVirtualMachines = functions.https.onRequest((req, res) => {
  res.json({result: "hello world"});
});
