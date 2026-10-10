
import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

//@Global() katkhalli RedisService disponible f modules dyal application
// bla ma n3awdo nimportiw RedisModule f kol module. 
// Hna kanst3mloha 7it Redis client howa shared infrastructure.

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
