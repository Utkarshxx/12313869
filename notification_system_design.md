# Stage 1 - Notification System API Design

## Overview

The Campus Notification Platform enables students to receive real-time updates related to placements, events, and results. The platform supports notification retrieval, filtering, marking notifications as read, and priority-based notification viewing.

The system is designed to support scalability, low latency, and real-time communication while maintaining clean RESTful API standards.
---

## 1. Get All Notifications

### Endpoint

```http
GET /api/notifications
```

### Headers

```json
{
  "Authorization": "Bearer <token>"
}
```

### Query Parameters

| Parameter | Type | Description |
|----------|------|-------------|
| page | number | Current page number |
| limit | number | Notifications per page |
| notification_type | string | Filter notifications by type |

### Sample Request

```http
GET /api/notifications?page=1&limit=10&notification_type=Placement
```

### Response

```json
{
  "success": true,
  "page": 1,
  "limit": 10,
  "notifications": [
    {
      "id": "101",
      "type": "Placement",
      "message": "Amazon hiring drive announced",
      "isRead": false,
      "createdAt": "2026-04-22T17:51:30Z"
    }
  ]
}
``` 
---

## 2. Mark Notification as Read

### Endpoint

```http
PATCH /api/notifications/:id/read
```

### Headers

```json
{
  "Authorization": "Bearer <token>"
}
```

### URL Parameter

| Parameter | Type | Description |
|----------|------|-------------|
| id | string | Notification ID |

### Sample Request

```http
PATCH /api/notifications/101/read
```

### Response

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```
---

## 3. Get Priority Notifications

### Endpoint

```http
GET /api/notifications/priority
```

### Headers

```json
{
  "Authorization": "Bearer <token>"
}
```

### Query Parameters

| Parameter | Type | Description |
|----------|------|-------------|
| limit | number | Number of top notifications |

### Sample Request

```http
GET /api/notifications/priority?limit=10
```

### Response

```json
{
  "success": true,
  "notifications": [
    {
      "id": "201",
      "type": "Placement",
      "message": "Google hiring challenge announced",
      "priorityScore": 95,
      "createdAt": "2026-04-22T18:00:00Z"
    }
  ]
}
```
---

## 4. Real-Time Notification Mechanism

The platform will use WebSockets for real-time notification delivery.

### Working

1. The client establishes a persistent WebSocket connection with the server.
2. Whenever a new notification is created, the server instantly pushes the notification to connected students.
3. The frontend updates the notification list without requiring page refresh.

### Advantages

- Low latency communication
- Reduced API polling
- Better user experience
- Efficient real-time updates

### Alternative

Server Sent Events (SSE) can also be used for one-way server-to-client notification streaming.

# Stage 2 - Database Design

## Recommended Database

PostgreSQL is recommended for the notification platform.

### Reasons for Choosing PostgreSQL

- Strong relational consistency
- Efficient indexing support
- Supports complex filtering and querying
- Reliable transaction handling
- Better scalability for structured notification data
- ACID compliance ensures data integrity

---

## Database Schema

### Students Table

| Column | Type |
|--------|------|
| student_id | UUID |
| name | VARCHAR |
| email | VARCHAR |
| department | VARCHAR |

---

### Notifications Table

| Column | Type |
|--------|------|
| notification_id | UUID |
| notification_type | ENUM |
| message | TEXT |
| created_at | TIMESTAMP |

---

### Student_Notifications Table

| Column | Type |
|--------|------|
| id | UUID |
| student_id | UUID |
| notification_id | UUID |
| is_read | BOOLEAN |
| delivered_at | TIMESTAMP |

---

## Potential Problems at Scale

As notification volume increases, the following problems may occur:

- Slow query performance
- Increased database load
- High read latency
- Storage growth
- Slower sorting and filtering operations

---

## Solutions for Scalability

### Indexing

Indexes can be added on:

- student_id
- is_read
- created_at
- notification_type

### Pagination

Pagination reduces large data fetches and improves response time.

### Database Partitioning

Notifications can be partitioned by:

- date
- notification type

### Read Replicas

Read replicas can handle heavy read traffic while reducing load on the primary database.

### Archiving

Old notifications can be archived to separate storage systems to reduce database size.---

## Sample SQL Queries

### Fetch Notifications for a Student

```sql
SELECT *
FROM student_notifications sn
JOIN notifications n
ON sn.notification_id = n.notification_id
WHERE sn.student_id = '1042'
ORDER BY n.created_at DESC;
```

---

### Fetch Unread Notifications

```sql
SELECT *
FROM student_notifications sn
JOIN notifications n
ON sn.notification_id = n.notification_id
WHERE sn.student_id = '1042'
AND sn.is_read = false
ORDER BY n.created_at DESC;
```

---

### Fetch Notifications by Type

```sql
SELECT *
FROM notifications
WHERE notification_type = 'Placement'
ORDER BY created_at DESC;
```

---

### Mark Notification as Read

```sql
UPDATE student_notifications
SET is_read = true
WHERE student_id = '1042'
AND notification_id = '501';
```
# Stage 3 - Query Optimization

## Query Analysis

### Given Query

```sql
SELECT * FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

### Is the Query Accurate?

Yes, the query correctly fetches unread notifications for a student and sorts them based on creation time.

However, performance may degrade significantly as data volume increases.

---

## Why is the Query Slow?

The query becomes slow because:

- Large table scans occur when indexes are missing
- Sorting operations on large datasets are expensive
- Filtering unread notifications for millions of rows increases computation cost

With 5,000,000 notifications, a full table scan becomes inefficient.

---

## Optimized Solution

A composite index should be created on:

```sql
(studentID, isRead, createdAt)
```

### Optimized Index

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt);
```

This helps the database:

- Quickly locate student notifications
- Efficiently filter unread records
- Improve sorting performance

---

## Computational Cost

### Without Index

Approximate Complexity:

```txt
O(n)
```

because the database scans large portions of the table.

### With Composite Index

Approximate Complexity:

```txt
O(log n)
```

which significantly improves query performance.

---

## Should We Add Indexes on Every Column?

No, adding indexes on every column is not effective.

### Problems with Excessive Indexing

- Increased storage usage
- Slower INSERT and UPDATE operations
- Higher maintenance overhead
- Unused indexes waste resources

Indexes should only be added for frequently queried columns.

---

## Query to Find Students Who Received Placement Notifications in Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```git add .