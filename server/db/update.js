// var AWS = require('aws-sdk')
// let {awsConfig} = require('../secrets')
// if (process.env.accessKeyId || process.env.endpoint) {
//   awsConfig = {
//     region: process.env.region,
//     endpoint: process.env.endpoint,
//     accessKeyId: process.env.accessKeyId,
//     secretAccessKey: process.env.secretAccessKey,
//   }
// }
// AWS.config.update(process.env.awsConfig || awsConfig)
// let docClient = new AWS.DynamoDB.DocumentClient()

// let modify = function () {
//   var params = {
//     TableName: 'users',
//     Key: {email_id: 'example-1@gmail.com'},
//     UpdateExpression: 'set updated_by = :byUser, is_deleted = :boolValue',
//     ExpressionAttributeValues: {
//       ':byUser': 'updateUser',
//       ':boolValue': true,
//     },
//     ReturnValues: 'UPDATED_NEW',
//   }
//   docClient.update(params, function (err, data) {
//     if (err) {
//       console.log('users::update::error - ' + JSON.stringify(err, null, 2))
//     } else {
//       console.log('users::update::success ' + JSON.stringify(data))
//     }
//   })
// }

// // modify()
