# Entity-Relationship Diagram
## Career Roadmap Database Schema

**Version:** 1.0
**Date:** 2026-01-19
**Author:** Stas (Data Modeling & Database)
**Status:** Initial Implementation

---

## Overview

This document describes the entity-relationship model for the Career Roadmap application database. The schema supports:
- User authentication and management
- Examination regulations and module catalogs
- Student milestone tracking (subway/roadmap model)
- Career goal management
- Support service recommendations
- Notification system

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CORE ENTITIES                                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│   User              │ (extends Django AbstractUser)
├─────────────────────┤
│ PK: id              │
│ username            │
│ email               │
│ password            │
│ first_name          │
│ last_name           │
│ program             │───────┐
│ semester            │       │
│ matriculation_no    │       │
│ FK: regulation_id   │───┐   │
│ created_at          │   │   │
│ updated_at          │   │   │
└─────────────────────┘   │   │
        │                 │   │
        │ 1               │   │
        │                 │   │
        │ N               │   │
        ├─────────────────┼───┼───────────────────┐
        │                 │   │                   │
        │                 │   │                   │
        ▼                 │   │                   ▼
┌─────────────────────┐  │   │           ┌────────────────────┐
│ UserModuleCompletion│  │   │           │ MilestoneProgress  │
├─────────────────────┤  │   │           ├────────────────────┤
│ PK: id              │  │   │           │ PK: id             │
│ FK: user_id         │  │   │           │ FK: user_id        │
│ FK: module_id       │──┼───┼───┐       │ FK: milestone_id   │──┐
│ status              │  │   │   │       │ status             │  │
│ completed_at        │  │   │   │       │ achieved_at        │  │
│ grade               │  │   │   │       │ computed_explain   │  │
│ semester_taken      │  │   │   │       │ created_at         │  │
│ created_at          │  │   │   │       │ updated_at         │  │
│ updated_at          │  │   │   │       └────────────────────┘  │
└─────────────────────┘  │   │   │               │               │
        │                │   │   │               │ N             │
        │ 1              │   │   │               │               │
        ▼                │   │   │               │ 1             │
┌─────────────────────┐  │   │   │               ▼               │
│ CareerGoal          │  │   │   │       ┌────────────────────┐  │
├─────────────────────┤  │   │   │       │MilestoneDefinition │  │
│ PK: id              │  │   │   │       ├────────────────────┤  │
│ FK: user_id         │  │   │   │       │ PK: id             │  │
│ goal_type           │  │   │   │       │ FK: regulation_id  │──┼───┐
│ title               │  │   │   │       │ order_index        │  │   │
│ description         │  │   │   │       │ type               │  │   │
│ tags (JSON)         │  │   │   │       │ label              │  │   │
│ is_active           │  │   │   │       │ description        │  │   │
│ created_at          │  │   │   │       │ rule_payload (JSON)│  │   │
│ updated_at          │  │   │   │       │ expected_by_sem    │  │   │
└─────────────────────┘  │   │   │       │ expected_by_date   │  │   │
        │                │   │   │       │ created_at         │  │   │
        │ 1              │   │   │       │ updated_at         │  │   │
        ▼                │   │   │       └────────────────────┘  │   │
┌─────────────────────┐  │   │   │                  │            │   │
│ Notification        │  │   │   │                  │ M          │   │
├─────────────────────┤  │   │   │                  │            │   │
│ PK: id              │  │   │   │                  ▼            │   │
│ FK: user_id         │  │   │   │       ┌────────────────────┐ │   │
│ FK: milestone_id    │──┼───┼───┼───────│ SupportService     │ │   │
│ type                │  │   │   │       ├────────────────────┤ │   │
│ priority            │  │   │   │       │ PK: id             │ │   │
│ title               │  │   │   │       │ name               │ │   │
│ message             │  │   │   │       │ category           │ │   │
│ due_at              │  │   │   │       │ description        │ │   │
│ read_at             │  │   │   │       │ contact_info (JSON)│ │   │
│ action_url          │  │   │   │       │ url                │ │   │
│ created_at          │  │   │   │       │ location           │ │   │
└─────────────────────┘  │   │   │       │ is_active          │ │   │
                         │   │   │       │ created_at         │ │   │
                         │   │   │       │ updated_at         │ │   │
                         │   │   │       └────────────────────┘ │   │
                         │   │   │                  ▲            │   │
                         │   │   │                  │ M          │   │
                         │   │   │                  │            │   │
                         │   │   └──────────────────┼────────────┘   │
                         │   │                      │                │
                         │   │                      │ M              │
                         │   │                      │                │
                         │   └──────────────────────┼────────────────┘
                         │                          │
                         │                          │ 1
                         │                          │
                         │                          ▼
                         │              ┌──────────────────────┐
                         │              │ExaminationRegulation │
                         │              ├──────────────────────┤
                         │              │ PK: id               │
                         │              │ name                 │
                         │              │ version              │
                         │              │ program              │
                         │              │ total_credits_req    │
                         │              │ effective_date       │
                         │              │ is_active            │
                         │              │ description          │
                         │              │ created_at           │
                         │              │ updated_at           │
                         │              └──────────────────────┘
                         │                          │
                         │                          │ 1
                         │                          │
                         │                          │ N
                         │                          ▼
                         │              ┌──────────────────────┐
                         └──────────────│ Module               │
                                        ├──────────────────────┤
                                        │ PK: id               │
                                        │ FK: regulation_id    │
                                        │ module_code          │
                                        │ name                 │
                                        │ credits              │
                                        │ category             │
                                        │ group_name           │
                                        │ description          │
                                        │ created_at           │
                                        │ updated_at           │
                                        └──────────────────────┘
                                                │    ▲
                                                │    │
                                                │ M  │ M
                                     prerequisites   │
                                        (self-ref)   │
                                                │    │
                                                └────┘
