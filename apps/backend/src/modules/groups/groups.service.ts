import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../../database/entities/group.entity';
import { GroupMember } from '../../database/entities/group-member.entity';
import { ICreateGroupDto, IUpdateGroupDto, GroupPrivacy } from '@neighborhood/shared';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    @InjectRepository(GroupMember)
    private membersRepository: Repository<GroupMember>,
  ) {}

  async findAll(neighborhoodId?: string) {
    const query = this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.creator', 'creator')
      .where('group.privacy != :secret', { privacy: GroupPrivacy.SECRET })
      .orderBy('group.memberCount', 'DESC');

    if (neighborhoodId) {
      query.andWhere('group.neighborhoodId = :neighborhoodId', { neighborhoodId });
    }

    return query.getMany();
  }

  async findOne(id: string, userId?: string) {
    const group = await this.groupsRepository.findOne({
      where: { id },
      relations: ['creator', 'members', 'members.user'],
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    // Check if user has access to secret group
    if (group.privacy === GroupPrivacy.SECRET && userId) {
      const isMember = await this.isUserMember(id, userId);
      if (!isMember) {
        throw new ForbiddenException('You do not have access to this group');
      }
    }

    return group;
  }

  async create(createGroupDto: ICreateGroupDto, creatorId: string, neighborhoodId: string) {
    const group = this.groupsRepository.create({
      ...createGroupDto,
      creatorId,
      neighborhoodId,
      memberCount: 1,
      postCount: 0,
      settings: {
        requireApproval: createGroupDto.privacy === GroupPrivacy.PRIVATE,
        allowMemberPosts: true,
        allowMemberInvites: true,
        allowEvents: true,
        allowPolls: true,
        ...createGroupDto.settings,
      },
    });

    const savedGroup = await this.groupsRepository.save(group);

    // Add creator as admin member
    await this.addMember(savedGroup.id, creatorId, 'admin', creatorId);

    return this.findOne(savedGroup.id);
  }

  async update(id: string, updateGroupDto: IUpdateGroupDto, userId: string) {
    const group = await this.findOne(id);

    // Check if user is admin
    const member = await this.membersRepository.findOne({
      where: { groupId: id, userId },
    });

    if (!member || member.role !== 'admin') {
      throw new ForbiddenException('Only group admins can update the group');
    }

    Object.assign(group, updateGroupDto);
    return this.groupsRepository.save(group);
  }

  async remove(id: string, userId: string) {
    const group = await this.findOne(id);

    if (group.creatorId !== userId) {
      throw new ForbiddenException('Only the creator can delete the group');
    }

    await this.groupsRepository.remove(group);
  }

  async addMember(groupId: string, userId: string, role: 'admin' | 'moderator' | 'member' = 'member', invitedBy?: string) {
    const group = await this.findOne(groupId);

    // Check if user is already a member
    const existing = await this.membersRepository.findOne({
      where: { groupId, userId },
    });

    if (existing) {
      throw new BadRequestException('User is already a member of this group');
    }

    const member = this.membersRepository.create({
      groupId,
      userId,
      role,
      invitedBy,
    });

    await this.membersRepository.save(member);

    // Update member count
    group.memberCount++;
    await this.groupsRepository.save(group);

    return member;
  }

  async removeMember(groupId: string, userId: string, adminUserId: string) {
    const group = await this.findOne(groupId);

    // Check if admin
    const admin = await this.membersRepository.findOne({
      where: { groupId, userId: adminUserId },
    });

    if (!admin || admin.role !== 'admin') {
      throw new ForbiddenException('Only admins can remove members');
    }

    // Cannot remove creator
    if (userId === group.creatorId) {
      throw new ForbiddenException('Cannot remove the group creator');
    }

    const member = await this.membersRepository.findOne({
      where: { groupId, userId },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    await this.membersRepository.remove(member);

    // Update member count
    group.memberCount--;
    await this.groupsRepository.save(group);
  }

  async updateMemberRole(groupId: string, userId: string, newRole: 'admin' | 'moderator' | 'member', adminUserId: string) {
    // Check if admin
    const admin = await this.membersRepository.findOne({
      where: { groupId, userId: adminUserId },
    });

    if (!admin || admin.role !== 'admin') {
      throw new ForbiddenException('Only admins can change member roles');
    }

    const member = await this.membersRepository.findOne({
      where: { groupId, userId },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    member.role = newRole;
    return this.membersRepository.save(member);
  }

  async getMembers(groupId: string) {
    return this.membersRepository.find({
      where: { groupId },
      relations: ['user'],
      order: { joinedAt: 'ASC' },
    });
  }

  async getUserGroups(userId: string) {
    const members = await this.membersRepository.find({
      where: { userId },
      relations: ['group', 'group.creator'],
      order: { joinedAt: 'DESC' },
    });

    return members.map(m => m.group);
  }

  async isUserMember(groupId: string, userId: string): Promise<boolean> {
    const member = await this.membersRepository.findOne({
      where: { groupId, userId },
    });

    return !!member;
  }
}
