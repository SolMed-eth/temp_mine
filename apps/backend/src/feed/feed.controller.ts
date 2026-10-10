
import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  findFeed(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const currentPage = Math.max(1, Number(page));
    const pageSize = Math.min(50, Math.max(1, Number(limit)));

    return this.feedService.findFeed(1, currentPage, pageSize);
  }
}
