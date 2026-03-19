import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { CostsModule } from './costs/costs.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

   MongooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    uri: config.get<string>('MONGO_URI'),
  }),
}),
    UsersModule,
    AuthModule,
    CostsModule,
  ],
})
export class AppModule {}