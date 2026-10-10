import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

// findall method get all records 
// async is function (asynchronous operation) result dyalha katkon Promise


@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async update(id: number, body: UpdateUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return await this.prisma.user.update({
        where: {
          id: id,
        },
        data: body,
      });
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Email or username already exists',
        );
      }

      throw error;
    }
  }
  
  async deleteOne(id: number) {
    try
    {
      const users = await this.prisma.user.delete({
        where : {
          id: id,
        }
      });
      return users;
    }
    catch(error)
    {
      if(typeof error === 'object' && error != null && 'code' in error && error.code === 'P2025') {
        throw new NotFoundException('User not found')
      }
      throw error;
    }
  }
  async findOne(id : number) {
    const Oneuser = await this.prisma.user.findUnique({
      where : {
        id: id,
      },
    });
    if (!Oneuser) {
      throw new NotFoundException('User not found');
    }
    return Oneuser;
  }
  async findAll() {
    const users = await this.prisma.user.findMany();
    // for (let i = 0; i < users.length; i++) {
    //   console.log(users[i]);
    // }
  //   for (const user of users) {
  //   console.log(user);
  // }
    return users;
  }
  async create(email: string, username: string) {
    try 
    {
      return await this.prisma.user.create({
        data: {
          email,
          username,
        },
      });
    }
    catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email or username already exists');
      }

      throw error;
    }
  }
}