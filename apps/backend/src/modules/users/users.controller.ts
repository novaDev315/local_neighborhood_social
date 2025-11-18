import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IUpdateUserDto } from '@neighborhood/shared';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get current user profile' })
  @Get('me')
  async getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @ApiOperation({ summary: 'Update current user profile' })
  @Patch('me')
  async updateProfile(@Request() req, @Body() updateUserDto: IUpdateUserDto) {
    return this.usersService.update(req.user.userId, updateUserDto);
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Get all users (admin only)' })
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }
}
