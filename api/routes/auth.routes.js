import express from 'express';
import {
  signup,
  login,
  // confirmEmail,
  // forgotPassword,
  // resetPassword,
} from '../controller/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
// router.post('/forgot-password', forgotPassword);

export default router;
