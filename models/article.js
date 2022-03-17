const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify') // makes clean url's using a slug rather than the object id
const createDomPurify = require('dompurify') // allows to convert MD to html
const { JSDOM } = require('jsdom') // library for parsing and interacting with the html
const dompurify = createDomPurify(new JSDOM().window) // creating a dom purified window 

const articleSchema = new mongoose.Schema({ // making a Schema for the articles
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  markdown: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  }
})

articleSchema.pre('validate', function(next) { // validates schema before moving on 
  if (this.title) { // if this title is true.
    this.slug = slugify(this.title, { lower: true, strict: true }) // saves the title as a slug in the url
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown)) // changes the content from MD to html
  }

  next() // once thats complete, move to the next function.
})

module.exports = mongoose.model('Article', articleSchema) // exports the schema as an object "Article".
// export statement is used to create javascript models for export