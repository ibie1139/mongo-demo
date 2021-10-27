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

// Create
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


// Read - Querying Documents
async function getCourses() {
  // Course class has a method `find`, which returns a DocumentQuery object, similar to promise
  const courses = await Course.find();
  console.log(courses);

  const courses1 = await Course.find({ author: 'Mosh', isPulished: true });
  console.log(courses1);

  const courses2 = await Course.find({ author: 'Stephen Grider' });
  console.log(courses2);

  const courses3 = await Course.find({ tags: ['frontend'] });
  console.log(courses3); // returns an empty array: []

  const courses4 = await Course.find()
    .limit(4)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });
  console.log(courses4);

  // sort(): -1 - descending order | 1 - ascending order
  const courses5 = await Course.find({ author: /^Stephen/i })
    .sort({ name: -1 })
    .count();  // counting
  console.log(courses5);
}

getCourses(); // DON'T FORGET to call it.

// Comparison and Logical Query Operatiors
async function queryCourses() {
  const courses1 = await Course.find()
    .or([{ author: 'Mosh' }, { name: /.*React.*/ }]);
  console.log('courses1', courses1);
  // Note:
  // 1)Logical Operator: OR, AND
  // `Course.find().or([{}, {}, ...])`, `Course.find().and([{}, {}, ...])`
  // 2)Regular Expression in JS:
  // /^Mosh/ -start with 'Mosh'; /Mosh$/ -end with 'Mosh'; /.*Mosh.*/ -contain 'Mosh'
  // The regular expressions are case sensitive. To be insensitive, add `i` at the end:
  // /^Mosh/i, /Mosh$/i, /.*Msoh.*/i

  const courses2 = await Course.find()
    .and([{ author: /^Stephen/i }, { name: /.*Node*/ }]);
  console.log('courses2', courses2);

//   /*
//   Comparison Operators:
//   eq (equal to),
//   ne (not equal),
//   lt (less than),
//   lte (less than or equal to),
//   gt (greater than),
//   gte (greater than or equal to),
//   in,
//   nin (not in)
//   */
  const coursesFake1 = await Course.find({ price: 10 }); // price at 10 dollars
  const coursesFake1 = await Course.find({ price: { $gt: 10 } }); // price > 10 dollars
  const coursesFake1 = await Course.find({ price: { $gte: 15, $lte: 35 } }); // price >= 15 and <= 35 dollars
  const coursesFake1 = await Course.find({
    price: {
      $in: [10, 15, 20, 25, 30, 35]
    } }); // price at 10 dollars
};
queryCourses();