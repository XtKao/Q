import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  LogOut,
  LogIn,
  Music,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getAuth,
  signOut,
} from 'firebase/firestore';

// Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let db, auth;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.warn('Firebase initialization warning (mock mode):', error);
}

// Mock Data
const MOCK_SONGS = {
  marching_band: [
    { id: '1', title: 'Royal March', artist: 'John Philip Sousa', bandType: 'marching_band', order: 1, createdAt: '2024-01-01T00:00:00Z' },
    { id: '2', title: 'Stars and Stripes', artist: 'John Philip Sousa', bandType: 'marching_band', order: 2, createdAt: '2024-01-02T00:00:00Z' },
  ],
  brass_band: [
    { id: '3', title: 'Ain\'t Misbehavin\'', artist: 'Traditional', bandType: 'brass_band', order: 1, createdAt: '2024-01-01T00:00:00Z' },
    { id: '4', title: 'When the Saints', artist: 'Traditional', bandType: 'brass_band', order: 2, createdAt: '2024-01-02T00:00:00Z' },
  ],
  lukthung: [
    { id: '5', title: 'ลูกทุ่งชีวิต', artist: 'ศิลปิน', bandType: 'lukthung', order: 1, createdAt: '2024-01-01T00:00:00Z' },
    { id: '6', title: 'สีหน้าม่อย', artist: 'ศิลปิน', bandType: 'lukthung', order: 2, createdAt: '2024-01-02T00:00:00Z' },
  ],
};

const MOCK_EVENTS = [
  { id: '1', title: 'Marching Band Practice', location: 'Stadium', time: '18:00', date: '2024-04-20', createdAt: '2024-04-15T00:00:00Z' },
  { id: '2', title: 'Brass Band Competition', location: 'Convention Center', time: '14:00', date: '2024-04-25', createdAt: '2024-04-15T00:00:00Z' },
  { id: '3', title: 'Lukthung Concert', location: 'Concert Hall', time: '20:00', date: '2024-05-01', createdAt: '2024-04-15T00:00:00Z' },
];

// Band Configuration
const BAND_CONFIG = {
  marching_band: {
    label: 'Marching Band (วงโยธวาทิต)',
    gradient: 'from-blue-600 to-indigo-600',
    icon: '🎺',
  },
  brass_band: {
    label: 'Brass Band (แตรวง)',
    gradient: 'from-amber-500 to-orange-500',
    icon: '🎷',
  },
  lukthung: {
    label: 'Lukthung (ลูกทุ่ง)',
    gradient: 'from-pink-500 to-rose-600',
    icon: '🎸',
  },
};

