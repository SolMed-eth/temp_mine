import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}
    async findAll(postId: number) {
    const post = await this.prisma.post.findUnique({
        where: {
        id: postId,
        },
    });

    if (!post) {
        throw new NotFoundException('Post not found');
    }

    return await this.prisma.comment.findMany({
        where: {
        postId,
        },
        orderBy: {
        createdAt: 'asc',
        },
    });
    }

    async update(
    commentId: number,
    userId: number,
    content: string,
    ) {
    const comment = await this.prisma.comment.findUnique({
        where: { id: commentId },
    });

    if (!comment) {
        throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
        throw new ForbiddenException(
        'You are not allowed to update this comment',
        );
    }

    return this.prisma.comment.update({
        where: { id: commentId },
        data: { content },
    });
    }

    async remove(commentId: number, userId: number) {
  const comment = await this.prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    throw new NotFoundException('Comment not found');
  }

  if (comment.authorId !== userId) {
    throw new ForbiddenException(
      'You are not allowed to delete this comment',
    );
  }

  await this.prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return {
    message: 'Comment deleted successfully',
  };
}

    async create(
    postId: number,
    userId: number,
    content: string,
    ) {
        const post = await this.prisma.post.findUnique({
            where: {
            id: postId,
            },
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        return await this.prisma.comment.create({
            data: {
            postId,
            authorId: userId,
            content,
            },
        });
    }
}