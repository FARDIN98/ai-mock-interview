#!/bin/bash

# AI Mock Interview - Docker Volume Management Script
# Professional-grade volume management for production and development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="ai-mock-interview"
VOLUME_DIR="./docker/volumes"
BACKUP_DIR="./docker/backups"
DATE=$(date +"%Y%m%d_%H%M%S")

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to create volume directories
create_volumes() {
    print_info "Creating volume directories..."
    
    # Production volumes
    mkdir -p "${VOLUME_DIR}/app_data"
    mkdir -p "${VOLUME_DIR}/uploads"
    mkdir -p "${VOLUME_DIR}/logs"
    mkdir -p "${VOLUME_DIR}/backups"
    mkdir -p "${VOLUME_DIR}/ssl"
    
    # Development volumes
    mkdir -p "${VOLUME_DIR}/dev_data"
    mkdir -p "${VOLUME_DIR}/dev_uploads"
    mkdir -p "${VOLUME_DIR}/dev_logs"
    
    # Set proper permissions
    chmod 755 "${VOLUME_DIR}"/*
    
    print_success "Volume directories created successfully!"
}

# Function to backup volumes
backup_volumes() {
    print_info "Starting volume backup..."
    
    mkdir -p "${BACKUP_DIR}"
    
    # Create backup archive
    BACKUP_FILE="${BACKUP_DIR}/${PROJECT_NAME}_volumes_${DATE}.tar.gz"
    
    tar -czf "${BACKUP_FILE}" -C "${VOLUME_DIR}" .
    
    print_success "Volumes backed up to: ${BACKUP_FILE}"
    
    # Keep only last 7 backups
    find "${BACKUP_DIR}" -name "${PROJECT_NAME}_volumes_*.tar.gz" -type f -mtime +7 -delete
    
    print_info "Old backups cleaned up (kept last 7 days)"
}

# Function to restore volumes
restore_volumes() {
    if [ -z "$1" ]; then
        print_error "Please provide backup file path"
        echo "Usage: $0 restore <backup_file>"
        exit 1
    fi
    
    BACKUP_FILE="$1"
    
    if [ ! -f "${BACKUP_FILE}" ]; then
        print_error "Backup file not found: ${BACKUP_FILE}"
        exit 1
    fi
    
    print_warning "This will overwrite existing volume data. Continue? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        print_info "Restoring volumes from: ${BACKUP_FILE}"
        
        # Stop containers first
        docker-compose down
        
        # Clear existing volumes
        rm -rf "${VOLUME_DIR}"/*
        
        # Restore from backup
        tar -xzf "${BACKUP_FILE}" -C "${VOLUME_DIR}"
        
        print_success "Volumes restored successfully!"
        print_info "You can now start the containers with: docker-compose up -d"
    else
        print_info "Restore cancelled"
    fi
}

# Function to clean volumes
clean_volumes() {
    print_warning "This will remove all volume data. Continue? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        print_info "Cleaning volumes..."
        
        # Stop containers
        docker-compose down
        
        # Remove volume data
        rm -rf "${VOLUME_DIR}"/*
        
        # Remove Docker volumes
        docker volume prune -f
        
        print_success "Volumes cleaned successfully!"
    else
        print_info "Clean cancelled"
    fi
}

# Function to show volume status
show_status() {
    print_info "Volume Status:"
    echo
    
    # Check if directories exist
    for dir in app_data uploads logs backups ssl dev_data dev_uploads dev_logs; do
        if [ -d "${VOLUME_DIR}/${dir}" ]; then
            size=$(du -sh "${VOLUME_DIR}/${dir}" 2>/dev/null | cut -f1)
            print_success "${dir}: ${size}"
        else
            print_warning "${dir}: Not found"
        fi
    done
    
    echo
    print_info "Docker Volumes:"
    docker volume ls | grep "${PROJECT_NAME}" || print_warning "No Docker volumes found"
    
    echo
    print_info "Recent Backups:"
    if [ -d "${BACKUP_DIR}" ]; then
        ls -la "${BACKUP_DIR}"/*.tar.gz 2>/dev/null | tail -5 || print_warning "No backups found"
    else
        print_warning "Backup directory not found"
    fi
}

# Function to setup monitoring
setup_monitoring() {
    print_info "Setting up volume monitoring..."
    
    # Create monitoring script
    cat > "${VOLUME_DIR}/monitor.sh" << 'EOF'
#!/bin/bash
# Volume monitoring script

VOLUME_DIR="./docker/volumes"
LOG_FILE="${VOLUME_DIR}/logs/volume_monitor.log"

# Check disk usage
echo "$(date): Volume disk usage check" >> "${LOG_FILE}"
du -sh "${VOLUME_DIR}"/* >> "${LOG_FILE}" 2>&1

# Alert if any volume exceeds 1GB
for dir in "${VOLUME_DIR}"/*; do
    if [ -d "$dir" ]; then
        size=$(du -s "$dir" | cut -f1)
        if [ "$size" -gt 1048576 ]; then  # 1GB in KB
            echo "$(date): WARNING: $(basename "$dir") volume exceeds 1GB" >> "${LOG_FILE}"
        fi
    fi
done
EOF
    
    chmod +x "${VOLUME_DIR}/monitor.sh"
    
    print_success "Monitoring setup complete!"
    print_info "Add this to crontab for hourly monitoring:"
    echo "0 * * * * cd $(pwd) && ./docker/volumes/monitor.sh"
}

# Main script logic
case "$1" in
    "create")
        create_volumes
        ;;
    "backup")
        backup_volumes
        ;;
    "restore")
        restore_volumes "$2"
        ;;
    "clean")
        clean_volumes
        ;;
    "status")
        show_status
        ;;
    "monitor")
        setup_monitoring
        ;;
    "help"|"--help"|"-h")
        echo "AI Mock Interview - Docker Volume Management"
        echo
        echo "Usage: $0 <command> [options]"
        echo
        echo "Commands:"
        echo "  create    Create volume directories"
        echo "  backup    Backup all volumes"
        echo "  restore   Restore volumes from backup file"
        echo "  clean     Clean all volume data"
        echo "  status    Show volume status and usage"
        echo "  monitor   Setup volume monitoring"
        echo "  help      Show this help message"
        echo
        echo "Examples:"
        echo "  $0 create"
        echo "  $0 backup"
        echo "  $0 restore ./docker/backups/ai-mock-interview_volumes_20231201_120000.tar.gz"
        echo "  $0 status"
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac