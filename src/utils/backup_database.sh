
#!/bin/bash
# Database Backup Script for Vehicle Tracking System
# Place this script in /etc/cron.daily/ to run daily backups
# Make sure to chmod +x this script

# Configuration
BACKUP_DIR="/var/backups/tracking_system"
MYSQL_USER="tracking_user"
MYSQL_PASSWORD="senha_segura"
MYSQL_DATABASE="tracking_system"
BACKUP_RETENTION_DAYS=14
DATE=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="/var/log/tracking_system_backup.log"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Log function
log() {
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" >> $LOG_FILE
}

log "Starting database backup..."

# Dump database
BACKUP_FILE="$BACKUP_DIR/tracking_system_$DATE.sql"
mysqldump --user=$MYSQL_USER --password=$MYSQL_PASSWORD --single-transaction --quick --lock-tables=false $MYSQL_DATABASE > $BACKUP_FILE 2>> $LOG_FILE

# Check if backup was successful
if [ $? -eq 0 ]; then
    # Compress the backup
    gzip $BACKUP_FILE
    log "Backup completed successfully: $BACKUP_FILE.gz"
    
    # Create MD5 checksum
    md5sum "$BACKUP_FILE.gz" > "$BACKUP_FILE.gz.md5"
    log "MD5 checksum created"
    
    # Delete old backups
    find $BACKUP_DIR -name "tracking_system_*.sql.gz" -mtime +$BACKUP_RETENTION_DAYS -delete
    find $BACKUP_DIR -name "tracking_system_*.sql.gz.md5" -mtime +$BACKUP_RETENTION_DAYS -delete
    log "Removed backups older than $BACKUP_RETENTION_DAYS days"
else
    log "Backup failed!"
fi

# Backup database structure separately (useful for version control)
SCHEMA_FILE="$BACKUP_DIR/tracking_system_schema_$DATE.sql"
mysqldump --user=$MYSQL_USER --password=$MYSQL_PASSWORD --no-data $MYSQL_DATABASE > $SCHEMA_FILE 2>> $LOG_FILE

# Check if schema backup was successful
if [ $? -eq 0 ]; then
    gzip $SCHEMA_FILE
    log "Schema backup completed successfully: $SCHEMA_FILE.gz"
else
    log "Schema backup failed!"
fi

# Create a backup report
TOTAL_BACKUPS=$(find $BACKUP_DIR -name "tracking_system_*.sql.gz" | wc -l)
LATEST_BACKUP=$(find $BACKUP_DIR -name "tracking_system_*.sql.gz" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -f2- -d" ")
BACKUP_SIZE=$(du -h "$BACKUP_FILE.gz" | cut -f1)

log "Backup report:"
log "- Total backups: $TOTAL_BACKUPS"
log "- Latest backup: $LATEST_BACKUP"
log "- Backup size: $BACKUP_SIZE"
log "===== Backup process completed ====="
