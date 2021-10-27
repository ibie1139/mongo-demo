
/*
The following are the solution from exercises in this section, Section 7.
*/

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-exercises')
  .then(() => console.log('Database is connected...'))
  .catch(err => console.log('Error is: ' + err.message));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  price: Number,
  isPublished: Boolean
});

// compile the schema to create the corresponding class
const Course = mongoose.model('Course', courseSchema);

// no need to create data - they are imported already
async function getCourses1() {
  // use Course class, not the object
  return await Course
    .find({ isPublished: true, tags: 'backend' })
    .sort({ name: 1 })
    .select({ name: 1, author: 1 });
}

async function run1() {
  const results = await getCourses1();
  console.log(results);
}

run1();

// The following two ways do the same thing but with different syntax
async function getCourses2() {
  return await Course
    // .find({ isPublished: true, tags: ['frontend', 'backend'] }) -- wrong: return frontend and backend at the same time
    .find({ isPublished: true, tags: { $in: ['frontend', 'backend'] } })
    .sort('-price')
    .select('name author price');
}

async function run2() {
  const courses = await getCourses2();
  console.log(courses);
}
run2();

async function getCourses3() {
  return await Course
    .find({ isPublished: true })
    .or([{ tags: 'frontend' }, { tags: 'backend' }])
    .sort('-price')
    .select('name author price');
}

async function run3() {
  const courses = await getCourses3();
  console.log(courses);
}
run3();

async function getCourses4() {
  return await Course
    .find({ isPublished: true })
    .or([{ price: { $gte: 15 } }, { name: /.*by.*/i }])
    .sort('-price')
    .select('name author price');
}

async function run4() {
  const courses = await getCourses4();
  console.log(courses);
}
run4();
