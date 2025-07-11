# 🐳 AI Mock Interview - Docker Volume Management Guide

## 📋 Overview

This guide provides comprehensive documentation for managing Docker volumes in the AI Mock Interview application. Our volume setup ensures data persistence, performance optimization, and production-ready deployment.

## 🏗️ Volume Architecture

### Production Volumes

| Volume | Purpose | Mount Point | Backup |
|--------|---------|-------------|--------|
| `app_data` | Application data storage | `/app/data` | ✅ |
| `app_uploads` | User uploaded files | `/app/public/uploads` | ✅ |
| `app_logs` | Application logs | `/app/logs` | ✅ |
| `next_cache` | Next.js build cache | `/app/.next` | ❌ |
| `db_backups` | Database backups | `/app/backups` | ✅ |
| `ssl_certs` | SSL certificates | `/app/ssl` | ✅ |

### Development Volumes

| Volume | Purpose | Mount Point | Hot Reload |
|--------|---------|-------------|------------|
| `dev_data` | Development data | `/app/data` | ❌ |
| `dev_uploads` | Development uploads | `/app/public/uploads` | ❌ |
| `dev_logs` | Development logs | `/app/logs` | ❌ |
| `npm_cache` | NPM package cache | `/root/.npm` | ❌ |
| `yarn_cache` | Yarn package cache | `/usr/local/share/.cache/yarn` | ❌ |

## 🚀 Quick Start

### 1. Initialize Volumes

```bash
# Create volume directories
./docker/manage-volumes.sh create

# Check status
./docker/manage-volumes.sh status
```

### 2. Start with Volumes

```bash
# Production
docker-compose up -d

# Development
docker-compose --profile dev up -d
```

## 🛠️ Volume Management Commands

### Create Volumes
```bash
./docker/manage-volumes.sh create
```

### Backup Volumes
```bash
# Create backup
./docker/manage-volumes.sh backup

# Backups are stored in: ./docker/backups/
```

### Restore Volumes
```bash
# Restore from specific backup
./docker/manage-volumes.sh restore ./docker/backups/ai-mock-interview_volumes_20231201_120000.tar.gz
```

### Check Status
```bash
./docker/manage-volumes.sh status
```

### Clean Volumes
```bash
# ⚠️ This will delete all volume data
./docker/manage-volumes.sh clean
```

### Setup Monitoring
```bash
./docker/manage-volumes.sh monitor
```

## 📊 Monitoring & Maintenance

### Automated Monitoring

Add to crontab for hourly monitoring:
```bash
0 * * * * cd /path/to/ai-mock-interview && ./docker/volumes/monitor.sh
```

### Manual Health Checks

```bash
# Check volume sizes
du -sh docker/volumes/*

# Check Docker volume usage
docker system df

# Check container health
docker-compose ps
```

### Log Rotation

```bash
# Setup log rotation for application logs
sudo tee /etc/logrotate.d/ai-mock-interview << EOF
/path/to/ai-mock-interview/docker/volumes/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 root root
}
EOF
```

## 🔒 Security Best Practices

### File Permissions

```bash
# Set secure permissions
chmod 755 docker/volumes/
chmod 644 docker/volumes/logs/*
chmod 600 docker/volumes/ssl/*
```

### Backup Encryption

```bash
# Encrypt sensitive backups
gpg --symmetric --cipher-algo AES256 backup_file.tar.gz
```

### Access Control

```bash
# Restrict access to volume directories
sudo chown -R root:docker docker/volumes/
sudo chmod 750 docker/volumes/
```

## 🚀 Production Deployment

### 1. Pre-deployment Checklist

- [ ] Volume directories created
- [ ] Proper permissions set
- [ ] Backup strategy configured
- [ ] Monitoring setup
- [ ] SSL certificates in place

### 2. Environment-specific Configurations

#### Staging
```yaml
# docker-compose.staging.yml
volumes:
  app_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /var/lib/ai-mock-interview/staging/data
```

#### Production
```yaml
# docker-compose.prod.yml
volumes:
  app_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /var/lib/ai-mock-interview/production/data
```

### 3. Cloud Storage Integration

#### AWS EFS
```yaml
volumes:
  app_uploads:
    driver: local
    driver_opts:
      type: nfs
      o: addr=fs-12345.efs.region.amazonaws.com,nfsvers=4.1,rsize=1048576,wsize=1048576
      device: :/
```

#### Google Cloud Filestore
```yaml
volumes:
  app_uploads:
    driver: local
    driver_opts:
      type: nfs
      o: addr=10.0.0.2,rsize=1048576,wsize=1048576
      device: :/vol1
```

## 🔧 Troubleshooting

### Common Issues

#### Volume Mount Errors
```bash
# Check if directories exist
ls -la docker/volumes/

# Recreate if missing
./docker/manage-volumes.sh create
```

#### Permission Denied
```bash
# Fix permissions
sudo chown -R $(whoami):$(whoami) docker/volumes/
chmod -R 755 docker/volumes/
```

#### Disk Space Issues
```bash
# Check disk usage
df -h
du -sh docker/volumes/*

# Clean old backups
find docker/backups/ -name "*.tar.gz" -mtime +7 -delete
```

#### Container Won't Start
```bash
# Check volume mounts
docker-compose config

# Inspect container
docker inspect ai-mock-interview-app
```

### Recovery Procedures

#### Data Corruption
1. Stop containers: `docker-compose down`
2. Restore from backup: `./docker/manage-volumes.sh restore <backup_file>`
3. Start containers: `docker-compose up -d`

#### Volume Migration
1. Backup current data: `./docker/manage-volumes.sh backup`
2. Update volume configuration
3. Restore data to new location
4. Test thoroughly

## 📈 Performance Optimization

### Volume Performance Tips

1. **Use SSD storage** for database and cache volumes
2. **Separate volumes** by I/O patterns
3. **Monitor disk usage** regularly
4. **Use tmpfs** for temporary data

### Example tmpfs Configuration
```yaml
services:
  ai-mock-interview:
    tmpfs:
      - /tmp:noexec,nosuid,size=100m
      - /app/temp:size=50m
```

## 🔄 Backup Strategies

### Automated Backups

```bash
# Daily backup script
#!/bin/bash
cd /path/to/ai-mock-interview
./docker/manage-volumes.sh backup

# Upload to cloud storage
aws s3 cp docker/backups/ s3://your-backup-bucket/ --recursive
```

### Backup Retention Policy

- **Daily backups**: Keep for 30 days
- **Weekly backups**: Keep for 12 weeks
- **Monthly backups**: Keep for 12 months
- **Yearly backups**: Keep indefinitely

## 📞 Support

For issues or questions:

1. Check this documentation
2. Review container logs: `docker-compose logs`
3. Check volume status: `./docker/manage-volumes.sh status`
4. Create an issue in the project repository

---

**Last Updated**: December 2023  
**Version**: 1.0.0  
**Maintainer**: AI Mock Interview Team