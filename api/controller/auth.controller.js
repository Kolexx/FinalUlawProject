import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

export const signup = async (req, res) => {
  const { fullName, phoneNumber, email, password } = req.body;
  const hashPassword = bcryptjs.hashSync(password, 12);
  const createUser = new User({
    fullName,
    phoneNumber,
    email,
    password: hashPassword,
  });
  try {
    await createUser.save();
    res.status(201).json({ Message: 'User created succesfully' });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
