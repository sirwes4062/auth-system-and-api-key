import { Controller, Get, Req } from '@nestjs/common';
import type { AuthRequest } from '../types/auth-request';

@Controller('test')
export class TestController {
  @Get('protected')
  getProtected(@Req() req: AuthRequest) {
    return {
      message: 'You accessed a protected endpoint!',
      authType: req.authType,
      userOrService: req.user ?? req.service ?? null,
    };
  }
}
