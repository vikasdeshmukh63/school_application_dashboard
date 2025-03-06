# School Management Dashboard

## Database Setup Order

When setting up the school management system from scratch, follow this specific order to ensure proper data relationships and avoid foreign key constraint violations.

### 1. Grade System Setup
- Basic entity with no dependencies
- Contains level information
- Required for class creation
```json
{
  "id": "autoincrement",
  "level": "unique integer"
}
```

### 2. Subject Setup
- Independent entity
- No initial dependencies
- Will be linked to teachers and lessons
```json
{
  "id": "number",
  "name": "string",
  "teachers": "string[]"
}
```

### 3. Class Setup
- Requires Grade to be set up first
```json
{
  "id": "number",
  "name": "string",
  "capacity": "number",
  "gradeId": "number",
  "supervisorId": "string (optional)"
}
```

### 4. Teacher Registration
- Independent entity for basic information
- Can be linked to subjects later
```json
{
  "id": "string",
  "username": "string",
  "password": "string",
  "name": "string",
  "surname": "string",
  "email": "string (optional)",
  "phone": "string (optional)",
  "address": "string",
  "img": "string (optional)",
  "bloodType": "string",
  "birthday": "date",
  "gender": "MALE | FEMALE",
  "subjects": "string[] (optional)"
}
```

### 5. Parent Registration
- Required before adding students
```json
{
  "id": "string",
  "username": "string",
  "password": "string",
  "name": "string",
  "surname": "string",
  "email": "string (optional)",
  "phone": "string",
  "address": "string",
  "students": "string[] (optional)"
}
```

### 6. Student Registration
- Requires Parent, Class, and Grade to be set up first
```json
{
  "id": "string",
  "username": "string",
  "password": "string",
  "name": "string",
  "surname": "string",
  "email": "string (optional)",
  "phone": "string (optional)",
  "address": "string",
  "img": "string (optional)",
  "bloodType": "string",
  "birthday": "date",
  "gender": "MALE | FEMALE",
  "gradeId": "number",
  "classId": "number",
  "parentId": "string"
}
```

### 7. Lesson Setup
- Requires Subject, Class, and Teacher to be set up first
```json
{
  "id": "number",
  "name": "string",
  "day": "MONDAY | TUESDAY | WEDNESDAY | THURSDAY | FRIDAY",
  "startTime": "date",
  "endTime": "date",
  "subjectId": "number",
  "classId": "number",
  "teacherId": "string"
}
```

### 8. Additional Entities
These can be added any time after their dependencies are met:

#### Exams
```json
{
  "id": "number",
  "title": "string",
  "startTime": "date",
  "endTime": "date",
  "lessonId": "number"
}
```

#### Assignments
```json
{
  "id": "number",
  "title": "string",
  "startDate": "date",
  "dueDate": "date",
  "lessonId": "number"
}
```

#### Results
```json
{
  "id": "number",
  "score": "number (0-100)",
  "examId": "number (optional)",
  "assignmentId": "number (optional)",
  "studentId": "string"
}
```

#### Events
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "startTime": "date",
  "endTime": "date",
  "classId": "number (optional)"
}
```

#### Announcements
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "date": "date",
  "classId": "number (optional)"
}
```

## Important Notes

1. All IDs are automatically generated - do not manually set them
2. Ensure all required fields are filled when creating new entries
3. Follow the setup order to avoid relationship conflicts
4. Some fields are optional and can be left empty (marked with "optional")
5. Dates should be in valid date format
6. Password fields should be at least 8 characters long
7. Usernames must be between 3-20 characters
8. Email fields must contain valid email addresses

## Dependencies

- Each Student must have a Parent
- Each Student must be assigned to a Class and Grade
- Each Class must belong to a Grade
- Each Lesson must have a Subject, Class, and Teacher
- Results must be linked to a Student and either an Exam or Assignment

Following this order ensures proper database setup and maintains data integrity throughout the system.

npx prisma db seed

npx prisma migrate reset --force