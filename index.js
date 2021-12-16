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

// A document in MongoDB is an object,
// but first we should have a model built based on  this schema
// To create a model with the schema, use a mongoose method `model()`.
const Course = mongoose.model('Course', courseSchema);

// CRUD: Create
async function createCourse() {
  const course = new Course({
    name: 'Computer Networks for Non-Techies',
    author: 'Alton Hardin',
    tags: ['network'],
    // date -- no need to set here, a default value is defined in the schema
    isPublished: true
  });

  const result = await course.save(); // save() returns a promise
  console.log(result);
}

createCourse(); // DON'T FORGET to call it.


// CRUD: Read - Querying Documents
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
  // The regular expressions are case sensitive. To be case-insensitive, add `i` at the end:
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
  const coursesFake2 = await Course.find({ price: { $gt: 10 } }); // price > 10 dollars
  const coursesFake3 = await Course.find({ price: { $gte: 15, $lte: 35 } }); // price >= 15 and <= 35 dollars
  const coursesFake4 = await Course.find({
    price: {
      $in: [10, 15, 20, 25, 30, 35]
    } }); // price at 10 dollars
};
// queryCourses();

// CRUD: Update the Document
// Method 1 - Query First and then Update
async function updateAfterRetrieving(id) {
  const course = await Course.findById(id); // a mongoose.query object is returned
  // course.name = 'Node with ReactJs Full Stack Course';
  // course.author = 'Grider, Stephen';
  course.set({
    name: 'Computer Networks for Non-Techies',
    author: 'Alton Hardin',
    tags: ['network', 'computer']
  });
  const result = await course.save(); // save() has validation
  console.log('The first updated course is ', course);
  console.log('The result is ', result);
};
updateAfterRetrieving('6179af0290cea71666e2b4dc');

// Method 2 - Update First and then Retrive Optionally
async function updateBeforeRetrieve(id1, id2) {
  // someModel.updateOne(filter, query, ...); -- update directly in DB but not returning the new object
  // $set, $inc, $mul, etc. <-- update operator
  const result1 = await Course.updateOne({ _id: id1 }, { $set: { author: 'Stephen Grider AGAIN' } });
  // const result1 = await coursee1.save(); -- no need to save with this method
  console.log('Result1 is ', result1);

  // How do you update and return the new document?
  // {new: true} - return the new document
  // In this method, the 1st argument is id, not a filter query, so don't use {_id: id}.
  const result2 = await Course.findByIdAndUpdate(id2, { $set: { 'tags.1': 'nodejs' } }, { new: true });
  console.log('Result2 is ', result2);
};
updateBeforeRetrieve('6179ae61818ef6fc0fa08cb0', '6179ae946d8c89c0d9b40817');

// CRUD: Remove Document
async function removeCourse(id1, id2) {
  const course1 = await Course.deleteOne({ _id: id1 }); // delete the first matched doc
  console.log('Remove course1: ', course1);
  const course2 = await Course.findByIdAndDelete(id2); // delete and return the deleted document
  console.log('Remove course2: ', course2);
};
removeCourse('6179ae61818ef6fc0fa08cb0', '6179ae946d8c89c0d9b40817');