```

---

## Relationship Details

### One-to-Many Relationships

1. **ExaminationRegulation → User**
   - One regulation can have many users enrolled in it
   - Users must select (or be assigned) an examination regulation
   - ON DELETE: SET_NULL (keep user data even if regulation is removed)

2. **ExaminationRegulation → Module**
   - One regulation defines many modules
   - Each module belongs to exactly one regulation version
   - ON DELETE: CASCADE (if regulation is deleted, its modules are too)

3. **ExaminationRegulation → MilestoneDefinition**
   - One regulation defines many milestones
   - Each milestone belongs to exactly one regulation
   - ON DELETE: CASCADE

4. **User → UserModuleCompletion**
   - One user can have many module completion records
   - Each completion belongs to one user
   - ON DELETE: CASCADE

5. **Module → UserModuleCompletion**
   - One module can be completed by many users
   - Each completion references one module
   - ON DELETE: CASCADE

6. **User → MilestoneProgress**
   - One user has many milestone progress records
   - Each progress record belongs to one user
   - ON DELETE: CASCADE

7. **MilestoneDefinition → MilestoneProgress**
   - One milestone definition tracks progress for many users
   - Each progress record references one milestone
   - ON DELETE: CASCADE

8. **User → CareerGoal**
   - One user can have multiple career goals
   - Each goal belongs to one user
   - ON DELETE: CASCADE

9. **User → Notification**
   - One user can have many notifications
   - Each notification belongs to one user
   - ON DELETE: CASCADE

10. **MilestoneDefinition → Notification**
    - One milestone can trigger many notifications
    - Notifications can optionally reference a milestone
    - ON DELETE: SET_NULL (keep notification even if milestone is removed)

### Many-to-Many Relationships

1. **Module → Module (prerequisites)**
   - Self-referential relationship
   - A module can have multiple prerequisite modules
   - A module can be a prerequisite for multiple other modules
   - Non-symmetrical relationship

2. **SupportService ↔ MilestoneDefinition**
   - Support services can be relevant to multiple milestones
   - Milestones can recommend multiple support services
   - Through table created automatically by Django

---

## Indexes

For optimal query performance, the following indexes are defined:

### ExaminationRegulation
- `(program, is_active)`
- `(effective_date)`

### Module
- `(examination_regulation, category)`
- `(module_code)`

### MilestoneDefinition
- `(examination_regulation, type)`
- `(order_index)`

### MilestoneProgress
- `(user, status)`
- `(milestone, status)`

### UserModuleCompletion
- `(user, status)`
- `(module, status)`
- `(completed_at)`

### CareerGoal
- `(user, is_active)`
- `(goal_type)`

### SupportService
- `(category, is_active)`

### Notification
- `(user, read_at)`
- `(user, type)`
- `(due_at)`
- `(created_at)`

---

## Unique Constraints

1. **ExaminationRegulation**: `(name, version)` - prevents duplicate regulation versions
2. **Module**: `(examination_regulation, module_code)` - unique module code per regulation
3. **MilestoneDefinition**: `(examination_regulation, order_index)` - unique ordering per regulation
4. **MilestoneProgress**: `(user, milestone)` - one progress record per user per milestone
5. **UserModuleCompletion**: `(user, module)` - one completion record per user per module
6. **User**: `(matriculation_number)` - unique student ID

---

## Data Integrity Rules

1. **User Authentication**: Handled by Django's AbstractUser base class
2. **Cascading Deletes**: Configured to maintain referential integrity
3. **Null Handling**: Optional foreign keys use SET_NULL on delete
4. **Default Values**: Appropriate defaults set for status fields, timestamps, etc.
5. **Validation**: Min validators on numeric fields (credits, semester, etc.)

---

## Notes for Development

1. **Database Migrations**: Always run migrations after model changes
2. **PostgreSQL Ready**: Schema designed for PostgreSQL in production
3. **SQLite Compatible**: Works with SQLite for local development
4. **Extensibility**: Schema supports future additions without breaking changes
5. **JSON Fields**: Used for flexible data (rule_payload, tags, contact_info)
