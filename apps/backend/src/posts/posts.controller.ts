import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';

import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
  ) {}
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (id > 2147483647) {
      throw new BadRequestException('Post ID is too large');
    }

    const userId = 1; // temporary test only

    return this.postsService.remove(
      id,
      userId,
    );
  }
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
  ) {
    if (id > 2147483647) {
      throw new BadRequestException('Post ID is too large');
    }

    const userId = 1; // temporary test only

    return this.postsService.update(
      id,
      userId,
      body.content,
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (id > 2147483647) {
      throw new BadRequestException('Post ID is too large');
    }

    return this.postsService.findOne(id);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Post()
  create(@Body() body: CreatePostDto) {
    // Authentication mazal ma tbuildatch.
    // currentUser.id ghadi yji mn Auth.
    
    throw new Error('Authentication is required to create a post');
  }
}