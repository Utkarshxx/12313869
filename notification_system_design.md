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