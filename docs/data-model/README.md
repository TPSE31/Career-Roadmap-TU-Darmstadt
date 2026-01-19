# Data Model Documentation

**Project:** Career Roadmap Tool - Group 31 (TU Darmstadt)
**Version:** 1.0
**Date:** 2026-01-19
**Maintainer:** Stas (Data Modeling & Database)

---

## Overview

This directory contains comprehensive documentation for the Career Roadmap database schema and data models. The data model implements the requirements specified in the project specification document, supporting:

- User authentication and student profiles
- Examination regulation management
- Module catalogs and prerequisites
- Milestone tracking (subway/roadmap model)
- Career goal management
- Support service recommendations
- Notification system

---

## Documentation Files

### 1. [ER-DIAGRAM.md](./ER-DIAGRAM.md)
Entity-Relationship diagram showing:
- All database tables and their relationships
- Primary keys and foreign keys
- Cardinality (one-to-many, many-to-many)
- Indexes and unique constraints
- Visual representation of the schema

**When to use:** Understanding the overall database structure and how entities relate to each other.

### 2. [DATA-DICTIONARY.md](./DATA-DICTIONARY.md)
Comprehensive field-by-field reference including:
- All tables and their purpose
- Every field with type, constraints, and business rules
- Choice field options and their meanings
- JSON field examples
- Business logic and validation rules

**When to use:** Looking up specific field details, understanding data types, or implementing validation logic.

---

## Quick Start

### For Developers

1. **Read the ER Diagram first** to understand the overall structure
2. **Consult the Data Dictionary** for specific field details
3. **Check the models.py** file for the actual Django implementation

### For Database Setup

```bash
# Activate virtual environment
source venv/Scripts/activate  # Windows/CYGWIN
# or
source venv/bin/activate      # Linux/Mac

# Navigate to backend
cd backend

# Create migrations (if models changed)
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Seed test data
python manage.py seed_data

# Optional: Clear and reseed
python manage.py seed_data --clear
```

---

## Database Schema Summary

### Core Entities (9 tables)

1. **User** - Student accounts and authentication
2. **ExaminationRegulation** - Degree program requirements
3. **Module** - Course catalog
4. **MilestoneDefinition** - Roadmap checkpoints
5. **MilestoneProgress** - Student milestone tracking
6. **UserModuleCompletion** - Module completion records
7. **CareerGoal** - Career interests and goals
8. **SupportService** - TU support resources
9. **Notification** - In-app alerts and reminders

### Key Relationships

- One **ExaminationRegulation** → Many **Users**
- One **ExaminationRegulation** → Many **Modules**
- One **ExaminationRegulation** → Many **MilestoneDefinitions**
- One **User** → Many **UserModuleCompletions**
- One **User** → Many **MilestoneProgress** records
- **Module** ↔ **Module** (prerequisites, self-referential)
- **SupportService** ↔ **MilestoneDefinition** (many-to-many)

---

## Database Technologies

### Development
- **SQLite** - Local development database (included with Django)
- Automatically created at `backend/db.sqlite3`
- No additional setup required

### Production
- **PostgreSQL** - Production database (recommended)
- Configuration via environment variables:
  ```bash
  export DB_ENGINE=postgresql
  export DB_NAME=career_roadmap
  export DB_USER=career_roadmap_user
  export DB_PASSWORD=<secure-password>
  export DB_HOST=localhost
  export DB_PORT=5432
  ```

---

## Data Integrity

### Enforced Constraints

1. **Unique Constraints**
   - User: matriculation_number
   - ExaminationRegulation: (name, version)
   - Module: (examination_regulation, module_code)
   - MilestoneDefinition: (examination_regulation, order_index)
   - MilestoneProgress: (user, milestone)
   - UserModuleCompletion: (user, module)

2. **Foreign Key Cascades**
   - CASCADE: Deleting a regulation deletes its modules and milestones
   - CASCADE: Deleting a user deletes their progress records
   - SET_NULL: Deleting a regulation preserves user accounts

3. **Validation Rules**
   - Credit points must be positive (MinValueValidator)
   - Semesters must be >= 1
   - Grades follow German scale (1.0-5.0)
   - Email and URL fields have format validation

---

## Testing Data

The project includes a management command to populate the database with realistic test data:

```bash
python manage.py seed_data
```

