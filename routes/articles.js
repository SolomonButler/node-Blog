const express = require('express')
const Article = require('./../models/article')
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() }) // Renders a new Schema to the new.ejs file
}) 

router.get('/edit/:id', async (req, res) => { // Run this router on the selected article id
  const article = await Article.findById(req.params.id) // finds the article by id
  res.render('articles/edit', { article: article }) // renders the article objects that is the Schema to the edit.ejs file
})

router.get('/:slug', async (req, res) => { // a get route on the Slug, which is the article title.
  const article = await Article.findOne({ slug: req.params.slug }) // finds article by the slug/title
  if (article == null) res.redirect('/') // if there is no article, send em back 
  res.render('articles/show', { article: article }) // renders the article(article schema) to the shoe.ejs file.
})

router.post('/', async (req, res, next) => { // posting to the home page(index.ejs).
  req.article = new Article() // creates a new article.
  next() // saves it and moves to the next function.
}, saveArticleAndRedirect('new')) 

router.put('/:id', async (req, res, next) => { // updating the article by its id
  req.article = await Article.findById(req.params.id) // once the selected article is found, move on.
  next() // saves it and moves to the next function.
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => { // deletes article by id
  await Article.findByIdAndDelete(req.params.id) // find article by id and delete it
  res.redirect('/') // once the above is complete, return home.
})

function saveArticleAndRedirect(path) { // this creates the content for the article.
  return async (req, res) => { // returns a promise responsible for building the content from the form fields 
    let article = req.article // getting the values from the form
    article.title = req.body.title //
    article.description = req.body.description //
    article.markdown = req.body.markdown //
    try { // tries to save the article then redirect.
      article = await article.save() 
      res.redirect(`/articles/${article.slug}`)
    } catch (e) { // if the above fails, render the ejs file that is passed through the argument.
      res.render(`articles/${path}`, { article: article }) // renders the EJS with the article object
    }
  }
}

module.exports = router // uses express.router.