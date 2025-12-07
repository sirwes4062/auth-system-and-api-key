import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [AuthModule, ApiKeysModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        'auth/signup', 
        'auth/login',  
        'keys/create'   
      )
      .forRoutes('*');  
  }
}
