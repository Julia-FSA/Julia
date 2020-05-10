console.log('starting lambda function')

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'})

exports.handle = function(e, ctx, callback) {
  let scanningParameters = {
    TableName: 'test',
    limit: 10
  }

  docClient.scan(scanningParameters, function(err, data) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, data)
    }
  })

  // const params = {
  //     TableName: 'test',
  //     Key: {
  //         test_id: 'apples'
  //     }
  // }

  // docClient.get(params, function(err, data) {
  //     if(err) {
  //         callback(err, null)
  //     } else {
  //         callback(null, data)
  //     }
  // })
}
