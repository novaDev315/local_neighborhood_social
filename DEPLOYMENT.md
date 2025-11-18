# Deployment Guide

## Local Development with Docker

### Quick Start

1. **Start all services with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL with PostGIS on port 5432
   - Redis on port 6379
   - Backend API on port 3001 (optional)

2. **Check service status:**
   ```bash
   docker-compose ps
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f backend
   ```

4. **Stop all services:**
   ```bash
   docker-compose down
   ```

### Database Setup

After starting PostgreSQL with Docker:

```bash
# Run migrations
npm run migration:run

# Or manually connect and run SQL
docker exec -it neighborhood_postgres psql -U postgres -d neighborhood_social
```

## Production Deployment

### Infrastructure Requirements

#### Hosting Recommendations
- **Frontend:** Vercel, Netlify, or AWS Amplify
- **API:** AWS ECS Fargate, Google Cloud Run, or DigitalOcean App Platform
- **Database:** AWS RDS PostgreSQL with PostGIS
- **Cache:** AWS ElastiCache Redis or Redis Cloud
- **Storage:** AWS S3 + CloudFront CDN

### Environment Setup

1. **Database Configuration**
   ```bash
   # Set up PostgreSQL with PostGIS
   CREATE DATABASE neighborhood_social;
   \c neighborhood_social
   CREATE EXTENSION postgis;
   ```

2. **Environment Variables**

   Copy and configure production variables:
   ```bash
   cp apps/backend/.env.example apps/backend/.env.production
   ```

   Required production variables:
   - Strong `JWT_SECRET`
   - Production database credentials
   - Redis connection details
   - AWS S3 credentials (for file uploads)
   - SendGrid API key (for emails)
   - Twilio credentials (for SMS)
   - Google Maps or Mapbox API key

3. **Build Application**
   ```bash
   npm run build
   ```

### AWS Deployment Example

#### 1. Database (RDS PostgreSQL)
```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier neighborhood-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 15.3 \
  --master-username admin \
  --master-user-password <strong-password> \
  --allocated-storage 100

# Enable PostGIS extension
psql -h <rds-endpoint> -U admin -d neighborhood_social
CREATE EXTENSION postgis;
```

#### 2. Cache (ElastiCache Redis)
```bash
# Create Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id neighborhood-redis \
  --cache-node-type cache.t3.medium \
  --engine redis \
  --num-cache-nodes 1
```

#### 3. Backend (ECS Fargate)
```bash
# Build and push Docker image
docker build -t neighborhood-backend -f apps/backend/Dockerfile .
docker tag neighborhood-backend:latest <ecr-repo>:latest
docker push <ecr-repo>:latest

# Create ECS task definition and service
aws ecs create-service \
  --cluster neighborhood-cluster \
  --service-name backend \
  --task-definition neighborhood-backend \
  --desired-count 2 \
  --launch-type FARGATE
```

#### 4. Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/frontend
vercel --prod
```

### Security Checklist

- [ ] Enable HTTPS/TLS everywhere
- [ ] Set strong JWT secrets
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up AWS WAF rules
- [ ] Enable database encryption at rest
- [ ] Configure backup strategy
- [ ] Set up monitoring and alerts
- [ ] Enable audit logging
- [ ] Implement content moderation
- [ ] Configure firewall rules
- [ ] Set up DDoS protection

### Monitoring

#### Required Monitoring
- **APM:** Datadog, New Relic, or AWS X-Ray
- **Error Tracking:** Sentry
- **Logs:** CloudWatch Logs or Elasticsearch
- **Uptime:** Pingdom or UptimeRobot

#### Key Metrics to Track
- API response times
- Database query performance
- Cache hit rates
- Error rates
- User registration/login rates
- Active users (DAU/MAU)
- Geographic distribution

### Backup Strategy

1. **Database Backups**
   - Automated daily backups
   - Point-in-time recovery enabled
   - Retention: 30 days
   - Test restore monthly

2. **File Storage Backups**
   - S3 versioning enabled
   - Cross-region replication
   - Lifecycle policies

### Scaling Considerations

#### Horizontal Scaling
- Backend API: Auto-scaling ECS tasks
- Database: Read replicas for read-heavy operations
- Cache: Redis cluster mode

#### Vertical Scaling
- Start with:
  - API: 2 vCPU, 4GB RAM
  - DB: db.t3.medium
  - Redis: cache.t3.medium
- Scale up based on metrics

### CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and push
        run: |
          docker build -t backend .
          docker push $ECR_REPO
      - name: Deploy to ECS
        run: aws ecs update-service --cluster prod --service backend

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: vercel --prod
```

### Cost Estimates

#### Monthly Operating Costs (Estimated)

**Small Scale (5,000 users):**
- RDS db.t3.medium: $75
- ElastiCache: $50
- ECS Fargate (2 tasks): $90
- S3 + CloudFront: $20
- Vercel Pro: $20
- SendGrid: $15
- **Total: ~$270/month**

**Medium Scale (25,000 users):**
- RDS db.t3.large: $150
- ElastiCache cluster: $150
- ECS Fargate (4 tasks): $180
- S3 + CloudFront: $100
- Vercel Pro: $20
- SendGrid: $50
- **Total: ~$650/month**

### Maintenance

#### Regular Tasks
- Weekly: Review error logs and performance metrics
- Monthly: Security patches and updates
- Quarterly: Disaster recovery drills
- Annually: Security audit

### Support

For deployment issues, consult:
- AWS documentation
- NestJS deployment guides
- Next.js deployment documentation
- PostgreSQL PostGIS documentation