// Utility Functions
const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Main App Component
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loginInput, setLoginInput] = useState('');
  const [loginPasswordInput, setLoginPasswordInput] = useState('');
  const [activeView, setActiveView] = useState('marching_band');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Songs State
  const [songs, setSongs] = useState(MOCK_SONGS);
  const [newSongTitle, setNewSongTitle] = useState('');
  const [newSongArtist, setNewSongArtist] = useState('');

  // Events State
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventTime, setNewEventTime] = useState('');

  // Load data from Firestore on mount
  useEffect(() => {
    const loadData = async () => {
      if (!db) return;
      try {
        // Load songs
        const songsSnapshot = await getDocs(collection(db, 'artifacts/demo/public/data/songs'));
        if (songsSnapshot.size > 0) {
          const loadedSongs = {};
          songsSnapshot.forEach((doc) => {
            const song = doc.data();
            const bandType = song.bandType;
            if (!loadedSongs[bandType]) loadedSongs[bandType] = [];
            loadedSongs[bandType].push({ id: doc.id, ...song });
          });
          Object.keys(loadedSongs).forEach((type) => {
            loadedSongs[type].sort((a, b) => a.order - b.order);
          });
          setSongs(loadedSongs);
        }

        // Load events
        const eventsSnapshot = await getDocs(collection(db, 'artifacts/demo/public/data/events'));
        if (eventsSnapshot.size > 0) {
          const loadedEvents = [];
          eventsSnapshot.forEach((doc) => {
            loadedEvents.push({ id: doc.id, ...doc.data() });
          });
          setEvents(loadedEvents);
        }
      } catch (error) {
        console.warn('Using mock data:', error);
      }
    };

    loadData();
  }, []);

  // Auth Handlers
  const handleLogin = () => {
    if (loginInput === 'KaoKxng' && loginPasswordInput === '15122554') {
      setIsAuthenticated(true);
      setUser('Admin');
      setLoginInput('');
      setLoginPasswordInput('');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  // Song Handlers
  const handleAddSong = async () => {
    if (!newSongTitle.trim() || !newSongArtist.trim()) {
      alert('กรุณากรอกชื่อเพลงและศิลปิน');
      return;
    }

    const newSong = {
      title: newSongTitle,
      artist: newSongArtist,
      bandType: activeView,
      order: (songs[activeView]?.length || 0) + 1,
      createdAt: new Date().toISOString(),
      id: `${Date.now()}`,
    };

    try {
      if (db && isAuthenticated) {
        await addDoc(
          collection(db, 'artifacts/demo/public/data/songs'),
          newSong
        );
      }
      setSongs((prev) => ({
        ...prev,
        [activeView]: [...(prev[activeView] || []), newSong],
      }));
      setNewSongTitle('');
      setNewSongArtist('');
    } catch (error) {
      console.error('Error adding song:', error);
      setSongs((prev) => ({
        ...prev,
        [activeView]: [...(prev[activeView] || []), newSong],
      }));
    }
  };

  const handleDeleteSong = async (songId) => {
    try {
      if (db && isAuthenticated) {
        await deleteDoc(doc(db, 'artifacts/demo/public/data/songs', songId));
      }
      setSongs((prev) => ({
        ...prev,
        [activeView]: prev[activeView].filter((song) => song.id !== songId),
      }));
    } catch (error) {
      console.error('Error deleting song:', error);
      setSongs((prev) => ({
        ...prev,
        [activeView]: prev[activeView].filter((song) => song.id !== songId),
      }));
    }
  };

  const handleReorderSong = async (index, direction) => {
    const newSongs = [...songs[activeView]];
    if (direction === 'up' && index > 0) {
      [newSongs[index], newSongs[index - 1]] = [newSongs[index - 1], newSongs[index]];
    } else if (direction === 'down' && index < newSongs.length - 1) {
      [newSongs[index], newSongs[index + 1]] = [newSongs[index + 1], newSongs[index]];
    }

    newSongs.forEach((song, idx) => {
      song.order = idx + 1;
    });

    try {
      if (db && isAuthenticated) {
        for (const song of newSongs) {
          await updateDoc(doc(db, 'artifacts/demo/public/data/songs', song.id), {
            order: song.order,
          });
        }
      }
      setSongs((prev) => ({
        ...prev,
        [activeView]: newSongs,
      }));
    } catch (error) {
      console.error('Error reordering songs:', error);
      setSongs((prev) => ({
        ...prev,
        [activeView]: newSongs,
      }));
    }
  };

  // Event Handlers
  const handleAddEvent = async () => {
    if (!selectedDate || !newEventTitle.trim() || !newEventLocation.trim() || !newEventTime.trim()) {
      alert('กรุณากรอกข้อมูลเหตุการณ์ให้ครบ');
      return;
    }

    const newEvent = {
      title: newEventTitle,
      location: newEventLocation,
      time: newEventTime,
      date: selectedDate,
      createdAt: new Date().toISOString(),
      id: `${Date.now()}`,
    };

    try {
      if (db && isAuthenticated) {
        await addDoc(
          collection(db, 'artifacts/demo/public/data/events'),
          newEvent
        );
      }
      setEvents((prev) => [...prev, newEvent]);
      setNewEventTitle('');
      setNewEventLocation('');
      setNewEventTime('');
    } catch (error) {
      console.error('Error adding event:', error);
      setEvents((prev) => [...prev, newEvent]);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      if (db && isAuthenticated) {
        await deleteDoc(doc(db, 'artifacts/demo/public/data/events', eventId));
      }
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    }
  };

  // Calendar Rendering
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    const dateStr = formatDate(currentMonth);
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;

    return (
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-xs font-semibold text-slate-400"
          >
            {day}
          </div>
        ))}
        {days.map((day, idx) => {
          const dateString = day
            ? `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            : null;
          const hasEvent = day && events.some((e) => e.date === dateString);
          const isSelected = day && selectedDate === dateString;

          return (
            <button
              key={idx}
              onClick={() => day && setSelectedDate(dateString)}
              className={`h-10 rounded-lg text-sm font-medium transition-all ${
                day === null
                  ? 'opacity-0 pointer-events-none'
                  : isSelected
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
                  : hasEvent
                  ? 'bg-slate-700 text-slate-100 border border-pink-500/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    );
  };

  const upcomingEvents = events
    .filter((e) => e.date >= formatDate(new Date()))
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(0, 5);

  const selectedDateEvents = selectedDate
    ? events.filter((e) => e.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time))
    : [];

  // Main Layout
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:flex-col md:w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 shadow-2xl">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
            🎵 Band Maestro
          </h1>
          <p className="text-xs text-slate-400 mt-1">ระบบจัดการวงดนตรี</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {Object.entries(BAND_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveView(key)}
              className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                activeView === key
                  ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="mr-2">{config.icon}</span>
              {config.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <button
            onClick={() => setActiveView('calendar')}
            className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeView === 'calendar'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Calendar size={18} />
            Calendar
          </button>
        </div>

        <div className="border-t border-slate-800 p-4">
          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="px-3 py-2 bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-400">Logged in as</p>
                <p className="text-sm font-semibold text-green-400">{user}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 text-sm font-medium transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Username"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:border-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPasswordInput}
                onChange={(e) => setLoginPasswordInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleLogin}
                className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
              >
                <LogIn size={16} />
                Login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800 p-4 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-all"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
            🎵 Band Maestro
          </h1>
          <div className="w-10" />
        </div>

        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-2 max-h-80 overflow-y-auto">
            {Object.entries(BAND_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveView(key);
                  setIsSidebarOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                  activeView === key
                    ? `bg-gradient-to-r ${config.gradient} text-white`
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="mr-2">{config.icon}</span>
                {config.label}
              </button>
            ))}
            <button
              onClick={() => {
                setActiveView('calendar');
                setIsSidebarOpen(false);
              }}
              className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeView === 'calendar'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Calendar size={18} />
              Calendar
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Playlist Views */}
          {['marching_band', 'brass_band', 'lukthung'].includes(activeView) && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {BAND_CONFIG[activeView].icon} {BAND_CONFIG[activeView].label}
                </h2>
                <p className="text-slate-400">Manage your song playlist</p>
              </div>

              {/* Add Song Form (Admin Only) */}
              {isAuthenticated && (
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Plus size={18} />
                    Add New Song
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Song Title"
                      value={newSongTitle}
                      onChange={(e) => setNewSongTitle(e.target.value)}
                      className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Artist"
                      value={newSongArtist}
                      onChange={(e) => setNewSongArtist(e.target.value)}
                      className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                  <button
                    onClick={handleAddSong}
                    className={`w-full bg-gradient-to-r ${BAND_CONFIG[activeView].gradient} text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all`}
                  >
                    Add Song
                  </button>
                </div>
              )}

              {/* Songs List */}
              <div className="space-y-3">
                {(songs[activeView] || []).length === 0 ? (
                  <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8 text-center text-slate-400">
                    <Music size={32} className="mx-auto mb-3 opacity-50" />
                    <p>No songs yet. {isAuthenticated ? 'Add one to get started!' : 'Login to add songs.'}</p>
                  </div>
                ) : (
                  (songs[activeView] || []).map((song, idx) => (
                    <div
                      key={song.id}
                      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 flex items-center justify-between hover:border-slate-600 transition-all"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-slate-100">{song.title}</p>
                        <p className="text-sm text-slate-400">{song.artist}</p>
                      </div>
                      {isAuthenticated && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReorderSong(idx, 'up')}
                            disabled={idx === 0}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            onClick={() => handleReorderSong(idx, 'down')}
                            disabled={idx === (songs[activeView]?.length || 0) - 1}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowDown size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteSong(song.id)}
                            className="p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Calendar View */}
          {activeView === 'calendar' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">📅 Event Calendar</h2>
                <p className="text-slate-400">Manage your band events and gigs</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                  <div className="space-y-4">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
                          }
                          className="p-2 hover:bg-slate-700 rounded-lg transition-all"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          onClick={() =>
                            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
                          }
                          className="p-2 hover:bg-slate-700 rounded-lg transition-all"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Calendar Grid */}
                    {renderCalendar()}
                  </div>
                </div>

                {/* Event Details Sidebar */}
                <div className="space-y-6">
                  {/* Add Event Form */}
                  {isAuthenticated && selectedDate && (
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 space-y-4">
                      <h4 className="font-semibold">
                        Add Event ({selectedDate})
                      </h4>
                      <input
                        type="text"
                        placeholder="Event Title"
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={newEventLocation}
                        onChange={(e) => setNewEventLocation(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                      />
                      <input
                        type="time"
                        value={newEventTime}
                        onChange={(e) => setNewEventTime(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                      />
                      <button
                        onClick={handleAddEvent}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all text-sm"
                      >
                        Add Event
                      </button>
                    </div>
                  )}

                  {/* Selected Date Events */}
                  {selectedDate && (
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                      <h4 className="font-semibold mb-3">Events on {selectedDate}</h4>
                      {selectedDateEvents.length === 0 ? (
                        <p className="text-sm text-slate-400">No events on this date</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedDateEvents.map((event) => (
                            <div
                              key={event.id}
                              className="bg-slate-700/50 rounded-lg p-3 space-y-1 text-sm"
                            >
                              <p className="font-semibold text-slate-100">{event.title}</p>
                              <div className="flex items-center gap-2 text-slate-400">
                                <Clock size={14} />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-400">
                                <MapPin size={14} />
                                <span>{event.location}</span>
                              </div>
                              {isAuthenticated && (
                                <button
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="mt-2 w-full px-2 py-1 hover:bg-red-600/20 text-red-400 rounded text-xs transition-all"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Upcoming Events */}
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                    <h4 className="font-semibold mb-3">Upcoming Events</h4>
                    {upcomingEvents.length === 0 ? (
                      <p className="text-sm text-slate-400">No upcoming events</p>
                    ) : (
                      <div className="space-y-2">
                        {upcomingEvents.map((event) => (
                          <div key={event.id} className="bg-slate-700/50 rounded-lg p-3 text-sm">
                            <p className="font-semibold text-slate-100">{event.title}</p>
                            <p className="text-xs text-slate-400">{event.date}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
