const db = require('../server/db')

const recipeToAlexa = async (user, recipe) => {
  try {
    const params = {
      TableName: 'users',
      Key: {id: user.id},
      UpdateExpression: 'set selectedRecipe = :recipe',
      ExpressionAttributeValues: {
        ':recipe': recipe
      }
    }
    await db.update(params).promise()
    console.log(
      '************* successfully saved the selected recipes in the DB'
    )
  } catch (err) {
    console.error(err)
  }
}

const recipeFormatter = recipe => {
  let rec
  if (recipe !== undefined) {
    rec = {
      id: recipe.id,
      ingredients: [],
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      steps: [],
      title: recipe.title,
      vegan: recipe.vegan,
      vegetarian: recipe.vegetarian,
      likes: recipe.aggregateLikes
    }
    recipe.analyzedInstructions[0].steps.forEach(step => {
      let res = step.step.replace(/\.(?=[^\s])/g, '. ')
      rec.steps.push(`Step ${step.number}: ${res} `)
    })
    recipe.extendedIngredients.forEach(ingr => {
      let ingrObj = {
        id: ingr.id,
        name: ingr.name,
        amount: ingr.measures.us.amount,
        unit: ingr.measures.us.unitLong,
        img: ingr.image
      }
      rec.ingredients.push(ingrObj)
    })
    return rec
  }
  return rec
}

module.exports = {recipeToAlexa, recipeFormatter}
