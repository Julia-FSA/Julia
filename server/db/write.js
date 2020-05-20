var AWS = require('aws-sdk')
const {v4: uuidv4} = require('uuid')
let {awsConfig} = require('../../secrets')
if (process.env.accessKeyId || process.env.endpoint) {
  awsConfig = {
    region: process.env.region,
    endpoint: process.env.endpoint,
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey
  }
}
AWS.config.update(awsConfig)
let docClient = new AWS.DynamoDB.DocumentClient()

// let save = function () {
//   var input = {
//     email_id: 'example-1@gmail.com',
//     created_by: 'clientUser',
//     created_on: new Date().toString(),
//     updated_by: 'clientUser',
//     updated_on: new Date().toString(),
//     is_deleted: false,
//   }
//   var params = {
//     TableName: 'users',
//     Item: input,
//   }
//   docClient.put(params, function (err, data) {
//     if (err) {
//       console.log('users::save::error - ' + JSON.stringify(err, null, 2))
//     } else {
//       console.log('users::save::success')
//     }
//   })
// }

let signUp = async user => {
  await docClient.put(user, function(err, data) {
    if (err) {
      console.log('users::save::error - ' + JSON.stringify(err, null, 2))
    } else {
      console.log('users::save::success - ', typeof data)
    }
  })
}

// save()

// const params = {
//   TableName: 'web_user',
//   Item: {
//     id: uuidv4(),
//     created_on: new Date().toString(),
//     is_deleted: false,
//     email: '234@email.com',
//     firstName: 'Alexa',
//     lastName: 'Amazon',
//     password: '123',
//   },
// }

// signUp(params)

//SET SECRET CODE IN DATABASE
const setCode = async (userId, code) => {
  const params = {
    TableName: 'users',
    Key: {
      id: userId
    },
    UpdateExpression: 'set passcode = :c',
    ExpressionAttributeValues: {
      ':c': code
    },
    ReturnValues: 'ALL_NEW'
  }

  await docClient.update(params, function(err, data) {
    if (err) {
      console.error(
        'Unable to add item. Error JSON:',
        JSON.stringify(err, null, 2)
      )
    } else {
      console.log('Success!', data)
    }
  })
}

module.exports = {
  setCode
}
