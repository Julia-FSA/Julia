const router = require('express').Router()
const {
  setSaltAndPassword,
  encryptPassword,
  generateSalt,
  correctPassword,
} = require('./encrypter')
var AWS = require('aws-sdk')
const {awsConfig} = require('../../secrets')
const {v4: uuidv4} = require('uuid')
AWS.config.update(awsConfig)
const docClient = new AWS.DynamoDB.DocumentClient()
module.exports = router

async function queryName(ingre) {
  const results = await docClient
    .scan({
      TableName: 'test',
      FilterExpression: '#title = :title',
      ExpressionAttributeNames: {
        '#title': 'title',
      },
      ExpressionAttributeValues: {
        ':title': ingre,
      },
    })
    .promise()
  console.log(results.Items)
}

router.post('/login', async (req, res, next) => {
  try {
    const params = {
      TableName: 'web_user',
      FilterExpression: '#email = :email AND #password = :password',

      ExpressionAttributeNames: {
        '#email': 'email',
        '#password': 'password',
      },
      ExpressionAttributeValues: {
        ':email': req.body.email,
        ':password': req.body.password,
      },
    }
    let user = await docClient
      .scan(params, function (err, data) {
        if (err) {
          console.log('users::login::error - ' + JSON.stringify(err, null, 2))
        } else {
          console.log('Login succeeded! - ' + JSON.stringify(data, null, 2))
        }
      })
      .promise()
    if (!user) {
      console.log('No such user found:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else if (!correctPassword(req.body.password)) {
      console.log('Incorrect password for user:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else {
      req.login(user, (err) => (err ? next(err) : res.json(user)))
    }
    // console.log(`User is >>>>>>>>>>>>>`, user)
    // const user = await docClient.put(params)
    // const user = await User.create(req.body)
    // req.login(user, (err) => (err ? next(err) : res.status(200)))
  } catch (err) {
    next(err)
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    const params = {
      TableName: 'web_user',
      Item: {
        id: uuidv4(),
        created_on: new Date().toString(),
        is_deleted: false,
        ...req.body,
      },
    }
    const user = docClient.put(params, function (err, data) {
      if (err) {
        console.log('users::sign up::error - ' + JSON.stringify(err, null, 2))
      } else {
        return data
      }
    })
    req.login(user, (err) => (err ? next(err) : res.send(user.params.Item)))
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/')
})

router.get('/me', (req, res) => {
  res.json(req.user)
})

router.use('/google', require('./google'))
