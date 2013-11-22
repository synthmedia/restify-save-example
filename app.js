var restify = require('restify')

  // Get a persistence engine for the user
  , userSave = require('save')('user')

  // Create the restify server
  , server = restify.createServer({ name: 'my-api' })

// Start the server listening on port 3000
server.listen(3000, function () {
  console.log('%s listening at %s', server.name, server.url)
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all users in the system
server.get('/user', function (req, res, next) {

  // Find every entity within the given collection
  userSave.find({}, function (error, users) {

    // Return all of the users in the system
    res.send(users)
  })
})

// Get a single user by their user id
server.get('/user/:id', function (req, res, next) {

  // Find a single user by their id within save
  userSave.findOne({ _id: req.params.id }, function (error, user) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    if (user) {
      // Send the user if no issues
      res.send(user)
    } else {
      // Send 404 header if the user doesn't exist
      res.send(404)
    }
  })
})

// Create a new user
server.post('/user', function (req, res, next) {

  // Make sure name is defined
  if (req.params.name === undefined) {

    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Name must be supplied'))
  }

  // Create the user using the persistence engine
  userSave.create({ name: req.params.name }, function (error, user) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the user if no issues
    res.send(201, user)
  })
})

// Update a user by their id
server.put('/user/:id', function (req, res, next) {

  // Make sure name is defined
  if (req.params.name === undefined) {

    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Name must be supplied'))
  }

  // Update the user with the persistence engine
  userSave.update({ _id: req.params.id, name: req.params.name }, function (error, user) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send(200)
  })
})

// Delete user with the given id
server.del('/user/:id', function (req, res, next) {

  // Delete the user with the persistence engine
  userSave.delete(req.params.id, function (error, user) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })
})
