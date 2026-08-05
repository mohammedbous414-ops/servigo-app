import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Plus, Trash2, FileText, Disc, Upload, Sparkles, Volume2 } from 'lucide-react';

interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
}

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
}

export default function MusicNotesApp() {
  const [activeTab, setActiveTab] = useState<'player' | 'notes'>('player');

  const [tracks, setTracks] = useState<Track[]>([
    { id: 1, title: "Studio Demo Track", artist: "Beat & Note", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  ]);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Mémorandum / Notes
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('app_notes');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'فكرة أغنية جديدة 🎵', content: 'كتابة الكلمات على إيقاع السول والفانك...', date: 'اليوم' }
    ];
  });

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    localStorage.setItem('app_notes', JSON.stringify(notes));
  }, [notes]);

  // Ajouter un fichier audio depuis le téléphone (Lark Player files / Local files)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const newTrack: Track = {
        id: Date.now(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "من هاتفي",
        url: fileUrl
      };
      setTracks([newTrack, ...tracks]);
      setCurrentTrackIndex(0);
      setIsPlaying(true);
      setTimeout(() => audioRef.current?.play(), 100);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (tracks.length === 0) return;
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(false);
  };

  const prevTrack = () => {
    if (tracks.length === 0) return;
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(false);
  };

  const addNote = () => {
    if (!newTitle.trim() && !newContent.trim()) return;
    const newNote: Note = {
      id: Date.now(),
      title: newTitle || 'ملاحظة جديدة',
      content: newContent,
      date: new Date().toLocaleDateString('ar-MA')
    };
    setNotes([newNote, ...notes]);
    setNewTitle('');
    setNewContent('');
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-between p-4 max-w-md mx-auto select-none font-sans">
      
      <audio
        ref={audioRef}
        src={tracks[currentTrackIndex]?.url}
        onEnded={nextTrack}
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="audio/*"
        className="hidden"
      />

      {/* Modern Neon Header with New Logo */}
      <div className="w-full bg-gradient-to-r from-purple-900/40 via-slate-900 to-indigo-900/40 border border-purple-500/30 p-4 rounded-3xl flex items-center justify-between shadow-2xl backdrop-blur-md mb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/30">
            <Disc size={26} className={`text-white ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
            <Sparkles size={14} className="text-cyan-300 absolute -top-1 -right-1 animate-bounce" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              BEAT & NOTE
            </h1>
            <p className="text-[10px] text-purple-300/70 font-medium">Create • Play • Capture</p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="w-full flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 mb-4 shadow-inner">
        <button
          onClick={() => setActiveTab('player')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
            activeTab === 'player' 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Volume2 size={16} /> مشغل الموسيقى
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
            activeTab === 'notes' 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText size={16} /> المذكرات ({notes.length})
        </button>
      </div>

      {/* Player Tab */}
      {activeTab === 'player' && (
        <div className="w-full flex-1 flex flex-col items-center justify-center">
          
          {/* Animated Vinyl/CD Player Graphic */}
          <div className="relative w-48 h-48 mb-4 flex items-center justify-center">
            <div className={`absolute inset-0 bg-gradient-to-tr from-purple-600 via-pink-600 to-cyan-500 rounded-full blur-2xl opacity-30 ${isPlaying ? 'animate-pulse' : ''}`}></div>
            <div className={`w-44 h-44 bg-slate-900 border-4 border-purple-500/40 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }}>
              <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_30%,_rgba(255,255,255,0.05)_70%)]"></div>
              <div className="w-16 h-16 bg-slate-950 border-2 border-cyan-400 rounded-full flex items-center justify-center z-10 shadow-inner">
                <Music size={24} className="text-cyan-400" />
              </div>
            </div>
          </div>

          <div className="text-center mb-4">
            <h2 className="text-base font-bold text-white px-2 truncate max-w-[260px]">
              {tracks[currentTrackIndex]?.title || "لا توجد أغنية"}
            </h2>
            <p className="text-xs text-purple-400 font-medium mt-0.5">
              {tracks[currentTrackIndex]?.artist || "إختر مقطعاً صوتياً"}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <button onClick={prevTrack} className="p-3 bg-slate-900 hover:bg-slate-800 rounded-2xl border border-slate-800 text-purple-400 active:scale-95 transition">
              <SkipBack size={20} />
            </button>
            <button onClick={togglePlay} className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl text-white shadow-xl shadow-purple-600/40 active:scale-95 transition">
              {isPlaying ? <Pause size={26} /> : <Play size={26} className="ml-1" />}
            </button>
            <button onClick={nextTrack} className="p-3 bg-slate-900 hover:bg-slate-800 rounded-2xl border border-slate-800 text-purple-400 active:scale-95 transition">
              <SkipForward size={20} />
            </button>
          </div>

          {/* Add Local File Button (Lark Player support) */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full mb-3 py-3 bg-slate-900/90 border border-purple-500/40 hover:bg-purple-900/20 text-purple-300 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 active:scale-95 shadow-lg transition"
          >
            <Upload size={16} className="text-cyan-400" /> إضافة أغنية من الهاتف / Lark Player
          </button>

          {/* Playlist */}
          <div className="w-full bg-slate-900/70 border border-slate-800 rounded-2xl p-3 backdrop-blur-sm">
            <h3 className="text-xs font-bold text-slate-400 mb-2 px-1">قائمة الأغاني ({tracks.length}):</h3>
            <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
              {tracks.map((t, idx) => (
                <div
                  key={t.id}
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setIsPlaying(true);
                    setTimeout(() => audioRef.current?.play(), 100);
                  }}
                  className={`p-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition ${
                    idx === currentTrackIndex 
                      ? 'bg-purple-600/20 border border-purple-500/50 text-purple-300 font-bold' 
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="truncate max-w-[180px]">{t.title}</span>
                  <span className="text-[10px] text-slate-500">{t.artist}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div className="w-full flex-1 flex flex-col">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 mb-4 shadow-md">
            <input
              type="text"
              placeholder="عنوان الملاحظة / الأغنية..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 mb-2"
            />
            <textarea
              placeholder="اكتب أفكارك، الكلمات، أو النوتات هنا..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 resize-none mb-2"
            />
            <button
              onClick={addNote}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 active:scale-95 shadow-lg shadow-purple-600/30"
            >
              <Plus size={16} /> حفظ الملاحظة
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 max-h-60 pr-1">
            {notes.length === 0 ? (
              <p className="text-center text-xs text-slate-500 mt-6">لا توجد ملاحظات محفوظة.</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl relative group shadow-md">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-bold text-purple-400">{note.title}</h4>
                    <span className="text-[9px] text-slate-500">{note.date}</span>
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="mt-2 text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <Trash2 size={12} /> حذف
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="w-full text-center mt-2 text-[10px] text-slate-600">
        BEAT & NOTE Studio App • Edition 2026
      </div>
    </div>
  );
          }
