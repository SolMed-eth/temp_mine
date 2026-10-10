import {
  Controller,
  ParseIntPipe,
  BadRequestException,
  Get,
  Param,
  Delete,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


// ParseIntPipe parse "66" to int if input not valid "abc" trow error


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number) {

    if (id > 2147483647) {
      throw new BadRequestException('User ID is too large');
    }

    return this.usersService.deleteOne(id);
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id:  number){
    return this.usersService.findOne(id);
  }
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body.email, body.username);
  }
}