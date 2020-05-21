const router = require('express').Router()
const {
  setSaltAndPassword,
  encryptPassword,
  generateSalt,
  correctPassword,
} = require('./encrypter')
const {v4: uuidv4} = require('uuid')
const db = require('../db')

module.exports = router

router.post('/login', async (req, res, next) => {
  try {
    const params = {
      TableName: 'users',
      FilterExpression: '#email = :email',
      ExpressionAttributeNames: {'#email': 'email'},
      ExpressionAttributeValues: {':email': req.body.email},
    }

    let user = await db
      .scan(params, function (err, data) {
        if (err) {
          console.log('users::login::error - ' + JSON.stringify(err, null, 2))
        } else {
          return data
        }
      })
      .promise()
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
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: goodPassword,
        salt: salt,
        email: req.body.email,
      },
    }

    const user = db.put(params, function (err, data) {
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

// router.use('/google', require('./google'))
