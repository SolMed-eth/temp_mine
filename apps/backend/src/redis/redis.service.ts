
import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: Redis;

  // Kaywjed Redis client and ?? if var don;t exit khdam b defualt value 
  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST ?? '127.0.0.1',
      port: Number(process.env.REDIS_PORT ?? 6379),
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => Math.min(times * 200, 2000),
    });

    this.client.on('error', () => {
      console.warn('Redis connection error; PostgreSQL remains available');
    });
  }
  // lazyConnect why true : bach connection matbdach hta i3ayt nestjs 3la  onModuleInit()
  // haka n9adro n3arfo fin katw9e3 connection f lifecycle dyal application.

  // Kayconnecta mlli NestJS kaybda
  async onModuleInit() {
    try {
      await this.client.connect();
      console.log('Redis connected successfully');
    } catch {
      console.warn('Redis unavailable at startup; using PostgreSQL fallback');
    }
  }
  get isAvailable(): boolean {
    return this.client.status === 'ready';
  }
  // Kayseft command bach ysedd connection b nizam
  async onModuleDestroy() {
    if (this.client.status === 'ready') {
      await this.client.quit();
    } else {
      this.client.disconnect();
    }
  }

  // Kayjib value mn cache
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  // Kaykhzen value m3a TTL
  // TTL hita Time To Live ch7aal dyal lwa9t radi tb9a had data, hitach possible user izid object akhor ou aykhasna darori ndiro update l dak chi li m cache 

  async set(key: string, value: string, ttlSeconds: number) {
    return this.client.set(key, value, 'EX', ttlSeconds);
  }

  // Kay7iyed key
  async del(key: string) {
    return this.client.del(key);
  }

  // check ping 
  async ping(): Promise<string> {
    return this.client.ping();
  }
}
