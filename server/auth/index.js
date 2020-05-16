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

router.post('/login', async (req, res, next) => {
  try {
    const params = {
      TableName: 'users',
      FilterExpression: '#email = :email',
      ExpressionAttributeNames: {'#email': 'email'},
      ExpressionAttributeValues: {':email': req.body.email},
    }

    let user = await docClient
      .scan(params, function (err, data) {
        if (err) {
          console.log('users::login::error - ' + JSON.stringify(err, null, 2))
        } else {
          return data
        }
      })
      .promise()
    // console.log('login hits this route >>>>>>>>>>>>>>', user.Items[0])
    if (correctPassword(req.body.password, user.Items[0])) {
      req.login(user, (err) => (err ? next(err) : res.send(user.Items[0])))
    } else {
      console.log('Wrong email or password')
      res.status(401).send('Wrong username and/or password')
    }
  } catch (err) {
    next(err)
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    const salt = generateSalt()
    const goodPassword = encryptPassword(req.body.password, salt)
    const params = {
      TableName: 'users',
      Item: {
        id: uuidv4(),
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        password: goodPassword,
        salt: salt,
        email: req.body.email,
        // stock_id: uuidv4(),
        // made_recipe_ids:[],
        // saved_recipe_ids:[]
        // created_on: new Date().toString(),
        // is_deleted: false,
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
