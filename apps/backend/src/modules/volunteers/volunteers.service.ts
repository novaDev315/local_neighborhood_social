import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VolunteerOpportunity, VolunteerSignup, VolunteerHours, OpportunityStatus, SignupStatus, VolunteerCategory } from '../../database/entities/volunteer.entity';

@Injectable()
export class VolunteersService {
  constructor(
    @InjectRepository(VolunteerOpportunity) private oppRepo: Repository<VolunteerOpportunity>,
    @InjectRepository(VolunteerSignup) private signupRepo: Repository<VolunteerSignup>,
    @InjectRepository(VolunteerHours) private hoursRepo: Repository<VolunteerHours>,
  ) {}

  async findOpportunities(category?: VolunteerCategory) {
    const query = this.oppRepo.createQueryBuilder('opp')
      .leftJoinAndSelect('opp.organizer', 'organizer')
      .where('opp.status = :status', { status: OpportunityStatus.OPEN })
      .andWhere('opp.startDate > :now', { now: new Date() })
      .orderBy('opp.startDate', 'ASC');
    if (category) query.andWhere('opp.category = :category', { category });
    return query.getMany();
  }

  async findOne(id: string) {
    return this.oppRepo.findOne({ where: { id }, relations: ['organizer'] });
  }

  async createOpportunity(data: Partial<VolunteerOpportunity>, organizerId: string) {
    const opp = this.oppRepo.create({ ...data, organizerId });
    return this.oppRepo.save(opp);
  }

  async updateOpportunity(id: string, data: Partial<VolunteerOpportunity>, userId: string) {
    const opp = await this.oppRepo.findOne({ where: { id, organizerId: userId } });
    if (!opp) return null;
    Object.assign(opp, data);
    return this.oppRepo.save(opp);
  }

  async signup(opportunityId: string, volunteerId: string) {
    const existing = await this.signupRepo.findOne({ where: { opportunityId, volunteerId } });
    if (existing) return existing;

    const signup = this.signupRepo.create({ opportunityId, volunteerId });
    await this.signupRepo.save(signup);
    await this.oppRepo.increment({ id: opportunityId }, 'volunteersSignedUp', 1);
    return signup;
  }

  async cancelSignup(opportunityId: string, volunteerId: string) {
    const signup = await this.signupRepo.findOne({ where: { opportunityId, volunteerId } });
    if (signup) {
      signup.status = SignupStatus.CANCELLED;
      await this.signupRepo.save(signup);
      await this.oppRepo.decrement({ id: opportunityId }, 'volunteersSignedUp', 1);
    }
  }

  async getSignups(opportunityId: string) {
    return this.signupRepo.find({ where: { opportunityId }, relations: ['volunteer'] });
  }

  async getMySignups(userId: string) {
    return this.signupRepo.find({ where: { volunteerId: userId }, relations: ['opportunity', 'opportunity.organizer'] });
  }

  async logHours(signupId: string, hours: number, userId: string) {
    const signup = await this.signupRepo.findOne({ where: { id: signupId }, relations: ['opportunity'] });
    if (!signup || signup.opportunity.organizerId !== userId) return null;

    signup.hoursLogged = hours;
    signup.status = SignupStatus.ATTENDED;
    await this.signupRepo.save(signup);

    // Update volunteer total hours
    let volunteerHours = await this.hoursRepo.findOne({ where: { userId: signup.volunteerId } });
    if (!volunteerHours) {
      volunteerHours = this.hoursRepo.create({ userId: signup.volunteerId });
    }
    volunteerHours.totalHours = Number(volunteerHours.totalHours) + hours;
    volunteerHours.opportunitiesCompleted += 1;

    // Update badge
    if (volunteerHours.totalHours >= 100) volunteerHours.currentBadge = 'Platinum';
    else if (volunteerHours.totalHours >= 50) volunteerHours.currentBadge = 'Gold';
    else if (volunteerHours.totalHours >= 25) volunteerHours.currentBadge = 'Silver';
    else if (volunteerHours.totalHours >= 10) volunteerHours.currentBadge = 'Bronze';

    await this.hoursRepo.save(volunteerHours);
    return signup;
  }

  async getVolunteerStats(userId: string) {
    return this.hoursRepo.findOne({ where: { userId } });
  }

  async getLeaderboard() {
    return this.hoursRepo.find({ relations: ['user'], order: { totalHours: 'DESC' }, take: 20 });
  }

  async deleteOpportunity(id: string, userId: string) {
    await this.oppRepo.update({ id, organizerId: userId }, { status: OpportunityStatus.CANCELLED });
  }
}
