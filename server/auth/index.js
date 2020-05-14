const router = require('express').Router()
const {
  correctPassword,
  generateSalt,
  encryptPassword,
  setSaltAndPassword,
} = require('./encrypter')
var AWS = require('aws-sdk')
const {awsConfig} = require('../../secrets')
const {v4: uuidv4} = require('uuid')
AWS.config.update(awsConfig)
const docClient = new AWS.DynamoDB.DocumentClient()
module.exports = router

// const addIngredientToFridge = async (ingredient, unit) => {
//   try {
//       let result = await docClient.get({
//       TableName: 'stocks',
//       Key: {id: 0}
//     }).promise()
//   let prevIngredients = result.Item.ingredients;
//   if(prevIngredients[ingredient]){
//       prevIngredients[ingredient].quantity++;
//   }
//   else {
//       prevIngredients[ingredient] =
//       {
//           "quantity": 1,
//           "unit": unit
//       }
//   }
//   const params = {
//       TableName: 'stocks',
//       Key:{id:0},
//       UpdateExpression: 'set ingredients = :ingred',
//       ExpressionAttributeValues: {
//         ':ingred': prevIngredients
//       }
//   };
//   await docClient.update(params).promise();
//   } catch (error) {
//       console.log(error);
//   }
// };

router.post('/login', async (req, res, next) => {
  try {
    let result = await docClient
      .get({
        TableName: 'users',
        // Key: {id: 0} <-------this needs to be altered
      })
      .promise()
    let prevIngredients = result.Item.ingredients
    if (prevIngredients[ingredient]) {
      prevIngredients[ingredient].quantity++
    } else {
      prevIngredients[ingredient] = {
        quantity: 1,
        unit: unit,
      }
    }
    const params = {
      TableName: 'stocks',
      Key: {id: 0},
      UpdateExpression: 'set ingredients = :ingred',
      ExpressionAttributeValues: {
        ':ingred': prevIngredients,
      },
    }
    await docClient.update(params).promise()
  } catch (error) {
    console.log(error)
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
        console.log('users::save::error - ' + JSON.stringify(err, null, 2))
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
