import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { ICreateUserDto, IUpdateUserDto } from '@neighborhood/shared';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: ICreateUserDto & { password: string }): Promise<User> {
    const user = this.usersRepository.create({
      ...createUserDto,
      privacySettings: {
        showExactAddress: false,
        showPhone: false,
        showEmail: false,
        allowMessages: true,
        allowGroupInvites: true,
        visibleToNeighborsOnly: true,
      },
    });
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['neighborhood'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['neighborhood'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['neighborhood'],
    });
  }

  async update(id: string, updateUserDto: IUpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async updateLastActive(id: string): Promise<void> {
    await this.usersRepository.update(id, { lastActiveAt: new Date() });
  }
}
