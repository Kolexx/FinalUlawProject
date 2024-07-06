import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import { sendEmail } from '../utils/nodemailer.js';
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '10h' });
};

export const signup = async (req, res) => {
  const { fullName, phoneNumber, email, password } = req.body;
  try {
    const user = await User.signup(fullName, phoneNumber, email, password);

    //create user token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    //create user token
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// export const confirmEmail = async (req, res, next) => {
//   try {
//     const { token } = req.params;
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     user.isConfirmed = true;
//     await user.save();
//     res.status(200).json({ message: 'Email confirmed successfully' });
//   } catch (error) {
//     next(error);
//   }
// };

// export const forgotPassword = async (req, res, next) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const token = jwt.sign(
//       { id: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' },
//     );

//     const url = `${process.env.BASE_URL}/api/auth/reset-password/${token}`;
//     await sendEmail(
//       user.email,
//       'Reset Password',
//       `<a href="${url}">Click here to reset your password</a>`,
//     );

//     user.resetToken = token;
//     user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
//     await user.save();

//     res.status(200).json({ message: 'Password reset email sent' });
//   } catch (error) {
//     next(error);
//   }
// };

// export const resetPassword = async (req, res, next) => {
//   const { token } = req.params;
//   const { password } = req.body;
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);
//     if (
//       !user ||
//       user.resetToken !== token ||
//       user.resetTokenExpiration < Date.now()
//     ) {
//       return res.status(400).json({ message: 'Invalid or expired token' });
//     }

//     user.password = bcryptjs.hashSync(password, 12);
//     user.resetToken = undefined;
//     user.resetTokenExpiration = undefined;
//     await user.save();

//     res.status(200).json({ message: 'Password reset successfully' });
//   } catch (error) {
//     next(error);
//   }
// };
