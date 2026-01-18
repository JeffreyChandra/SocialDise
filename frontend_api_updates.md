# Backend API Updates for Frontend

Two new Deep Learning features were added to the backend. Here's what changed:

---

## 1. GenAI Detection (Media Upload)

**Endpoint:** `POST /deepfake/detect`

The `detection` object now returns **two scores** instead of one:

| Field | Type | Description |
|-------|------|-------------|
| `deepfakeScore` | number (0-1) | Face manipulation detection |
| `genaiScore` | number (0-1) | Fully AI-generated image detection |

### Response Example
```json
{
  "isSafe": true,
  "message": "Upload berhasil. Media terverifikasi aman dan telah disimpan.",
  "detection": {
    "deepfakeScore": 0.02,
    "genaiScore": 0.05,
    "message": "Image: 2.0% deepfake, 5.0% AI-generated."
  },
  "fileInfo": {
    "url": "https://...",
    "format": "jpg",
    "resource_type": "image"
  }
}
```

### Frontend TODO
- Display both `deepfakeScore` and `genaiScore` in the UI (e.g., two progress bars).
- Show a warning badge on posts where `isSafe: false`.

---

## 2. Text Moderation (Comments)

**Endpoints:**
- `POST /posts/:postId/comments` (create)
- `PATCH /posts/:postId/comments/:commentId` (update)

Comments are now validated for **profanity**, **personal attacks**, and **spam links**. Flagged comments return `400 Bad Request`.

### Error Response Example
```json
{
  "statusCode": 400,
  "message": "Komentar ditolak: Flagged for: profanity, personal_attack.",
  "error": "Bad Request"
}
```

### Frontend TODO
- Handle `400` errors on comment submission/edit.
- Display a toast: *"Your comment was blocked due to inappropriate content."*

---

## Interface Change Summary

```typescript
// OLD
interface DetectionResult {
  score: number;
  message: string;
}

// NEW
interface DetectionResult {
  deepfakeScore: number;
  genaiScore: number;
  message: string;
}
```
