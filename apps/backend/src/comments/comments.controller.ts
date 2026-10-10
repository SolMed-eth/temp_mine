import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
// import { UserScalarFieldEnum } from 'src/generated/prisma/internal/prismaNamespace';

@Controller()
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
  ) {}


  @Post('posts/:postId/comments')
  create(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: CreateCommentDto,
  ) {
    const userId = 1; // temporary test only

    return this.commentsService.create(
      postId,
      userId,
      body.content,
    );
  }

    @Get('posts/:postId/comments')
    findAll(
    @Param('postId', ParseIntPipe) postId: number,
    ) {
    return this.commentsService.findAll(postId);
    }

    @Patch('comments/:id')
    update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCommentDto,
    ) {
    const userId = 1; // temporary test only

    return this.commentsService.update(
        id,
        userId,
        body.content,
    );
    }

    @Delete('comments/:id')
    remove(
    @Param('id', ParseIntPipe) id: number,
    ) {
    const userId = 1; // temporary test only

    return this.commentsService.remove(id, userId);
    }
}