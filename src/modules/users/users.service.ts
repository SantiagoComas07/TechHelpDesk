import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserAccount } from './entities/user-account.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserAccount> {
    const existingUser = await this.userAccountRepository.findOne({
      where: { email: createUserDto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);

    const user = this.userAccountRepository.create({
      fullName: createUserDto.fullName,
      email: createUserDto.email.toLowerCase(),
      passwordHash,
      role: createUserDto.role,
      isActive: true,
    });

    return this.userAccountRepository.save(user);
  }

  async findAll(): Promise<UserAccount[]> {
    return this.userAccountRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<UserAccount> {
    const user = await this.userAccountRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserAccount> {
    const user = await this.userAccountRepository.findOne({
      where: { email: email.toLowerCase() },
      select: ['id', 'email', 'passwordHash', 'role', 'fullName', 'isActive'],
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserAccount> {
    await this.findOne(id);
    
    const updateData: any = { ...updateUserDto };
    
    if (updateUserDto.password) {
      const saltRounds = 12;
      updateData.passwordHash = await bcrypt.hash(updateUserDto.password, saltRounds);
      delete updateData.password;
    }

    if (updateUserDto.email) {
      const existingUser = await this.userAccountRepository.findOne({
        where: { email: updateUserDto.email.toLowerCase() },
      });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already exists');
      }
      updateData.email = updateUserDto.email.toLowerCase();
    }

    await this.userAccountRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userAccountRepository.remove(user);
  }

  async validatePassword(user: UserAccount, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }
}
