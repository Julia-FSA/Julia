const router = require('express').Router()
const {
  setSaltAndPassword,
  encryptPassword,
  generateSalt,
  correctPassword
} = require('./encrypter')
var AWS = require('aws-sdk')
const {awsConfig} = require('../../secrets')
const {v4: uuidv4} = require('uuid')
AWS.config.update(awsConfig)
const docClient = new AWS.DynamoDB.DocumentClient()
module.exports = router

// router.post('/login', async (req, res, next) => {
//   try {
//     const params = {
//       TableName: 'web_user',
//       FilterExpression: '#email = :email',
//       ExpressionAttributeNames: {'#email': 'email'},
//       ExpressionAttributeValues: {':email': req.body.email}
//     }

//     let user = await docClient
//       .scan(params, function(err, data) {
//         if (err) {
//           console.log('users::save::error - ' + JSON.stringify(err, null, 2))
//         } else {
//           return data
//         }
//       })
//       .promise()

//     if (correctPassword(req.body.password, user.Items[0])) {
//       req.login(user, err => (err ? next(err) : res.send(user.Items[0])))
//     } else {
//       console.log('Wrong email or password')
//       res.status(401).send('Wrong username and/or password')
//     }
//   } catch (err) {
//     next(err)
//   }
// })

router.post('/login', async (req, res, next) => {
  try {
    const params = {
      TableName: 'web_user',
      FilterExpression: '#email = :email AND #password = :password',

      ExpressionAttributeNames: {
        '#email': 'email',
        '#password': 'password'
      },
      ExpressionAttributeValues: {
        ':email': req.body.email,
        ':password': req.body.password
      }
    }
    let user = await docClient
      .scan(params, function(err, data) {
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
    } else if (!correctPassword(req.body.password, user)) {
      console.log('Incorrect password for user:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else {
      req.login(user, err => (err ? next(err) : res.json(user)))
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
  let password = req.body.password
  let salt = generateSalt()
  let hashedPass = encryptPassword(password, salt)
  console.log(hashedPass)
  try {
    const salt = generateSalt()
    const goodPassword = encryptPassword(req.body.password, salt)
    const params = {
      TableName: 'web_user',
      Item: {
        id: uuidv4(),
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        created_on: new Date().toString(),
        is_deleted: false,
        salt: salt,
        password: goodPassword,
        email: req.body.email
      }
    }

    const user = docClient.put(params, function(err, data) {
      if (err) {
        //console.log('users::sign up::error - ' + JSON.stringify(err, null, 2))
      } else {
        return data
      }
    })

    req.login(user, err => (err ? next(err) : res.send(user.params.Item)))
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
