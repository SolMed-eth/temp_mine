
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private async invalidatePostsCache() {
    try {
      await this.redis.del('posts:all');
    } catch (error) {
      console.warn('Could not invalidate posts cache');
    }
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async findAll() {
    const cacheKey = 'posts:all';

    // 1. Try Redis first
    try {
      const cachedPosts = await this.redis.get(cacheKey);

      if (cachedPosts !== null) {
        console.log('Cache hit: posts:all');
        return JSON.parse(cachedPosts);
      }
    } catch (error) {
      console.warn('Redis read failed; using PostgreSQL');
    }

    // 2. Cache miss: query PostgreSQL
    const posts = await this.prisma.post.findMany();

    // 3. Store posts in Redis for 60 seconds
    try {
      await this.redis.set(
        cacheKey,
        JSON.stringify(posts),
        60,
      );
      console.log('Cache updated: posts:all');
    } catch (error) {
      console.warn('Redis write failed');
    }

    return posts;
  }

  async create(userId: number, content: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = await this.prisma.post.create({
      data: {
        authorId: userId,
        content,
      },
    });

    await this.invalidatePostsCache();

    return post;
  }

  async update(postId: number, userId: number, content: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to update this post',
      );
    }

    const updatedPost = await this.prisma.post.update({
      where: { id: postId },
      data: { content },
    });

    await this.invalidatePostsCache();

    return updatedPost;
  }

  async remove(postId: number, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to delete this post',
      );
    }

    const deletedPost = await this.prisma.post.delete({
      where: { id: postId },
    });

    await this.invalidatePostsCache();

    return deletedPost;
  }
}
