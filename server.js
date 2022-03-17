const express = require('express')
// const session = require('express-session')
// const exphbs = require('express-handlebars')
// const passport = require('passport')
// const localStrategy = require('passport-local').Strategy
// const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()


mongoose.connect('mongodb://localhost:27017/NodeBlog', { // connecting to database 
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs') // telling session to use EJS in views folder.
app.use(express.urlencoded({ extended: false })) // JSON middleware 
app.use(methodOverride('_method'))  // Allowing over-riding methods 
// app.engine('hbs', hbs({extname: '.hbs'}))
// app.set('viewengine')

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' }) // finding all the articles and sorting them based on time they're created.
  res.render('articles/index', { articles: articles }) // rendering articles from index.ejs
})

app.use('/articles', articleRouter) // bringing in article router.

app.listen(3001)