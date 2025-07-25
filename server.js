// const express = require('express');
// require('dotenv').config();
// const mongoose = require('mongoose');
// const cors = require('cors');
// const passport = require('passport');
// const cookieParser = require('cookie-parser');

// // import your route modules
// const studentRoutes    = require('./src/routes/student.routes');
// const admintRoutes = require('./src/routes/admin.routes');
// const parentRoutes   = require('./src/routes/parent.routes');
// const teacherRoutes   = require('./src/routes/teachers.route');
// const complainRoute   = require('./src/routes/complaint.routes');

// // connect to database
// // const MONGODB_URI = 'mongodb://127.0.0.1:27017/atbu';
// const MONGODB_URI = 'mongodb+srv://abdulbasidhussain:nazeef123@cluster0.yflxqwa.mongodb.net/nazeetatbu?retryWrites=true&w=majority&appName=Cluster0';

// mongoose.connect(MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('✅ MongoDB connected'))
// .catch(err => console.error('❌ MongoDB connection error:', err));

// const app = express();

// // middleware
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));
// app.use(cors({
//   origin: ['http://localhost:3000', 'http://localhost:3001'],
//   credentials: true
// }));
// app.use(cookieParser());
// app.use(passport.initialize());

// // serve static assets (if any)
// app.use(express.static('public'));

// // view engine (if needed)
// app.set('view engine', 'ejs');

// // GridFS setup (optional)
// let gfs;
// mongoose.connection.once('open', () => {
//   gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//     bucketName: 'uploads'
//   });
// });

// // root route
// app.get('/', (req, res) => {
//   res.json({ message: 'Welcome to the API' });
// });

// // mount route handlers with base paths
// app.use('/students',    studentRoutes);
// app.use('/parents', parentRoutes);
// app.use('/teachers',   teacherRoutes);
// app.use('/complain',   complainRoute);
// // app.use('/departments', departmentRoutes);
// app.use('/admin',   admintRoutes);
// // app.use('/courses',     courseRoutes);

// // example for additional routes
// // app.use('/users', usersRoutes);
// // app.use('/auth',  authRoutes);
// // ...

// // start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

// module.exports = app;
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
// import your route modules
const studentRoutes    = require('./src/routes/student.routes');
const admintRoutes     = require('./src/routes/admin.routes');


// const MONGODB_URI = 'mongodb+srv://nazeef:nazeef123@cluster0.yflxqwa.mongodb.net/nazeetatbu?retryWrites=true&w=majority&appName=Cluster0';

const MONGODB_URI = 'mongodb+srv://nazeef:nazeef123@cluster0.yflxqwa.mongodb.net/assistant?retryWrites=true&w=majority&appName=Cluster0';
// const MONGODB_URI = 'mongodb://127.0.0.1:27017/hmris';
const app = express();

// middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: ['http://localhost:3000', 'https://a-iassistant-frontend-r1px.vercel.app'],
  credentials: true
}));
app.use(cookieParser());
app.use(passport.initialize());

// serve static assets
app.use(express.static('public'));
app.set('view engine', 'ejs');

// root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Connect to MongoDB THEN start the server
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');

  // GridFS setup (optional)
  let gfs;
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });

  // mount routes AFTER MongoDB connects
  app.use('/students',    studentRoutes);
  app.use('/admin',       admintRoutes);

  // Start the server after DB connects
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
