import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../../database/entities/group.entity';
import { GroupMember } from '../../database/entities/group-member.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    @InjectRepository(GroupMember)
    private membersRepository: Repository<GroupMember>,
  ) {}

  async findAll(neighborhoodId?: string) {
    const query = this.groupsRepository.createQueryBuilder('group');

    if (neighborhoodId) {
      query.where('group.neighborhoodId = :neighborhoodId', { neighborhoodId });
    }

    return query.getMany();
  }

  // TODO: Implement group creation and management
  // TODO: Implement member invitations
  // TODO: Implement group feeds
  // TODO: Implement group events
}
