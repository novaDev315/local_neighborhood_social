import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { NeighborhoodsModule } from './modules/neighborhoods/neighborhoods.module';
import { PostsModule } from './modules/posts/posts.module';
import { EventsModule } from './modules/events/events.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { GroupsModule } from './modules/groups/groups.module';
import { SafetyAlertsModule } from './modules/safety-alerts/safety-alerts.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'neighborhood_social'),
        entities: [__dirname + '/database/entities/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/**/*{.ts,.js}'],
        synchronize: configService.get('DB_SYNCHRONIZE', false),
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get('THROTTLE_TTL', 60) * 1000,
          limit: configService.get('THROTTLE_LIMIT', 100),
        },
      ],
      inject: [ConfigService],
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    NeighborhoodsModule,
    PostsModule,
    EventsModule,
    MarketplaceModule,
    BusinessesModule,
    GroupsModule,
    SafetyAlertsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
