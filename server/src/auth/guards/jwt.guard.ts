import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JWTGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();


    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authentifizierungsfehler');
    }


    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token fehlt');
    }

    try {

      const payload = this.authService.verifyTokens(token);

      
      request.user = (await payload).payload


      return true;
    } catch (err) {
      throw new UnauthorizedException('Ungültiges Token');
    }
  }
}