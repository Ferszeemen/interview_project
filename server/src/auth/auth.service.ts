import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}


  async registration(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;


    const existingUser = await this.usersService.findOne(username);
    if (existingUser) {
      throw new BadRequestException('Der Benutzername ist bereits vergeben');
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.usersService.create({
      username,
      password: hashedPassword,
    });

    return newUser; 
  }


  async login(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException('Benutzername oder Passwort ist falsch');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Benutzername oder Passwort ist falsch');
    }

    const access_token = this.jwtService.sign({ username: user.username, sub: user._id }, { secret: process.env.JWT_SECRET, expiresIn: '1h'});
    const refresh_token = this.jwtService.sign(
      { userId: user._id },
      { secret: process.env.JWT_REFRESH_SECRET || 'defaultSecret', expiresIn: '30d' }
    );

    return { username: user.username, access_token, refresh_token };
  }

  async verifyTokens(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'defaultSecret',
      });

      return { valid: true, payload };
    } catch (err) {
      return { valid: false, error: err.message };
    }
  }

  async getUserByTokenData(token: string) {
  try {
    const payload: any = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'defaultSecret',
      });
    const user = await this.usersService.findOne(payload.username);
    if (!user) throw new UnauthorizedException('Benutzer nicht gefunden');
    return user;
  } catch (err) {
    throw new UnauthorizedException('Ungültiger Token');
  }
}
}


  


