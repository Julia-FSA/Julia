// const db = require('./db')

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
//   db.update(params, function (err, data) {
//     if (err) {
//       console.log('users::update::error - ' + JSON.stringify(err, null, 2))
//     } else {
//       console.log('users::update::success ' + JSON.stringify(data))
//     }
//   })
// }

// // modify()
