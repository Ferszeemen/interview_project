import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    UsersModule,
    JwtModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}