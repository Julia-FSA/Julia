const AWS = require('aws-sdk')
let {awsConfig} = process.env.accessKeyId ? {} : require('../../secrets')

if (process.env.accessKeyId) {
  awsConfig = {
    region: process.env.region,
    endpoint: process.env.endpoint,
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey
  }
}
AWS.config.update(awsConfig)
const db = new AWS.DynamoDB.DocumentClient()

module.exports = db

// This is a global Mocha hook used for resource cleanup.
// Otherwise, Mocha v4+ does not exit after tests.
if (process.env.NODE_ENV === 'test') {
  after('close database connection', () => db.close())
}
