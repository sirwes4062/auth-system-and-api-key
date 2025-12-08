import { Controller, Post, Body } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';

@Controller('keys')
export class ApiKeysController {
  constructor(private readonly apiService: ApiKeysService) {}

  @Post('create')
  create(
    @Body('userId') userId: string,
    @Body('serviceName') serviceName: string,
  ) {
    return this.apiService.createKey(userId, serviceName);
  }

  @Post('revoke')
  revoke(@Body('key') key: string) {
    return this.apiService.revokeKey(key);
  }
}
