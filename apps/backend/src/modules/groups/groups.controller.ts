import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ICreateGroupDto, IUpdateGroupDto } from '@neighborhood/shared';

@ApiTags('groups')
@Controller('groups')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiOperation({ summary: 'Get all groups' })
  @Get()
  findAll(@Query('neighborhoodId') neighborhoodId?: string) {
    return this.groupsService.findAll(neighborhoodId);
  }

  @ApiOperation({ summary: 'Get user groups' })
  @Get('user/my-groups')
  getUserGroups(@Request() req) {
    return this.groupsService.getUserGroups(req.user.userId);
  }

  @ApiOperation({ summary: 'Get group by ID' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.groupsService.findOne(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Get group members' })
  @Get(':id/members')
  getMembers(@Param('id') groupId: string) {
    return this.groupsService.getMembers(groupId);
  }

  @ApiOperation({ summary: 'Create group' })
  @Post()
  create(@Body() createGroupDto: ICreateGroupDto, @Request() req) {
    return this.groupsService.create(createGroupDto, req.user.userId, req.user.neighborhoodId);
  }

  @ApiOperation({ summary: 'Update group' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGroupDto: IUpdateGroupDto,
    @Request() req,
  ) {
    return this.groupsService.update(id, updateGroupDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Delete group' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.groupsService.remove(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Add member to group' })
  @Post(':id/members')
  addMember(
    @Param('id') groupId: string,
    @Body() body: { userId: string; role?: 'admin' | 'moderator' | 'member' },
    @Request() req,
  ) {
    return this.groupsService.addMember(groupId, body.userId, body.role, req.user.userId);
  }

  @ApiOperation({ summary: 'Remove member from group' })
  @Delete(':id/members/:userId')
  removeMember(
    @Param('id') groupId: string,
    @Param('userId') userId: string,
    @Request() req,
  ) {
    return this.groupsService.removeMember(groupId, userId, req.user.userId);
  }

  @ApiOperation({ summary: 'Update member role' })
  @Patch(':id/members/:userId/role')
  updateMemberRole(
    @Param('id') groupId: string,
    @Param('userId') userId: string,
    @Body() body: { role: 'admin' | 'moderator' | 'member' },
    @Request() req,
  ) {
    return this.groupsService.updateMemberRole(groupId, userId, body.role, req.user.userId);
  }

  @ApiOperation({ summary: 'Check if user is member' })
  @Get(':id/is-member')
  async isUserMember(@Param('id') groupId: string, @Request() req) {
    const isMember = await this.groupsService.isUserMember(groupId, req.user.userId);
    return { isMember };
  }
}
