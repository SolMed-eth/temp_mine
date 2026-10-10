
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class FeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findFeed(userId: number, page = 1, limit = 10) {
    const cacheKey = `feed:${userId}:page:${page}:limit:${limit}`;
    const skip = (page - 1) * limit;

    // 1. Try Redis first
    try {
      const cached = await this.redis.get(cacheKey);

      if (cached !== null) {
        console.log(`Feed cache hit: ${cacheKey}`);
        return JSON.parse(cached);
      }
    } catch {
      console.warn('Redis unavailable; fetching feed from PostgreSQL');
    }

    // 2. Fetch from PostgreSQL
    const follows = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = follows.map((follow) => follow.followingId);

    const posts = await this.prisma.post.findMany({
      where: { authorId: { in: followingIds } },
      include: {
        author: {
          select: { id: true, username: true },
        },
        comments: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const result = {
      data: posts,
      pagination: {
        page,
        limit,
        count: posts.length,
      },
    };

    // 3. Cache result for 60 seconds
    try {
      await this.redis.set(cacheKey, JSON.stringify(result), 60);
    } catch {
      console.warn('Could not cache feed; PostgreSQL result will be returned');
    }

    return result;
  }
}
