import { JwtService } from '@nestjs/jwt';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshJWTGuard } from './guards/refresh-jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}


@Post('login')
async loginUser(@Body() dto: LoginUserDto, @Res() res: Response) {
  try {
    const tokens = await this.authService.login(dto.username, dto.password);
    return res.status(HttpStatus.OK).send(tokens);
  } catch (err) {
    throw err;
  }
}

@Post('registration')
async registrationUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
  const user = await this.authService.registration(createUserDto);
 res.status(HttpStatus.CREATED).send({ message: 'Benutzer erstellt', user });
}

@UseGuards(RefreshJWTGuard)
@Post('refresh')
async refreshToken(@Req() req, @Res() res: Response) {
  const user = req.user; 
  const access = { access_token: this.jwtService.sign({ username: user.username, sub: user._id }) };
  const refresh = { refresh_token: this.jwtService.sign({ userId: user._id }, { expiresIn: '30d' }) };

  res.status(HttpStatus.OK).send({ ...access, ...refresh });
}
}