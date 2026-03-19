import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UsersDocument } from 'src/schemas/users.schema';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<UsersDocument>,
  ) {}

  async findOne(username: string): Promise<User | null> {
    return this.usersModel.findOne({ username }).exec();
  }

  async create(data: { username: string; password: string }): Promise<User> {
    const newUser = new this.usersModel(data);
    return newUser.save();
  }


}
