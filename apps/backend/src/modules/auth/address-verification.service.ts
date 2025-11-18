import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { VerificationMethod, VerificationStatus } from '@neighborhood/shared';
import * as crypto from 'crypto';

interface VerificationRequest {
  userId: string;
  method: VerificationMethod;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  verificationCode?: string;
  documentUrl?: string;
}

@Injectable()
export class AddressVerificationService {
  private verificationCodes: Map<string, { code: string; expiresAt: Date }> = new Map();

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  // Generate verification code
  private generateVerificationCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Postcard verification method
  async initiatePostcardVerification(request: VerificationRequest) {
    const user = await this.usersRepository.findOne({ where: { id: request.userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const code = this.generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days to enter code

    this.verificationCodes.set(request.userId, { code, expiresAt });

    // In production: Send actual postcard through postal service API
    // For now, we'll simulate it
    console.log(`Postcard code for ${user.email}: ${code}`);

    // Store address temporarily
    user.address = request.address;
    user.verificationStatus = VerificationStatus.PENDING;
    await this.usersRepository.save(user);

    return {
      message: 'Verification postcard sent to your address',
      expectedDelivery: '7-10 business days',
    };
  }

  // Verify postcard code
  async verifyPostcardCode(userId: string, code: string) {
    const verification = this.verificationCodes.get(userId);

    if (!verification) {
      throw new BadRequestException('No verification code found');
    }

    if (new Date() > verification.expiresAt) {
      this.verificationCodes.delete(userId);
      throw new BadRequestException('Verification code expired');
    }

    if (verification.code !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    // Code is valid - mark user as verified
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.addressVerified = true;
    user.verificationStatus = VerificationStatus.VERIFIED;

    // Geocode address and set location
    const location = await this.geocodeAddress(user.address);
    if (location) {
      user.location = `POINT(${location.longitude} ${location.latitude})`;
    }

    await this.usersRepository.save(user);
    this.verificationCodes.delete(userId);

    return {
      message: 'Address verified successfully',
      verified: true,
    };
  }

  // Utility bill verification
  async verifyUtilityBill(request: VerificationRequest) {
    if (!request.documentUrl) {
      throw new BadRequestException('Document URL is required');
    }

    const user = await this.usersRepository.findOne({ where: { id: request.userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // In production: Use OCR/AI to extract address from document
    // For now, mark as pending manual review
    user.address = request.address;
    user.verificationStatus = VerificationStatus.PENDING;
    await this.usersRepository.save(user);

    return {
      message: 'Utility bill submitted for review',
      status: 'pending_review',
      reviewTime: '24-48 hours',
    };
  }

  // Property records verification
  async verifyPropertyRecords(request: VerificationRequest) {
    // In production: Integrate with property records API
    // (e.g., Zillow, county records, etc.)

    const user = await this.usersRepository.findOne({ where: { id: request.userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Simulated property lookup
    const propertyExists = await this.lookupProperty(request.address);

    if (!propertyExists) {
      throw new BadRequestException('Property not found in public records');
    }

    user.address = request.address;
    user.addressVerified = true;
    user.verificationStatus = VerificationStatus.VERIFIED;

    const location = await this.geocodeAddress(user.address);
    if (location) {
      user.location = `POINT(${location.longitude} ${location.latitude})`;
    }

    await this.usersRepository.save(user);

    return {
      message: 'Address verified via property records',
      verified: true,
    };
  }

  // Lease agreement verification
  async verifyLeaseAgreement(request: VerificationRequest) {
    if (!request.documentUrl) {
      throw new BadRequestException('Lease agreement document is required');
    }

    const user = await this.usersRepository.findOne({ where: { id: request.userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // In production: Use OCR to extract lease details
    user.address = request.address;
    user.verificationStatus = VerificationStatus.PENDING;
    await this.usersRepository.save(user);

    return {
      message: 'Lease agreement submitted for review',
      status: 'pending_review',
      reviewTime: '24-48 hours',
    };
  }

  // Geocode address to lat/lng
  private async geocodeAddress(address: any): Promise<{ latitude: number; longitude: number } | null> {
    // In production: Use Google Maps Geocoding API or similar
    // const googleMapsKey = this.configService.get('GOOGLE_MAPS_API_KEY');
    // const addressString = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
    // const response = await fetch(
    //   `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressString)}&key=${googleMapsKey}`
    // );
    // const data = await response.json();
    // if (data.results && data.results[0]) {
    //   return {
    //     latitude: data.results[0].geometry.location.lat,
    //     longitude: data.results[0].geometry.location.lng,
    //   };
    // }

    // For now, return null (would need actual geocoding in production)
    return null;
  }

  // Lookup property in public records
  private async lookupProperty(address: any): Promise<boolean> {
    // In production: Query property records API
    // For now, simulate success
    return true;
  }

  // Manual approval by admin
  async manuallyApproveAddress(userId: string, approved: boolean) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (approved) {
      user.addressVerified = true;
      user.verificationStatus = VerificationStatus.VERIFIED;

      const location = await this.geocodeAddress(user.address);
      if (location) {
        user.location = `POINT(${location.longitude} ${location.latitude})`;
      }
    } else {
      user.verificationStatus = VerificationStatus.REJECTED;
    }

    await this.usersRepository.save(user);

    return {
      message: approved ? 'Address verified' : 'Address verification rejected',
      verified: approved,
    };
  }

  // Get verification status
  async getVerificationStatus(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return {
      verified: user.addressVerified,
      status: user.verificationStatus,
      address: user.address,
    };
  }
}
