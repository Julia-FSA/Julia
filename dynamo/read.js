var AWS = require('aws-sdk')
const awsConfig = require('../secrets')

AWS.config.update(process.env.AWS_CONFIG || awsConfig)
let docClient = new AWS.DynamoDB.DocumentClient()

let fetchOneByKey = function() {
  var params = {
    TableName: 'test',
    Key: {
      test_id: 'banana'
    }
  }
  docClient.get(params, function(err, data) {
    if (err) {
      console.log(
        'users::fetchOneByKey::error - ' + JSON.stringify(err, null, 2)
      )
    } else {
      console.log(
        'users::fetchOneByKey::success - ' + JSON.stringify(data, null, 2)
      )
    }
  })
}

fetchOneByKey()
