const isAdminMiddleware = (req, res, next) => {
  const currentUser = req.user
  console.log('isAdmin middleware req.user>>>>>>>>>>>', req.user)
  if (currentUser && currentUser.isAdmin) {
    next()
  } else {
    const error = new Error('Access denied')
    error.status = 401
    next(error)
  }
}

const isVerifiedUserMiddleware = (req, res, next) => {
  const currentUser = req.user
  console.log('isVerifiedUser middleware req.user>>>>>>>>>>>', req.user)
  console.log(
    'isVerifiedUser middleware req.session.passport.user>>>>>>>>>>>',
    req.session.passport.user
  )

  if (currentUser && req.session.passport.user === +req.params.userId) {
    next()
  } else {
    const error = new Error('Access denied')
    error.status = 401
    console.error(error)
  }
}

module.exports = {isAdminMiddleware, isVerifiedUserMiddleware}
