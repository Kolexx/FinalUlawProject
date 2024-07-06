import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import validator from 'validator';

dotenv.config();

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

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: 'User Not Registered' });
    }

    const token = createToken(user._id);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Password for your account',
      text: `${process.env.BASE_URL}/api/auth/resetPassword/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email' });
      } else {
        console.log('Email sent:', info.response);
        return res.json({ status: true, message: 'Email sent successfully' });
      }
    });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  console.log(token, password);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded;

    if (!validator.isStrongPassword(password)) {
      return res.status(400).send({
        message:
          'Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one symbol',
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = bcryptjs.hashSync(password, salt);

    console.log(id);
    await User.findByIdAndUpdate(id, { password: hashPassword });

    return res.json({ status: true, message: 'Password reset successfully' });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: 'Invalid or expired token' });
  }
};
