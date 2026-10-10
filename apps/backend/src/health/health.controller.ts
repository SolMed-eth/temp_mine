
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Controller('api/v1/health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  async getHealth() {
    let postgres: 'up' | 'down' = 'down';
    let redis: 'up' | 'down' = 'down';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      postgres = 'up';
    } catch {
      postgres = 'down';
    }

    try {
      await this.redis.ping();
      redis = 'up';
    } catch {
      redis = 'down';
    }

    return {
      status: postgres === 'up' ? 'ok' : 'degraded',
      dependencies: {
        postgres,
        redis,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
