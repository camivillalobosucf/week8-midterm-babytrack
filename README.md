# BabyTrack

A mobile-first baby tracking app for logging feedings, diapers, sleep, and diary entries — with real-time sync, charts, and bilingual support (EN/ES).

**Live app:** [https://babytrackmidterm.netlify.app/](https://babytrackmidterm.netlify.app/)

---

## Features

- **Feeding tracker** — log breast/bottle feedings with side, duration, and amount
- **Diaper tracker** — record wet, dirty, or mixed changes
- **Sleep tracker** — track sleep sessions with duration and quality
- **Diary** — free-text entries with tags and tag-based filtering
- **Dashboard** — summary cards, 7-day bar charts, and recent activity feed
- **Baby profile** — name, date of birth, medical info, emoji personalization
- **Gender color themes** — pink (girl), blue (boy), orange (neutral)
- **Dark mode** — system-aware with no flash on load
- **Bilingual** — English and Spanish (Latin America)
- **Real-time sync** — all data updates instantly via Firestore `onSnapshot`

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with **Authentication** (Email/Password) and **Firestore** enabled

### Installation

```bash
git clone <repo-url>
cd week8-midterm-babytrack
npm install
```

### Environment Variables

Create a `.env.local` file in the project root (never commit this file):

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Run Locally

```bash
npm run dev
```

App runs at [http://localhost:5173](http://localhost:5173).

### Production Build

```bash
npm run build
```

Output goes to `dist/`.

---

## Firestore Security Rules

All data is scoped to the authenticated user. Apply these rules in the Firebase console:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18 + Vite 6 |
| Routing | react-router-dom v6 |
| Backend / Auth | Firebase 11 (Auth + Firestore) |
| Charts | Recharts |
| Styling | Plain CSS (custom properties) |
| i18n | Custom context (no library) |
| Hosting | Netlify |

---

## Usage

1. **Register** with an email and password, or log in if you already have an account.
2. **Set up your baby's profile** — enter a name, date of birth, gender, and any medical details.
3. **Log entries** from the Dashboard (quick-add buttons) or the Entries page.
4. **View the Diary** to write notes and filter by tag.
5. **Switch language** between English and Spanish from the Profile page.
6. **Toggle dark mode** using the moon/sun icon in the top navigation bar.
7. Entries sync in real time across devices when logged in to the same account.
