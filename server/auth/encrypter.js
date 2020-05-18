const crypto = require('crypto')

const generateSalt = function() {
  return crypto.randomBytes(16).toString('base64')
}

const encryptPassword = function(plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

const correctPassword = function(candidatePwd, user) {
  console.log('SALT >>>>>>>>>>>>', user)
  return encryptPassword(candidatePwd, user.salt) === user.password
}

const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = generateSalt()
    user.password = encryptPassword(user.password, user.salt)
  }
}

// User.beforeCreate(setSaltAndPassword)
// User.beforeUpdate(setSaltAndPassword)
// User.beforeBulkCreate(users => {
//   users.forEach(setSaltAndPassword)
// })
module.exports = {
  setSaltAndPassword,
  encryptPassword,
  generateSalt,
  correctPassword
}

// console.log('generate salt >>>>>>>>>>', generateSalt())
// console.log(
//   'encry pw>>>>>>>>>>>',
//   encryptPassword('123', 'Klj/15E4nYxktAg3pKtM7Q==')
// )
// console.log(
//   'result >>>>>>>>>',
//   correctPassword('123', 'Klj/15E4nYxktAg3pKtM7Q==')
// )
