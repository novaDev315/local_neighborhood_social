import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddressVerificationService } from './address-verification.service';
import { VerificationMethod } from '@neighborhood/shared';

@ApiTags('auth')
@Controller('auth/verification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressVerificationController {
  constructor(
    private readonly addressVerificationService: AddressVerificationService,
  ) {}

  @ApiOperation({ summary: 'Initiate postcard verification' })
  @Post('postcard')
  async initiatePostcardVerification(
    @Request() req,
    @Body()
    body: {
      address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };
    },
  ) {
    return this.addressVerificationService.initiatePostcardVerification({
      userId: req.user.userId,
      method: VerificationMethod.POSTCARD,
      address: body.address,
    });
  }

  @ApiOperation({ summary: 'Verify postcard code' })
  @Post('postcard/verify')
  async verifyPostcardCode(@Request() req, @Body() body: { code: string }) {
    return this.addressVerificationService.verifyPostcardCode(
      req.user.userId,
      body.code,
    );
  }

  @ApiOperation({ summary: 'Verify utility bill' })
  @Post('utility-bill')
  async verifyUtilityBill(
    @Request() req,
    @Body()
    body: {
      documentUrl: string;
      address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };
    },
  ) {
    return this.addressVerificationService.verifyUtilityBill({
      userId: req.user.userId,
      method: VerificationMethod.UTILITY_BILL,
      address: body.address,
      documentUrl: body.documentUrl,
    });
  }

  @ApiOperation({ summary: 'Verify property records' })
  @Post('property-records')
  async verifyPropertyRecords(
    @Request() req,
    @Body()
    body: {
      address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };
    },
  ) {
    return this.addressVerificationService.verifyPropertyRecords({
      userId: req.user.userId,
      method: VerificationMethod.PROPERTY_RECORDS,
      address: body.address,
    });
  }

  @ApiOperation({ summary: 'Verify lease agreement' })
  @Post('lease')
  async verifyLeaseAgreement(
    @Request() req,
    @Body()
    body: {
      documentUrl: string;
      address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };
    },
  ) {
    return this.addressVerificationService.verifyLeaseAgreement({
      userId: req.user.userId,
      method: VerificationMethod.LEASE_AGREEMENT,
      address: body.address,
      documentUrl: body.documentUrl,
    });
  }

  @ApiOperation({ summary: 'Get verification status' })
  @Get('status')
  async getVerificationStatus(@Request() req) {
    return this.addressVerificationService.getVerificationStatus(req.user.userId);
  }

  @ApiOperation({ summary: 'Manually approve address (admin only)' })
  @Patch(':userId/approve')
  async manuallyApproveAddress(
    @Param('userId') userId: string,
    @Body() body: { approved: boolean },
  ) {
    return this.addressVerificationService.manuallyApproveAddress(
      userId,
      body.approved,
    );
  }
}
