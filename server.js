require('dotenv').config()
const express = require('express')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const { errorHandler } = require('./middleware/errorHandler')
const port = process.env.PORT || 5000

const app = express()
app.use(cors(corsOptions))
app.use(express.json())

app.get('/', (req, res) =>
  res.redirect('https://documenter.getpostman.com/view/11175978/2s7YmtCQft')
)
app.use('/users', require('./routes/userRoutes'))
app.use('/posts', require('./routes/postRoutes'))
app.use('/', require('./routes/authRoutes'))

app.all('*', (req, res) => {
  res.status(404).json({ message: 'No matching route exists' })
})

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))
