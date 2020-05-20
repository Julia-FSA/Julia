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

// AWS.config.update(awsConfig)
// let docClient = new AWS.DynamoDB.DocumentClient()

// let remove = function () {
//   var params = {
//     TableName: 'users',
//     Key: {
//       email_id: 'example@gmail.com',
//     },
//   }
//   docClient.delete(params, function (err, data) {
//     if (err) {
//       console.log('users::delete::error - ' + JSON.stringify(err, null, 2))
//     } else {
//       console.log('users::delete::success')
//     }
//   })
// }

// // remove()
