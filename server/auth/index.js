const router = require('express').Router()
const User = require('../db/models/user')
const {v4: uuidv4} = require('uuid')
const crypto = require('crypto')
module.exports = router

var AWS = require('aws-sdk')
const {awsConfig} = require('../../secrets')

AWS.config.update(process.env.AWS_CONFIG || awsConfig)
let docClient = new AWS.DynamoDB.DocumentClient()

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({where: {email: req.body.email}})
    if (!user) {
      console.log('No such user found:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else if (!user.correctPassword(req.body.password)) {
      console.log('Incorrect password for user:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else {
      req.login(user, err => (err ? next(err) : res.json(user)))
    }
  } catch (err) {
    next(err)
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    const salt = crypto.randomBytes(16).toString('hex')
    const password = crypto
      .pbkdf2Sync(req.body.password, salt, 1000, 64, `sha512`)
      .toString(`hex`)
    const input = {
      first_name: 'firstSalt',
      id: uuidv4(),
      last_name: 'lastname',
      email: req.body.email,
      made_recipe_ids: [],
      password: password,
      salt: salt,
      saved_recipe_ids: [],
      stock_id: 0
    }
    var params = {
      TableName: 'users',
      Item: input
    }
    await docClient.put(params).promise()
    res.sendStatus(201)
    // const user = await User.create(req.body)
    // req.login(user, err => (err ? next(err) : res.json(user)))
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
