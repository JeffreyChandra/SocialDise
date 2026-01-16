import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// 'jwt' adalah nama default yang digunakan di JwtStrategy
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}