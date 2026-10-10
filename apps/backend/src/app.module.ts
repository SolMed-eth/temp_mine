import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {HealthController} from './health/health.controller';
import {PrismaModule} from './prisma/prisma.module';
import {UsersModule} from './users/users.module';
import {PostsModule} from './posts/posts.module';
import {CommentsModule} from './comments/comments.module';
import {RedisModule} from './redis/redis.module';
import { FeedModule } from './feed/feed.module';

//Controller HTTP requests.
// for example @Controller('health') 
@Module({
  imports: [
    PrismaModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    RedisModule,
    FeedModule,
  ],
  controllers: [
    AppController,
    HealthController,
  ],
  providers: [AppService],
})

export class AppModule {}