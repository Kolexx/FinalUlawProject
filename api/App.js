import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log('Running on port 3000!');
});

app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);

//middleware
// app.use((err, req, res, next) => {
//   const statuscode = err.statuscode || 500;
//   const message = err.message || 'Internal server error';
//   return res.status(
//     statuscode.json({
//       success: false,
//       message,
//       statuscode,
//     }),
//   );
// });
