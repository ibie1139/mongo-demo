const mongoose = require('mongoose');

// Note: mongoose.connect() returns a promise object.
mongoose.connect('mongodb://localhost/playground') // now hard-coded in demo
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.log('Could not connect to MongoDB...', err));

// create a new schema object to define the shape of the document
// using mongoose.Schema class
const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now }, // `date: Date` - without default value
  isPublished: Boolean
});

// A document in MongoDB is an object, but first we should have a class
// To create a class fitting the schema:
const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course = new Course({
    name: 'TypeScript Course',
    author: 'Stephen Grider',
    tags: ['typescript', 'frontend'],
    // date -- no need to set here, a default value is defined in the schema
    isPublished: true
  });

  const result = await course.save(); // save() returns a promise
  console.log(result);
}

createCourse(); // DON'T FORGET to call it.