This creates:
- 2 examination regulations
- 20 sample modules (foundations, core, electives, thesis)
- 14 milestone definitions (onboarding → completion)
- 6 support services
- 3 test users with different progress levels
- Module completions, milestone progress, career goals, and notifications

### Test User Credentials

| Username | Password | Progress Level |
|----------|----------|----------------|
| stas_mustermann | testpass123 | Advanced (Semester 4, 72 CP) |
| maria_schmidt | testpass123 | Mid-level (Semester 2, 36 CP) |
| john_doe | testpass123 | Beginner (Semester 1, just started) |

---

## PostgreSQL Setup (Production)

### 1. Install PostgreSQL

```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql

# Windows
# Download from: https://www.postgresql.org/download/windows/
```

### 2. Create Database and User

```sql
-- Connect to PostgreSQL
sudo -u postgres psql

-- Create database
CREATE DATABASE career_roadmap;

-- Create user
CREATE USER career_roadmap_user WITH PASSWORD 'your-secure-password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE career_roadmap TO career_roadmap_user;

-- PostgreSQL 15+: Additional grant required
\c career_roadmap
GRANT ALL ON SCHEMA public TO career_roadmap_user;
```

### 3. Install psycopg2

```bash
pip install psycopg2-binary
```

### 4. Configure Environment

```bash
export DB_ENGINE=postgresql
export DB_NAME=career_roadmap
export DB_USER=career_roadmap_user
export DB_PASSWORD=your-secure-password
export DB_HOST=localhost
export DB_PORT=5432
```

### 5. Run Migrations

```bash
python manage.py migrate
python manage.py seed_data
```

---

## Migration Management

### Creating Migrations

```bash
# After modifying models.py
python manage.py makemigrations

# Apply migrations
python manage.py migrate
```

### Important Notes

1. **Coordination**: Only one team member should modify models at a time
2. **Pull Before Creating**: Always pull latest migrations before making new ones
3. **Test Locally**: Test migrations on a clean database before committing
4. **No Editing**: Don't edit migrations after they're merged to main
5. **Conflicts**: If migration conflicts occur:
   - Pull latest main
   - Delete your migration files
   - Run `makemigrations` again

---

## Admin Interface

All models are registered in Django admin for easy data management:

```bash
# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Access admin at:
http://localhost:8000/admin/
```

Admin features:
- Full CRUD operations for all models
- Search and filtering
- Bulk actions (e.g., mark notifications as read)
- Inline editing of related objects
- Data import/export capabilities

---

## API Integration

The data models support REST API endpoints (to be implemented by backend team):

### Planned Endpoints

- `/api/users/` - User management
- `/api/regulations/` - Examination regulations
- `/api/modules/` - Module catalog
- `/api/milestones/` - Milestone definitions
- `/api/progress/` - User progress tracking
- `/api/completions/` - Module completions
- `/api/goals/` - Career goals
- `/api/services/` - Support services
- `/api/notifications/` - Notifications

---

## Data Model Features

### Flexible Configuration

- **JSON Fields**: Used for flexible data (rule_payload, tags, contact_info)
- **Regulation-Driven**: Milestones and modules tied to regulation versions
- **Version Support**: Multiple regulation versions can coexist

### Performance Optimizations

- **Indexes**: Strategic indexes on common query patterns
- **Select Related**: Optimized queries using Django's select_related/prefetch_related
- **Denormalization**: Computed fields cache expensive calculations

### Extensibility

- **Status Fields**: String choices allow easy addition of new statuses
- **JSON Payload**: Milestone rules can evolve without schema changes
- **Many-to-Many**: Support service recommendations can be extended

---

## Future Enhancements

Possible future additions to the data model:

1. **Study Groups** - Collaborative learning features
2. **Events/Calendar** - Important dates and deadlines
3. **Achievement Badges** - Gamification elements
4. **Module Reviews** - Student feedback on modules
5. **Grade Analytics** - GPA tracking and predictions
6. **Export/Import** - Data portability (TUCaN integration)

---

## Contact & Support

**Data Model Maintainer:** Stas
**Backend Team:** Amine & Emir
**Project Repository:** https://github.com/TPSE31/Career-Roadmap-TU-Darmstadt

For questions about:
- Database schema: Contact Stas
- API endpoints: Contact Amine/Emir
- Migrations: Coordinate via team communication

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-19 | Stas | Initial data model implementation with 9 core entities |

---

## License & Acknowledgments

This project is developed as part of the TPSE course at TU Darmstadt.
