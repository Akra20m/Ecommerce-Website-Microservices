import express, { Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest } from './middlewares/validate-request';
import { User } from './models/user';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found';
import { BadRequestError } from './errors/bad-request';
import { Password } from './helper/password';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true
  })
);

app
  .route('/users/signup')
  .post(
    [
      body('email').isEmail().withMessage('Email is not valid'),
      body('password')
        .trim()
        .isLength({ min: 6, max: 16 })
        .withMessage('Password is not valid')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError('Email in use');
      }
      const newUser = User.build({ email, password });
      await newUser.save();
      const newJwt = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email
        },
        process.env.JWT_KEY!
      );
      req.session = {
        jwt: newJwt
      };
      res.status(201).send(newUser);
    }
  );

app
  .route('/users/signin')
  .post(
    [
      body('email').isEmail().withMessage('Email is not valid'),
      body('password')
        .trim()
        .notEmpty()
        .withMessage('Password must be supplied')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        throw new BadRequestError('Invalid login credentials');
      }
      const passwordResult = await Password.compare(user.password, password);
      if (!passwordResult) {
        throw new BadRequestError('Invalid login credentials');
      }
      const newJwt = jwt.sign(
        {
          id: user.id,
          email: user.email
        },
        process.env.JWT_KEY!
      );
      req.session = {
        jwt: newJwt
      };
      res.status(200).send(user);
    }
  );

app.route('/users/currentuser').get((req, res) => {
  if (!req.session?.jwt) {
    return res.send({ currentUser: null });
  }
  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    res.send({ currentUser: payload });
  } catch (err) {
    res.send({ currentUser: null });
  }
});

app.route('/users/signout').post((req, res) => {
  req.session = null;
  res.send({});
});

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const startUp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is not defined');
  }
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

startUp();
