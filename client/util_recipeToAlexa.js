const db = require('../server/db')

const recipeToAlexa = async (user, recipe) => {
  try {
    const params = {
      TableName: 'users',
      Key: {id: user.id},
      UpdateExpression: 'set selectedRecipe = :recipe',
      ExpressionAttributeValues: {
        ':recipe': recipe,
      },
    }
    await db.update(params).promise()
    console.log(
      '************* successfully saved the selected recipes in the DB'
    )
  } catch (err) {
    console.error(err)
  }
}

module.exports = recipeToAlexa
