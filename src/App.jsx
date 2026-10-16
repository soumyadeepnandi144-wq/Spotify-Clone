import React, { useState, useRef, useEffect } from 'react';
import './Project.css';
import songsData, { handleAudioError } from './data/songs';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  // 1. Song List & Playback State
  const [songs, setSongs] = useState(songsData);
  const [currentTrack, setCurrentTrack] = useState(songsData[0]); // Defaults to Daylight by David Kushner
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(213); // 3:33 in seconds as initial default
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'

  // 2. User Library & Playlists State
  const [likedSongIds, setLikedSongIds] = useState([1]); // Daylight liked initially
  const [playlists, setPlaylists] = useState([
    {
      id: 'pl-1',
      name: 'Coding & Focus Mix',
      songIds: [1, 2, 5],
    },
  ]);

  // 3. Navigation & Views History State
  const [navHistory, setNavHistory] = useState(['home']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const activeView = navHistory[historyIndex] || 'home';

  // 4. Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  // 5. Modals & Notifications
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Audio DOM element reference
  const audioRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  // Trigger toast banner
  const showToast = (message) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Push new view to navigation history
  const navigateToView = (view) => {
    if (view === 'search') {
      setShowSearchInput(true);
    }
    const newHistory = navHistory.slice(0, historyIndex + 1);
    if (newHistory[newHistory.length - 1] !== view) {
      newHistory.push(view);
      setNavHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const handleGoBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleGoForward = () => {
    if (historyIndex < navHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Synchronize audio element with track change
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    const audio = audioRef.current;
    const targetSource = currentTrack.audioUrl || currentTrack.fallbackAudio;

    // Only update if source changed
    if (audio.src !== targetSource && !audio.src.endsWith(targetSource)) {
      audio.src = targetSource;
      audio.currentTime = 0;
      setCurrentTime(0);
      audio.load();

      if (isPlaying) {
        audio
          .play()
          .catch((err) => {
            console.warn('Playback deferred or requires user gesture:', err);
            // If primary audio fails, fall back to fallbackAudio
            handleAudioError(audio, currentTrack.fallbackAudio, true);
          });
      }
    }
  }, [currentTrack]);

  // Volume & Mute Sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Play / Pause Toggle
  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Playback error:', err);
          // Try fallback audio if available
          handleAudioError(audioRef.current, currentTrack.fallbackAudio, true);
          setIsPlaying(true);
        });
    }
  };

  // Select a track from card or playlist
  const handleTrackSelect = (song) => {
    if (currentTrack?.id === song.id) {
      handlePlayPause();
      return;
    }

    setCurrentTrack(song);
    setIsPlaying(true);

    if (audioRef.current) {
      audioRef.current.src = song.audioUrl || song.fallbackAudio;
      audioRef.current.currentTime = 0;
      audioRef.current.load();
      audioRef.current
        .play()
        .catch((err) => {
          console.warn('Track playback fallback triggered:', err);
          handleAudioError(audioRef.current, song.fallbackAudio, true);
        });
    }
  };

  // Next Track Logic
  const handleNextTrack = () => {
    if (!songs.length) return;

    let nextIndex;
    const currentIndex = songs.findIndex((s) => s.id === currentTrack.id);

    if (isShuffle && songs.length > 1) {
      do {
        nextIndex = Math.floor(Math.random() * songs.length);
      } while (nextIndex === currentIndex);
    } else {
      nextIndex = (currentIndex + 1) % songs.length;
    }

    const nextSong = songs[nextIndex];
    handleTrackSelect(nextSong);
  };

  // Previous Track Logic
  const handlePrevTrack = () => {
    if (!songs.length) return;

    // If more than 3 seconds into song, restart it
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    const currentIndex = songs.findIndex((s) => s.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    const prevSong = songs[prevIndex];
    handleTrackSelect(prevSong);
  };

  // Seek bar scrubber
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Volume slider
  const handleVolumeChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleToggleShuffle = () => {
    setIsShuffle((prev) => {
      const next = !prev;
      showToast(next ? 'Shuffle enabled' : 'Shuffle disabled');
      return next;
    });
  };

  const handleToggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') {
        showToast('Repeat all enabled');
        return 'all';
      }
      if (prev === 'all') {
        showToast('Repeat track enabled');
        return 'one';
      }
      showToast('Repeat disabled');
      return 'off';
    });
  };

  // Toggle Like Status
  const handleToggleLike = () => {
    if (!currentTrack) return;
    const trackId = currentTrack.id;
    const isLiked = likedSongIds.includes(trackId);

    if (isLiked) {
      setLikedSongIds((prev) => prev.filter((id) => id !== trackId));
      showToast(`Removed "${currentTrack.title}" from Liked Songs`);
    } else {
      setLikedSongIds((prev) => [...prev, trackId]);
      showToast(`Saved "${currentTrack.title}" to Liked Songs`);
    }
  };

  // Local MP3 File Upload Handler
  const handleFileUpload = (file) => {
    try {
      const objectUrl = URL.createObjectURL(file);
      const title = file.name.replace(/\.[^/.]+$/, ''); // Strip extension

      const newSong = {
        id: `local-${Date.now()}`,
        title: title || 'Custom Uploaded Track',
        artist: 'Local Audio',
        category: 'uploaded',
        cover: '/assets/album_picture.jpeg',
        fallbackCover:
          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
        audioUrl: objectUrl,
        fallbackAudio: objectUrl,
        duration: '0:00',
        info: 'Uploaded local MP3 from your device',
      };

      setSongs((prev) => [newSong, ...prev]);
      setCurrentTrack(newSong);
      setIsPlaying(true);
      showToast(`Now playing uploaded file: "${newSong.title}"`);

      // Set audio source directly to immediately start playback
      if (audioRef.current) {
        audioRef.current.src = objectUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.load();
        audioRef.current.play().catch((err) => {
          console.warn('Uploaded audio play error:', err);
        });
      }
    } catch (err) {
      console.error('File upload error:', err);
      showToast('Error loading audio file. Please try another MP3.');
    }
  };

  // Create Custom Playlist
  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (!newPlaylistTitle.trim()) return;

    const newPlaylist = {
      id: `pl-${Date.now()}`,
      name: newPlaylistTitle.trim(),
      songIds: currentTrack ? [currentTrack.id] : [],
    };

    setPlaylists((prev) => [...prev, newPlaylist]);
    setIsCreatePlaylistOpen(false);
    setNewPlaylistTitle('');
    navigateToView(`playlist-${newPlaylist.id}`);
    showToast(`Created playlist "${newPlaylist.name}"!`);
  };

  // Audio Event Listeners
  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  };

  const onAudioEnded = () => {
    if (repeatMode === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      return;
    }
    if (repeatMode === 'all' || repeatMode === 'off') {
      handleNextTrack();
    }
  };

  const onAudioError = () => {
    if (!currentTrack || !audioRef.current) return;
    console.warn(`Local audio "${currentTrack.audioUrl}" unavailable. Switching to fallback.`);
    handleAudioError(audioRef.current, currentTrack.fallbackAudio, isPlaying);
  };

  const isCurrentTrackLiked = currentTrack ? likedSongIds.includes(currentTrack.id) : false;

  return (
    <>
      {/* Hidden Native HTML5 Audio Controller */}
      <audio
        ref={audioRef}
        src={currentTrack?.audioUrl || currentTrack?.fallbackAudio}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onAudioEnded}
        onError={onAudioError}
        preload="auto"
      />

      {/* Main Grid Wrapper */}
      <div className="main">
        {/* Left Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={navigateToView}
          likedSongIds={likedSongIds}
          playlists={playlists}
          onCreatePlaylistClick={() => setIsCreatePlaylistOpen(true)}
          onSearchClick={() => setShowSearchInput(true)}
        />

        {/* Center / Right Main Content */}
        <MainContent
          songs={songs}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onTrackSelect={handleTrackSelect}
          activeView={activeView}
          setActiveView={navigateToView}
          likedSongIds={likedSongIds}
          playlists={playlists}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showSearchInput={showSearchInput}
          setShowSearchInput={setShowSearchInput}
          onFileUpload={handleFileUpload}
          onExplorePremium={() => showToast('Spotify Premium: Unlimited skips & ad-free audio!')}
          onGoBack={handleGoBack}
          onGoForward={handleGoForward}
          canGoBack={historyIndex > 0}
          canGoForward={historyIndex < navHistory.length - 1}
        />
      </div>

      {/* Bottom Fixed Music Player Bar */}
      <MusicPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isShuffle={isShuffle}
        onToggleShuffle={handleToggleShuffle}
        repeatMode={repeatMode}
        onToggleRepeat={handleToggleRepeat}
        isLiked={isCurrentTrackLiked}
        onToggleLike={handleToggleLike}
        onToggleFullscreen={() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
        }}
      />

      {/* CREATE PLAYLIST MODAL */}
      {isCreatePlaylistOpen && (
        <div className="modal-overlay" onClick={() => setIsCreatePlaylistOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Playlist</h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsCreatePlaylistOpen(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleCreatePlaylist} className="modal-body">
              <input
                type="text"
                className="modal-input"
                placeholder="My Awesome Playlist"
                value={newPlaylistTitle}
                onChange={(e) => setNewPlaylistTitle(e.target.value)}
                autoFocus
                required
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="badge dark-badge"
                  onClick={() => setIsCreatePlaylistOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="badge"
                  style={{ backgroundColor: '#1bd760', color: '#000' }}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST POPUP NOTIFICATION */}
      {toastMessage && (
        <div className="toast-banner">
          <i className="fa-solid fa-circle-check"></i>
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
