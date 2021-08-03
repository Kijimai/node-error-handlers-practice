const express = require('express')
const app = express()
const morgan = require('morgan')
const AppError = require('./AppError')

app.use(morgan('tiny'))

app.use((req, res, next) => {
  req.requestTime = Date.now()
  console.log(req.method, req.path)
  next()
})

app.use('/dogs', (req, res, next) => {
  console.log("Welcome to the dog zone.")
  next()
})

const verifyPassword = (req, res, next) => {
  const { password } = req.query
  if(password === 'secretword') {
    next()
  }
  // res.status(401).send("Password is required. Please retry with correct password.")
  throw new AppError('Password is required. Please retry with correct password.', 401)
  // throw new Error('Password is required. Please retry with correct password.')
}

app.get('/', (req, res) => {
  res.send('home page wsup')
})

app.get('/error', (req, res) => {
  errorizer.nonexistent() //non-existent function intended to provide a real error
})

app.get('/secret', verifyPassword, (req, res) => {
  res.send('My Secret is: This is a page that is used for practice purposes only.')
})

app.get('/dogs', (req, res) => {
  res.send('Welcome to the DOG zone.')
})

app.get('/admin', (req, res) => {
  throw new AppError('You are not an admin.', 403)
  // const { entry } = req.query
  // console.dir(req.query)
  // console.log("Good job admin.") 
})

app.use((req, res) => {
  res.status(404).send("NOT FOUND!")
})

//custom error handler with defaulting 500 status code
app.use((err, req, res, next) => {
  const { status = 500, message = "An Error has occured."} = err
  res.status(status).send(message)
})

app.listen(3000, () => {
  console.log("App listening on port 3000.")
})