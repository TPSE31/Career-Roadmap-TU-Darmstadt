# Data Dictionary
## Career Roadmap Database Schema

**Version:** 1.0
**Date:** 2026-01-19
**Author:** Stas (Data Modeling & Database)
**Status:** Initial Implementation

---

## Purpose

This document provides detailed descriptions of all database tables, fields, and their meanings. It serves as a reference for developers and stakeholders to understand the data model.

---

## Table of Contents

1. [User](#user)
2. [ExaminationRegulation](#examinationregulation)
3. [Module](#module)
4. [MilestoneDefinition](#milestonedefinition)
5. [MilestoneProgress](#milestoneprogress)
6. [UserModuleCompletion](#usermodulecompletion)
7. [CareerGoal](#careergoal)
8. [SupportService](#supportservice)
9. [Notification](#notification)

---

## User

**Table Name:** `users`
**Description:** Custom user model extending Django's AbstractUser. Stores authentication credentials and student-specific information.

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| id | BigInteger | PK, Auto | Primary key, auto-generated |
| username | String(150) | Unique, Required | Login username (e.g., "stas_mustermann") |
| email | Email(254) | Required | Student email address |
| password | String(128) | Required | Hashed password (Django authentication) |
| first_name | String(150) | Optional | Student's first name |
| last_name | String(150) | Optional | Student's last name |
| program | String(200) | Optional | Degree program (e.g., "Computer Science B.Sc.") |
| semester | Integer | Min: 1, Optional | Current semester number (1, 2, 3, ...) |
| matriculation_number | String(50) | Unique, Optional | TU student ID / matriculation number |
| examination_regulation_id | Foreign Key | Optional, NULL | Reference to the regulation the student follows |
| is_staff | Boolean | Default: False | Django admin access flag |
| is_active | Boolean | Default: True | Account active status |
| is_superuser | Boolean | Default: False | Superuser permissions flag |
| date_joined | DateTime | Auto | Account creation timestamp |
| last_login | DateTime | Auto | Last login timestamp |
| created_at | DateTime | Auto | Record creation timestamp |
| updated_at | DateTime | Auto | Last update timestamp |

**Business Rules:**
- Students must have a unique username and matriculation number
- Password is stored hashed for security
- Users can optionally be linked to an examination regulation
- If a regulation is deleted, the user's regulation_id is set to NULL (preserves user data)

**Methods:**
- `get_total_credits()`: Calculates total earned credits from completed modules

---

## ExaminationRegulation

**Table Name:** `examination_regulations`
**Description:** Represents different versions of examination regulations (Prüfungsordnungen). Defines degree requirements, module catalogs, and milestone sequences.

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| id | BigInteger | PK, Auto | Primary key |
| name | String(200) | Required | Name of the regulation (e.g., "Computer Science B.Sc.") |
| version | String(50) | Required | Version identifier (e.g., "2020", "v2.1") |
| program | String(200) | Required | Degree program name |
| total_credits_required | Integer | Min: 1, Required | Total CP/ECTS required for degree (e.g., 180) |
| effective_date | Date | Required | Date when this regulation becomes effective |
| is_active | Boolean | Default: True | Whether this regulation is currently active/available |
| description | Text | Optional | Additional description or notes |
| created_at | DateTime | Auto | Record creation timestamp |
| updated_at | DateTime | Auto | Last update timestamp |

**Unique Constraints:**
- `(name, version)`: Prevents duplicate regulation versions

**Indexes:**
- `(program, is_active)`: Fast lookup of active regulations by program
- `(effective_date)`: Chronological ordering

**Business Rules:**
- Each regulation version must have a unique combination of name and version
- Total credits required must be positive
- Inactive regulations are kept for historical purposes but not offered to new students

---

## Module

**Table Name:** `modules`
**Description:** Module catalog representing courses/modules available in a degree program. Each module belongs to a specific examination regulation.

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| id | BigInteger | PK, Auto | Primary key |
| examination_regulation_id | Foreign Key | Required | Reference to the regulation this module belongs to |
| module_code | String(50) | Required | Official module code (e.g., "CS101", "20-00-0001") |
| name | String(200) | Required | Module name (e.g., "Introduction to Programming") |
| credits | Integer | Min: 1, Required | Credit points (CP/ECTS) for this module |
| category | String(50) | Choices, Required | Module category (see choices below) |
| group_name | String(200) | Optional | Group/area name (e.g., "Foundations", "Advanced CS") |
| description | Text | Optional | Detailed module description and learning objectives |
| created_at | DateTime | Auto | Record creation timestamp |
| updated_at | DateTime | Auto | Last update timestamp |

**Category Choices:**
- `mandatory`: Pflichtmodul (required module)
- `elective`: Wahlpflichtmodul (elective module)
- `specialization`: Vertiefungsmodul (specialization module)
- `interdisciplinary`: Übergreifendes Modul (interdisciplinary)
- `thesis`: Abschlussarbeit (bachelor/master thesis)

**Unique Constraints:**
- `(examination_regulation, module_code)`: Unique module code per regulation version

**Indexes:**
- `(examination_regulation, category)`: Filter modules by regulation and category
- `(module_code)`: Fast lookup by code

**Relationships:**
- **Many-to-Many (self)**: `prerequisites` - modules that must be completed before this one

**Business Rules:**
- Module codes must be unique within a regulation version
- Credits must be positive
- Prerequisites create a dependency graph (no cycles allowed in practice)

---

## MilestoneDefinition

**Table Name:** `milestone_definitions`
**Description:** Defines stations on the student's subway/roadmap line. These are checkpoints students progress through during their studies.

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| id | BigInteger | PK, Auto | Primary key |
| examination_regulation_id | Foreign Key | Required | Reference to the regulation this milestone belongs to |
| order_index | Integer | Required | Order of milestone in sequence (0, 1, 2, ...) |
| type | String(50) | Choices, Required | Type of milestone (see choices below) |
| label | String(200) | Required | Short display label (e.g., "30 CP Completed") |
| description | Text | Required | Detailed description of requirements |
| rule_payload | JSON | Default: {} | JSON rules for completion (e.g., {cp_required: 30}) |
| expected_by_semester | Integer | Min: 1, Optional | Expected semester for completion |
| expected_by_date | Date | Optional | Expected date for completion (deadlines) |
| created_at | DateTime | Auto | Record creation timestamp |
| updated_at | DateTime | Auto | Last update timestamp |

**Type Choices:**
- `onboarding`: Initial setup milestones (account, regulation selection)
- `cp_threshold`: Credit point milestones (30 CP, 60 CP, etc.)
- `module_group`: Module group completion (all foundations, all core, etc.)
- `deadline`: Administrative deadlines (registration windows)
- `career_goal`: Career-related milestones
- `thesis`: Thesis-related milestones
- `completion`: Degree completion milestone

**Unique Constraints:**
- `(examination_regulation, order_index)`: Each milestone has unique position in sequence

**Indexes:**
- `(examination_regulation, type)`: Filter milestones by regulation and type
- `(order_index)`: Ordered queries

**JSON Rule Payload Examples:**
```json
// CP threshold milestone
{
  "cp_required": 30
}

// Module group milestone
{
  "group": "Foundations",
  "modules_required": ["CS101", "CS102", "CS103"]
}

// Thesis milestone
{
  "min_cp": 150,
  "prerequisites": ["all_mandatory_modules"]
}
```

**Business Rules:**
- Order index determines the sequence on the roadmap
- Lower order_index = earlier in the journey
- rule_payload is flexible JSON for different milestone types
- System computes milestone completion based on type and rules

---

## MilestoneProgress

**Table Name:** `milestone_progress`
**Description:** Tracks a user's progress on specific milestones. Links users to milestone definitions with status and completion information.

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| id | BigInteger | PK, Auto | Primary key |
| user_id | Foreign Key | Required | Reference to the user |
| milestone_id | Foreign Key | Required | Reference to the milestone definition |
| status | String(20) | Choices, Required | Current milestone status (see choices below) |
| achieved_at | DateTime | Optional | Timestamp when milestone was completed |
| computed_explanation | Text | Optional | Auto-generated progress explanation |
| created_at | DateTime | Auto | Record creation timestamp |
| updated_at | DateTime | Auto | Last update timestamp |

**Status Choices:**
- `locked`: Not yet available (prerequisites not met)
- `available`: Ready to work on
- `in_progress`: Currently working on it
- `completed`: Successfully completed
- `overdue`: Past expected date/semester

**Unique Constraints:**
- `(user, milestone)`: One progress record per user per milestone

**Indexes:**
- `(user, status)`: Filter user's milestones by status
- `(milestone, status)`: See all users at a milestone/status

**computed_explanation Examples:**
- "25/30 CP completed - 5 more CP needed"
- "3 of 6 foundation modules completed"
- "Milestone completed on time"

**Business Rules:**
- Each user has exactly one progress record per milestone
- Status transitions: locked → available → in_progress → completed
- achieved_at is set when status becomes 'completed'
- computed_explanation is auto-generated by business logic

---

## UserModuleCompletion

**Table Name:** `user_module_completions`
**Description:** Tracks which modules a user has completed or is currently taking. Links users to modules with grades and completion status.

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| id | BigInteger | PK, Auto | Primary key |
| user_id | Foreign Key | Required | Reference to the user |
| module_id | Foreign Key | Required | Reference to the module |
| status | String(20) | Choices, Required | Completion status (see choices below) |
| completed_at | DateTime | Optional | Date when module was completed/passed |
| grade | Decimal(3,1) | Optional | Final grade (e.g., 1.0, 2.3, 4.0) |
| semester_taken | String(50) | Optional | Semester identifier (e.g., "WS2023", "SS2024") |
| created_at | DateTime | Auto | Record creation timestamp |
| updated_at | DateTime | Auto | Last update timestamp |

**Status Choices:**
- `not_started`: Module not yet attempted
- `in_progress`: Currently enrolled/taking
- `completed`: Passed/completed successfully
- `failed`: Did not pass (can retake)

**Unique Constraints:**
- `(user, module)`: One completion record per user per module

**Indexes:**
- `(user, status)`: User's modules filtered by status
- `(module, status)`: All users taking a module
- `(completed_at)`: Chronological ordering

**Business Rules:**
- Each user can have only one completion record per module
- Grade follows German grading scale (1.0 best, 5.0 fail)
- Only completed modules count toward total CP
- semester_taken format: "WS" (Wintersemester) or "SS" (Sommersemester) + year

---

## CareerGoal

**Table Name:** `career_goals`
**Description:** Stores user's career interests and goals. Used to personalize roadmap recommendations and suggest relevant modules/support services.

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| id | BigInteger | PK, Auto | Primary key |
| user_id | Foreign Key | Required | Reference to the user |
| goal_type | String(50) | Choices, Required | Category of career goal (see choices below) |
| title | String(200) | Required | Brief goal title/summary |
| description | Text | Optional | Detailed description of the goal |
| tags | JSON | Default: [] | Array of keywords/tags (e.g., ["AI", "Research"]) |
| is_active | Boolean | Default: True | Whether this goal is currently active |
| created_at | DateTime | Auto | Record creation timestamp |
| updated_at | DateTime | Auto | Last update timestamp |

**Goal Type Choices:**
- `industry`: Industry/Company career
- `research`: Research/Academia (PhD, postdoc)
- `startup`: Startup/Entrepreneurship
- `consulting`: Consulting
- `public_sector`: Public sector/government
- `freelance`: Freelance/self-employed
- `other`: Other career paths

**Indexes:**
- `(user, is_active)`: User's active goals
- `(goal_type)`: Goals by type

**Tags Array Example:**
```json
["Machine Learning", "AI", "Deep Learning", "Research"]
```

**Business Rules:**
- Users can have multiple career goals
- Only active goals influence current recommendations
- Tags are used for matching with relevant modules and support services

---

## SupportService

**Table Name:** `support_services`
**Description:** TU Darmstadt support services and resources available to students. Referenced in milestone recommendations and roadmap guidance.

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| id | BigInteger | PK, Auto | Primary key |
| name | String(200) | Required | Name of the support service |
| category | String(50) | Choices, Required | Service category (see choices below) |
| description | Text | Required | What the service provides |
| contact_info | JSON | Default: {} | Contact details (email, phone, hours) |
| url | URL(200) | Optional | Website URL |
| location | String(200) | Optional | Physical location/building |
| is_active | Boolean | Default: True | Whether service is currently available |
| created_at | DateTime | Auto | Record creation timestamp |
| updated_at | DateTime | Auto | Last update timestamp |

**Category Choices:**
- `academic`: Academic support (tutoring, writing center)
- `career`: Career services (job placement, internships)
- `counseling`: Counseling services (psychological support)
- `administrative`: Administrative offices
- `financial`: Financial aid/scholarships
- `health`: Health services
- `international`: International office
- `other`: Other services

**Indexes:**
- `(category, is_active)`: Active services by category

**Contact Info JSON Example:**
```json
{
  "email": "career@tu-darmstadt.de",
  "phone": "+49 6151 16-xxxxx",
  "office_hours": "Mon-Fri 9:00-16:00",
  "building": "S1|03",
  "room": "123"
}
```

**Relationships:**
- **Many-to-Many**: `related_milestones` - milestones where this service is recommended

**Business Rules:**
- Services can be linked to multiple milestones
- Only active services are shown to users
- Contact info is flexible JSON to accommodate different service types

---

## Notification

**Table Name:** `notifications`
**Description:** In-app alerts and reminders for users. Supports milestone reminders, deadline warnings, and personalized recommendations.

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| id | BigInteger | PK, Auto | Primary key |
| user_id | Foreign Key | Required | User receiving this notification |
| type | String(50) | Choices, Required | Notification type (see choices below) |
| priority | String(20) | Choices, Default: medium | Priority level |
| title | String(200) | Required | Notification title |
| message | Text | Required | Full notification message |
| due_at | DateTime | Optional | Due date/time (for deadline notifications) |
| read_at | DateTime | Optional | When notification was read (NULL = unread) |
| related_milestone_id | Foreign Key | Optional, NULL | Optional milestone reference |
| action_url | String(500) | Optional | URL for action button (e.g., "/roadmap") |
| created_at | DateTime | Auto | When notification was created |

**Type Choices:**
- `milestone_reminder`: Upcoming milestone reminder
- `deadline_warning`: Deadline approaching
- `milestone_achieved`: Milestone completed celebration
- `recommendation`: Personalized recommendation
- `support_service`: Support service information
- `system`: System announcements

**Priority Choices:**
- `low`: Low priority (informational)
- `medium`: Normal priority
- `high`: High priority (important)
- `urgent`: Urgent (deadline soon)

**Indexes:**
- `(user, read_at)`: Unread notifications for user
- `(user, type)`: Notifications by type for user
- `(due_at)`: Upcoming deadlines
- `(created_at)`: Chronological ordering

**Business Rules:**
- Notifications are user-specific
- read_at NULL = unread, timestamp = read
- due_at is used for deadline-based notifications
- action_url enables one-click navigation to relevant pages
- related_milestone links notification to specific milestone (optional)

**Methods:**
- `mark_as_read()`: Sets read_at to current timestamp

---

## Field Type Reference

### Common Django Field Types Used

- **BigInteger**: 64-bit integer, auto-incrementing for primary keys
- **String(n)**: Variable-length character field, max length n
- **Text**: Unlimited length text field
- **Integer**: 32-bit integer
- **Decimal(m,n)**: Fixed-point decimal (m total digits, n decimal places)
- **Boolean**: True/False value
- **Date**: Date without time
- **DateTime**: Date with time (timezone-aware)
- **Email**: String validated as email format
- **URL**: String validated as URL format
- **JSON**: JSON data (native PostgreSQL JSON, stored as text in SQLite)
- **Foreign Key**: Reference to another table's primary key

---

## Naming Conventions

- **Table names**: Lowercase with underscores, plural (e.g., `users`, `modules`)
- **Field names**: Lowercase with underscores (e.g., `user_id`, `created_at`)
- **Foreign keys**: End with `_id` (e.g., `examination_regulation_id`)
- **Timestamps**: `created_at` (creation), `updated_at` (last modification)
- **Status fields**: Use string choices for clarity and extensibility

---

## Notes

1. All timestamps are timezone-aware (UTC)
2. JSON fields provide flexibility for evolving requirements
3. Indexes are strategically placed for common query patterns
4. Unique constraints prevent data duplication
5. Foreign key constraints maintain referential integrity
6. CASCADE deletes remove dependent data
7. SET_NULL preserves data when optional references are removed

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-19 | Stas | Initial data model implementation |
