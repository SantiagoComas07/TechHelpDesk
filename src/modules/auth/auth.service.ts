import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserAccount } from '../users/entities/user-account.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserAccount)
    private userAccountRepository: Repository<UserAccount>,
    private jwtService: JwtService,
  ) {}

  async registerUser(registerDto: RegisterDto) {
    const { email, password, fullName, role } = registerDto;

    // Verificar si el email ya existe
    const existingUser = await this.userAccountRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('This email address is already registered');
    }

    // Validar longitud de contraseña
    if (password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }

    // Hash de la contraseña
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Crear nuevo usuario
    const newUser = this.userAccountRepository.create({
      fullName,
      email: email.toLowerCase(),
      passwordHash,
      role,
      isActive: true,
    });

    const savedUser = await this.userAccountRepository.save(newUser);

    // Generar token JWT
    const payload = {
      userId: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'User registered successfully',
      data: {
        user: {
          id: savedUser.id,
          fullName: savedUser.fullName,
          email: savedUser.email,
          role: savedUser.role,
          isActive: savedUser.isActive,
        },
        accessToken,
      },
    };
  }

  async loginUser(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Buscar usuario con password
    const user = await this.userAccountRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email: email.toLowerCase() })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('This account has been deactivated');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Actualizar último login
    await this.userAccountRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    // Generar token JWT
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
    };
  }

  async validateUserById(userId: string): Promise<UserAccount> {
    const user = await this.userAccountRepository.findOne({
      where: { id: userId, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }
}