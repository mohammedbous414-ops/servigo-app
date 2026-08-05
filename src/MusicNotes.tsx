import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Plus, Trash2, FileText, Volume2 } from 'lucide-react';

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

  const [tracks] = useState<Track[]>([
    { id: 1, title: "Mon Morceau 01", artist: "Mon Studio", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { id: 2, title: "Beat & Melody 02", artist: "Pro-Studio", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { id: 3, title: "Inspiration Flow", artist: "Rayan Music", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  ]);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('app_notes');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Idée de Chanson', content: 'Écrire un refrain sur le rythme de la guitare...', date: 'Aujourd\'hui' }
    ];
  });

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    localStorage.setItem('app_notes', JSON.stringify(notes));
  }, [notes]);

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
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(false);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(false);
  };

  const addNote = () => {
    if (!newTitle.trim() && !newContent.trim()) return;
    const newNote: Note = {
      id: Date.now(),
      title: newTitle || 'Sans titre',
      content: newContent,
      date: new Date().toLocaleDateString('fr-FR')
    };
    setNotes([newNote, ...notes]);
    setNewTitle('');
    setNewContent('');
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-between p-4 max-w-md mx-auto select-none">
      
      <audio
        ref={audioRef}
        src={tracks[currentTrackIndex].url}
        onEnded={nextTrack}
      />

      {/* Header */}
      <div className="w-full bg-slate-900 border border-blue-900/50 p-4 rounded-2xl flex items-center justify-between shadow-lg mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-xl">
            <Music size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-wider text-blue-400">STUDIO NOTE & MUSIC</h1>
            <p className="text-[10px] text-slate-400">Musique & Prise de notes</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full flex bg-slate-900 p-1 rounded-xl border border-slate-800 mb-4">
        <button
          onClick={() => setActiveTab('player')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
            activeTab === 'player' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Volume2 size={16} /> Musique
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
            activeTab === 'notes' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText size={16} /> Mémorandum ({notes.length})
        </button>
      </div>

      {/* Music Player Tab */}
      {activeTab === 'player' && (
        <div className="w-full flex-1 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
            <div className={`absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-900 rounded-full blur-xl opacity-40 ${isPlaying ? 'animate-pulse' : ''}`}></div>
            <div className={`w-44 h-44 bg-slate-900 border-4 border-blue-500/50 rounded-full flex items-center justify-center shadow-2xl ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '10s' }}>
              <div className="w-16 h-16 bg-slate-950 border-2 border-blue-400 rounded-full flex items-center justify-center">
                <Music size={24} className="text-blue-400" />
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-white">{tracks[currentTrackIndex].title}</h2>
            <p className="text-xs text-blue-400 font-medium">{tracks[currentTrackIndex].artist}</p>
          </div>

          <div className="flex items-center justify-center gap-6 mb-8">
            <button onClick={prevTrack} className="p-3 bg-slate-900 hover:bg-slate-800 rounded-full border border-slate-800 text-blue-400 active:scale-95">
              <SkipBack size={22} />
            </button>
            <button onClick={togglePlay} className="p-5 bg-blue-600 hover:bg-blue-500 rounded-full text-white shadow-lg shadow-blue-600/40 active:scale-95">
              {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>
            <button onClick={nextTrack} className="p-3 bg-slate-900 hover:bg-slate-800 rounded-full border border-slate-800 text-blue-400 active:scale-95">
              <SkipForward size={22} />
            </button>
          </div>

          <div className="w-full bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3">
            <h3 className="text-xs font-bold text-slate-400 mb-2 px-1">Ma Playlist:</h3>
            <div className="space-y-1 max-h-36 overflow-y-auto">
              {tracks.map((t, idx) => (
                <div
                  key={t.id}
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setIsPlaying(true);
                    setTimeout(() => audioRef.current?.play(), 100);
                  }}
                  className={`p-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition ${
                    idx === currentTrackIndex ? 'bg-blue-600/20 border border-blue-500/40 text-blue-300' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="font-semibold">{t.title}</span>
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
              placeholder="Titre de la note / chanson..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 mb-2"
            />
            <textarea
              placeholder="Écrivez vos notes, paroles ou idées ici..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 resize-none mb-2"
            />
            <button
              onClick={addNote}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 active:scale-95"
            >
              <Plus size={16} /> Enregistrer la Note
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 max-h-60 pr-1">
            {notes.length === 0 ? (
              <p className="text-center text-xs text-slate-500 mt-6">Aucune note enregistrée.</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="bg-slate-900 border border-slate-800/80 p-3 rounded-2xl relative group">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-bold text-blue-400">{note.title}</h4>
                    <span className="text-[9px] text-slate-500">{note.date}</span>
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="mt-2 text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Supprimer
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="w-full text-center mt-4 text-[10px] text-slate-600">
        Studio Note & Music App • 2026
      </div>
    </div>
  );
              }
          
