var SpoonacularApi = require('spoonacular_api')

var api = new SpoonacularApi.DefaultApi()
var q = 'salmon with fusilli and no nuts' // {String} The recipe search query.
var callback = function(error, data, response) {
  if (error) {
    console.error(error)
  } else {
    console.log('API called successfully. Returned data: ' + data)
  }
}
api.analyzeARecipeSearchQuery(q, callback)
