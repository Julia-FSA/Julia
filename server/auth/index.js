const router = require('express').Router()
const {
  correctPassword,
  generateSalt,
  encryptPassword,
  setSaltAndPassword
} = require('./encrypter')
var AWS = require('aws-sdk')
const {awsConfig} = require('../../secrets')
const {v4: uuidv4} = require('uuid')
AWS.config.update(awsConfig)
const docClient = new AWS.DynamoDB.DocumentClient()
module.exports = router

router.post('/login', async (req, res, next) => {
  console.log(req.body)
  try {
    const params = {
      TableName: 'site_user',
      Key: {
        email: req.body.email
      }
    }
    const user = await docClient
      .get(params, function(err, data) {
        if (err) {
          console.log('users::save::error - ' + JSON.stringify(err, null, 2))
        } else {
          return data
        }
      })
      .promise()
    console.log(user)
    // const user = await docClient.put(params)
    // const user = await User.create(req.body)
    //req.login(user, (err) => (err ? next(err) : res.status(200)))
  } catch (err) {
    // if (err.name === 'SequelizeUniqueConstraintError') {
    //   res.status(401).send('User already exists')
    // } else {
    next(err)
    // }
  }

  // try {
  //   const user = await User.findOne({where: {email: req.body.email}})
  //   if (!user) {
  //     console.log('No such user found:', req.body.email)
  //     res.status(401).send('Wrong username and/or password')
  //   } else if (!user.correctPassword(req.body.password)) {
  //     console.log('Incorrect password for user:', req.body.email)
  //     res.status(401).send('Wrong username and/or password')
  //   } else {
  //     req.login(user, err => (err ? next(err) : res.json(user)))
  //   }
  // } catch (err) {
  //   next(err)
  // }
})

// router.post('/signup', async (req, res, next) => {
//   try {
//     const user = await User.create(req.body)
//     req.login(user, (err) => (err ? next(err) : res.json(user)))
//   } catch (err) {
//     if (err.name === 'SequelizeUniqueConstraintError') {
//       res.status(401).send('User already exists')
//     } else {
//       next(err)
//     }
//   }
// })

// router.post('/signup', async (req, res, next) => {
//   try {
//     const params = {
//       TableName: 'web_user',
//       Item: {
//         id: uuidv4(),
//         created_on: new Date().toString(),
//         is_deleted: false,
//         ...req.body,
//       },
//     }
//     const user = docClient.put(params, function (err, data) {
//       if (err) {
//         console.log('users::save::error - ' + JSON.stringify(err, null, 2))
//       } else {
//         return data
//       }
//     })
//     console.log(user.params.Item)
//     // const user = await docClient.put(params)
//     // const user = await User.create(req.body)
//     req.login(user, (err) => (err ? next(err) : res.status(200)))
//   } catch (err) {
//     if (err.name === 'SequelizeUniqueConstraintError') {
//       res.status(401).send('User already exists')
//     } else {
//       next(err)
//     }
//   }
// })

// router.post('/logout', (req, res) => {
//   req.logout()
//   req.session.destroy()
//   res.redirect('/')
// })

// router.get('/me', (req, res) => {
//   res.json(req.user)
// })

// router.use('/google', require('./google'))
