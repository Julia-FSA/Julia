var AWS = require('aws-sdk')
const {awsConfig} = require('../../secrets')

AWS.config.update(process.env.AWS_CONFIG || awsConfig)
let docClient = new AWS.DynamoDB.DocumentClient()
let fridgeId =
  'AF56CVBWEI3WZM6BVEQ4YVWF6U7GUOFSPH47ZKANU7S6LPRE5CJY4OSCWBEGNK6WMMH474N3HW5YNZC3EYCVKLQNTTTW3WROV24KCEYW5B4B3CLRYUHXSJU5FFU7FLJ5AYIDQJ2WTHEJSA4WSOTEQXCXBQ463B6IV7EDSI6GQUN6VDNMAUUSIOFSO6Z3O7DGQBX42GJJ4IPPTWY'
const test = async id => {
  let stockId = id
  console.log(stockId)
  let params = {
    TableName: 'stocks',
    Key: {
      id: stockId
    }
  }
  const data = await docClient.get(params).promise()
  console.log(data.Item)
}

test(fridgeId)
