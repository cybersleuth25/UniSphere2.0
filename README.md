# UniSphere

> **Stay Updated. Stay Connected.**

UniSphere is a modern, student-centric campus hub designed to streamline university communication. It serves as a centralized platform for announcements, events, resource sharing, lost & found, and community engagement — accessible from both web and mobile.

Originally conceived as a procedural PHP application, UniSphere has been meticulously rebuilt into a robust **Grails 6 MVC** backend with a native **Expo React Native** mobile app.

---

## ✨ Key Features

- **Cross-Platform** — Full-featured Grails web app + native iOS/Android mobile app via Expo
- **JWT + Session Auth** — Secure dual authentication: server sessions for web, JWT tokens for mobile
- **Role-Based Access Control (RBAC)**
  - **Admins** (Student Council/Faculty): Post announcements & events
  - **Students**: Post in Lost & Found, Resources, Courses, and Community groups
- **Real-Time Feed** — Category-filtered posts with search, likes, comments, and image attachments
- **Dark/Light/System Theme** — Persisted theme preference with system auto-detection
- **Profile Management** — Editable profiles with avatar generation, bio, branch & semester info
- **Push Notifications** — In-app notification system with unread tracking
- **Image Uploads** — Multipart file upload for post images and avatars with validation
- **Error Recovery** — Global error boundary prevents white-screen crashes on mobile

---

## 🛠️ Technology Stack

### Backend
| Component | Technology |
|---|---|
| Framework | [Grails 6.2](https://grails.org/) (Groovy + Spring Boot) |
| ORM | GORM (Grails Object Relational Mapping) |
| Database | H2 (dev, MySQL compat mode) / MySQL 8 (production) |
| Auth | JWT ([jjwt](https://github.com/jwtk/jjwt)) + BCrypt + Server Sessions |
| Server | Embedded Tomcat on port `8090` |

### Mobile App
| Component | Technology |
|---|---|
| Framework | [Expo](https://expo.dev/) + React Native (TypeScript) |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based) |
| State | React Context API (Auth + Theme) |
| Storage | expo-secure-store (mobile) / localStorage (web) |
| HTTP | Axios |
| Typography | Cormorant Garamond + Karla (Google Fonts) |

### Web Frontend
| Component | Technology |
|---|---|
| Templates | GSP (Groovy Server Pages) |
| Scripting | Vanilla JavaScript (ES6) |
| Styling | CSS3 (Custom properties, Flexbox/Grid, Keyframe Animations) |
| Markdown | [Marked.js](https://marked.js.org/) |

---

## 📁 Project Structure

```
UniSphere/
├── grails-app/                    # Grails backend
│   ├── grails-app/
│   │   ├── controllers/unisphere/ # REST controllers
│   │   ├── domain/unisphere/      # Domain models (User, Post, Comment, Notification)
│   │   ├── services/unisphere/    # Business logic services
│   │   ├── interceptors/unisphere/# JWT auth interceptor
│   │   ├── conf/                  # application.yml config
│   │   └── views/                 # GSP templates (web UI)
│   ├── build.gradle               # Dependencies & build config
│   └── gradlew                    # Gradle wrapper
├── unisphere-mobile/              # Expo React Native mobile app
│   ├── app/                       # Screens (file-based routing)
│   │   ├── (tabs)/                # Tab screens (Feed, Create, Profile)
│   │   ├── login.tsx              # Auth screens
│   │   ├── signup.tsx
│   │   └── _layout.tsx            # Root layout + auth gate
│   ├── components/                # Reusable components
│   ├── context/                   # AuthContext, ThemeContext
│   ├── constants/                 # Colors, Config (API URL)
│   └── package.json
├── Uploads/                       # User-uploaded images
└── README.md
```

---

## 🚀 Local Development Setup

### Prerequisites
- **Java Development Kit (JDK):** Version 11 or 17
- **Node.js:** Version 18+
- **Expo Go** app on your phone (for mobile testing)

### 1. Start the Backend

```bash
cd grails-app

# Windows
.\gradlew.bat bootRun

# macOS/Linux
./gradlew bootRun
```

The server starts at `http://0.0.0.0:8090`.

### 2. Configure Mobile API URL

Edit `unisphere-mobile/constants/Config.ts` and set your computer's local IP:

```typescript
const DEV_LOCAL_IP = '192.168.x.x';  // ← Your machine's LAN IP
const DEV_PORT = '8090';
```

> **Tip:** Your IP is shown in the Metro output: `Metro waiting on exp://<YOUR_IP>:8081`

### 3. Start the Mobile App

```bash
cd unisphere-mobile
npm install
npx expo start --clear
```

Scan the QR code with Expo Go (Android) or Camera (iOS).

### Seeded Data

`BootStrap.groovy` provisions the database with initial user accounts on first run, including an admin account for testing announcements and events.

---

## 🔒 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/doLogin` | Authenticate user, returns JWT |
| `POST` | `/auth/doSignup` | Register new account |
| `GET` | `/api/posts?postType=X` | List posts by category |
| `POST` | `/api/posts` | Create post (multipart) |
| `PUT` | `/api/posts` | Update post |
| `DELETE` | `/api/posts/:id` | Delete post |
| `POST` | `/api/posts/like` | Like a post |
| `GET/POST` | `/api/posts/comments` | Get/add comments |
| `GET` | `/api/posts/search` | Global search |
| `GET` | `/api/notifications` | User notifications |
| `GET` | `/profile/:username` | View profile |
| `POST` | `/profile/update` | Update profile |
| `GET` | `/uploads/:filename` | Serve uploaded images |

---

## 👤 Author

Developed by **Mihir Misran** as a capstone project.

---

## 📄 License

**All Rights Reserved.**

Copyright © 2026 Mihir Misran. This software and its source code are proprietary and confidential. Unauthorized copying, modification, distribution, or use of this software, in whole or in part, via any medium, is strictly prohibited without explicit written permission from the author.

This project is **not open source**. No license is granted to any party to use, modify, or redistribute this code.
