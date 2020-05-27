import { Schema, model, Model, Document } from 'mongoose';
import { Password } from '../helper/password';

interface Attrs {
  email: string;
  password: string;
}

interface UserModel extends Model<UserDoc> {
  build(attrs: Attrs): UserDoc;
}
interface UserDoc extends Document {
  email: string;
  password: string;
}
const userScheme = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
);

userScheme.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.Hash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userScheme.statics.build = (attrs: Attrs) => {
  return new User(attrs);
};
const User = model<UserDoc, UserModel>('User', userScheme);

export { User };
