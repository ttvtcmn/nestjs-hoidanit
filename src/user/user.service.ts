/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { UserModule } from './user.module';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.getHashPassword(createUserDto.password);
    const user = await this.userModel.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashPassword,
    });
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Không tìm thấy user';
    return await this.userModel.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Không tìm thấy user';
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Không tìm thấy user';
    return await this.userModel.deleteOne({ _id: id });
  }
}
