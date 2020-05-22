const axios = require('axios')
const db = require('../db')
const router = require('express').Router()
module.exports = router

router.put('/passcode/:userId', async (req, res, next) => {
  try {
    const {userId} = req.body
    const {code} = req.body
    console.log('userId', userId)
    console.log('code', code)
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

    await db.update(params).promise()
  } catch (err) {
    console.log(err)
  }

  res.status(200).send('Ok.')
})
