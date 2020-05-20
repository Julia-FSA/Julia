const db = require('./db')

// const getFullRecipe = async (recArr) => {
//   try {
//     const keyArr = recArr.map((rec) => ({id: rec}))
//     let params = {
//       RequestItems: {
//         recipes: {
//           Keys: keyArr,
//         },
//       },
//     }
//     const data = await db.batchGet(params).promise()
//     return data.Responses.recipes
//   } catch (error) {
//     console.error(error)
//   }
// }

// const getRecipeUser = async (userID) => {
//   try {
//     const params = {
//       TableName: 'users',
//       Key: {id: userID},
//     }
//     let data = await db.get(params).promise()
//     getFullRecipe(data.Item.saved_recipe_ids)
//   } catch (error) {
//     console.error(error)
//   }
// }

const registeredEmail = async (email) => {
  const params = {
    TableName: 'users',
    FilterExpression: '#email = :email',
    ExpressionAttributeNames: {'#email': 'email'},
    ExpressionAttributeValues: {':email': email},
  }

  let user = await docClient
    .scan(params, function (err, data) {
      if (err) {
        console.log('users::error - ' + JSON.stringify(err, null, 2))
      } else {
        console.log('users::success - ' + JSON.stringify(data, null, 2))
      }
    })
    .promise()
}

const getUser = async (userId) => {
  try {
    const params = {
      TableName: 'users',
      Key: {
        id: userId,
      },
    }
    let data = await db.get(params).promise()
    return data.Item
  } catch (error) {
    console.error(error)
  }
}
// console.log('>>>>>>>>',
// getUser('1')

module.exports = {getUser, registeredEmail}
// let fetchOneByKey = function(tableName, stockId) {

//   var params = {
//     TableName: tableName,
//     Key: {

//       id: stockId
//     }

//   }
//   db.get(params, function (err, data) {
//     if (err) {
//       console.log(
//         'users::fetchOneByKey::error - ' + JSON.stringify(err, null, 2)
//       )
//     } else {
//       console.log(
//         'users::fetchOneByKey::success - ' + JSON.stringify(data, null, 2)
//       )
//       console.log(data.Item.ingredients)
//     }
//   })
// }

// fetchOneByKey('stocks', 2)
