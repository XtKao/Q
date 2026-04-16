# 🎵 Band Maestro - ระบบจัดการวงดนตรี

A modern Single Page Application (SPA) for managing song playlists and gig schedules for different types of bands. Built with React, Tailwind CSS, and Firebase.

---

## 📋 Features

### 1. **Playlist Management** 🎶
- Support for 3 band types:
  - **Marching Band** (วงโยธวาทิต) - Blue/Indigo theme
  - **Brass Band** (แตรวง) - Orange/Amber theme
  - **Lukthung** (ลูกทุ่ง) - Pink/Rose theme
- Add new songs with title and artist
- Reorder songs (Move Up/Down)
- Delete songs
- Real-time data persistence with Firestore

### 2. **Event Calendar** 📅
- Monthly calendar view
- Click dates to select and view/add events
- Add events with:
  - Event title
  - Location
  - Time
  - Date
- View upcoming events (next 5 events)
- Delete events
- Real-time sync with Firestore

### 3. **Authentication** 🔐
- **Viewer Mode** (Anonymous): View-only access to songs and events
- **Admin Mode** (Logged in): Full CRUD operations
- Mock credentials for demo:
  - Username: `KaoKxng`
  - Password: `15122554`

### 4. **Responsive Design** 📱
- Desktop: Full sidebar navigation
- Mobile: Hamburger menu
- Tablet: Optimized layout
- Dark mode with glassmorphism effects

---

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Backend**: Firebase (Firestore + Auth)
- **Real-time**: Firestore listeners

---

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd Q
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Firebase**
   - Update `firebaseConfig` in `src/App.jsx` with your Firebase credentials
   - Create Firestore collections:
     - `artifacts/{appId}/public/data/songs`
     - `artifacts/{appId}/public/data/events`

4. **Run development server**
```bash
npm run dev
```
   - Application opens at `http://localhost:3000`

5. **Build for production**
```bash
npm run build
```

---

## 🎨 Design System

### Color Palette
- **Background**: `#0a0a0a`, `#111111` (Slate 950)
- **Neutral**: Zinc/Slate colors with glassmorphism
- **Band Accents**:
  - Marching Band: `from-blue-600 to-indigo-600`
  - Brass Band: `from-amber-500 to-orange-500`
  - Lukthung: `from-pink-500 to-rose-600`

### Components
- Rounded corners: `rounded-2xl`, `rounded-3xl`
- Backdrop blur: Glassmorphism effect
- Hover states: Smooth transitions
- Icons: Lucide React library

---

## 📂 Project Structure

```
Q/
├── src/
│   ├── App.jsx          # Main component (all logic)
│   ├── main.jsx         # React entry point
│   └── index.css        # Global Tailwind styles
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── README.md            # This file
```

---

## 🚀 Usage

### Adding a Song
1. ✅ Login as Admin (KaoKxng / 15122554)
2. Select a band type from sidebar
3. Fill in "Song Title" and "Artist"
4. Click "Add Song"

### Managing Playlist
- **Move Up/Down**: Click arrow buttons to reorder
- **Delete**: Click trash icon to remove song
- Changes sync to Firestore in real-time

### Creating Events
1. ✅ Login as Admin
2. Click "Calendar" in sidebar
3. Click a date on the calendar
4. Fill in event details (Title, Location, Time)
5. Click "Add Event"

### Viewing Events
- Click any date to see events for that day
- Scroll "Upcoming Events" to see next 5 events
- Events with dates are highlighted on calendar

---

## 🔑 Firebase Integration

### Collection Structure
```
artifacts/
└── {appId}/
    └── public/
        └── data/
            ├── songs/{songId}
            │   ├── title: string
            │   ├── artist: string
            │   ├── bandType: string
            │   ├── order: number
            │   └── createdAt: timestamp
            │
            └── events/{eventId}
                ├── title: string
                ├── location: string
                ├── time: string
                ├── date: string (YYYY-MM-DD)
                └── createdAt: timestamp
```

### Notes
- All queries are simple (no `orderBy()` or `where()` filters)
- Data is sorted/filtered in memory using JavaScript
- This prevents indexing errors and keeps queries simple

---

## 📝 Environment Variables

Create a `.env.local` file in the root directory with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Important Security Notes:**
- ✅ `.env.local` is listed in `.gitignore` and will NOT be committed
- ✅ Use `.env.example` as a template for required variables
- ❌ Never commit `.env.local` or hardcode secrets in source files
- ❌ Never share API keys in public repositories

---

## 🎯 Features Roadmap

- [ ] User authentication with Firebase Auth
- [ ] Export playlist as PDF
- [ ] Push notifications for upcoming events
- [ ] Band member management
- [ ] Performance analytics
- [ ] Multi-language support (Thai/English)

---

## 🐛 Troubleshooting

### App won't load
- Check browser console for errors
- Ensure Firebase config is correct
- Clear browser cache and reload

### Firebase errors
- Verify Firestore collections exist
- Check Firebase security rules allow public read/write
- Ensure appId matches your Firebase project

### Styles not loading
- Run `npm run build` and check `dist/` folder
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Tailwind config includes correct content paths

---

## 📄 License

MIT License - Feel free to use this project!

---

## 👨‍💻 Author

Built with ❤️ for Band Maestro

For issues or suggestions, please create an issue on GitHub.

---

## 📞 Support

- **Documentation**: See comments in `src/App.jsx`
- **Firebase Docs**: https://firebase.google.com/docs
- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com/docs

---

**Happy Performing! 🎶🎵**