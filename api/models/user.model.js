import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    // resetToken: String,
    // resetTokenExpiration: Date,
  },
  { timestamps: true },
);

// static signup method
userSchema.statics.signup = async function (
  fullName,
  phoneNumber,
  email,
  password,
) {
  //validation
  if (!email || !password || !fullName) {
    throw new Error('Please provide email ,password and fullName');
  }
  if (!validator.isEmail(email)) {
    throw new Error('Please provide valid email');
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      'Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one symbol',
    );
  }
  const exists = await this.findOne({ email });
  if (exists) {
    throw Error('Email already in use');
  }

  const salt = await bcryptjs.genSalt(10);

  const hash = await bcryptjs.hashSync(password, salt);

  const user = await this.create({
    fullName,
    phoneNumber,
    email,
    password: hash,
  });

  return user;
};

// static Logining method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw new Error('Please provide email and password');
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw new Error('Email does not exist');
  }

  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Password is incorrect');
  }
  return user;
};

// userSchema.statics.forgetPassword = async function (email) {
//   const user = await this.findOne({ email });
//   console.log(email);
//   if (!user) {
//     throw new Error('User Not Registered');
//   }
//   return user;
// };

const User = mongoose.model('User', userSchema);
export default User;
