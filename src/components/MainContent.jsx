import React, { useState } from 'react';
import StickyNav from './StickyNav';
import { handleImgError } from '../data/songs';

export default function MainContent({
  songs,
  currentTrack,
  isPlaying,
  onTrackSelect,
  activeView,
  setActiveView,
  likedSongIds,
  playlists,
  searchQuery,
  setSearchQuery,
  showSearchInput,
  setShowSearchInput,
  onFileUpload,
  onExplorePremium,
  onGoBack,
  onGoForward,
  canGoBack,
  canGoForward,
}) {
  const [activeTab, setActiveTab] = useState('all');

  // Filter songs based on search query
  const searchFilteredSongs = songs.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      (s.info && s.info.toLowerCase().includes(q))
    );
  });

  // Categorized songs for home view
  const recentlyPlayed = songs.filter((s) => s.category === 'recently-played');
  const trendingSongs = songs.filter((s) => s.category === 'trending');
  const chartSongs = songs.filter((s) => s.category === 'charts');
  const uploadedSongs = songs.filter((s) => s.category === 'uploaded');

  // Liked songs
  const likedSongs = songs.filter((s) => likedSongIds.includes(s.id));

  // Current custom playlist if in playlist view
  let currentPlaylist = null;
  let playlistSongs = [];
  if (activeView.startsWith('playlist-')) {
    const playlistId = activeView.replace('playlist-', '');
    currentPlaylist = playlists.find((p) => p.id === playlistId);
    if (currentPlaylist) {
      playlistSongs = songs.filter((s) => currentPlaylist.songIds?.includes(s.id));
    }
  }

  // Render a single song card
  const renderCard = (song) => {
    const isThisTrackPlaying = currentTrack?.id === song.id && isPlaying;
    const isThisTrackCurrent = currentTrack?.id === song.id;

    return (
      <div
        key={song.id}
        className={`card ${isThisTrackCurrent ? 'active-playing' : ''}`}
        onClick={() => onTrackSelect(song)}
      >
        <div className="card-img-wrapper">
          <img
            src={song.cover}
            className="card-img"
            alt={song.title}
            onError={(e) => handleImgError(e, song.fallbackCover)}
          />
          <button
            className="play-hover-btn"
            title={isThisTrackPlaying ? 'Pause' : 'Play'}
            onClick={(e) => {
              e.stopPropagation();
              onTrackSelect(song);
            }}
          >
            <i className={`fa-solid ${isThisTrackPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
        </div>
        <p className={`card-title ${isThisTrackCurrent ? 'playing-highlight' : ''}`}>
          {song.title}
        </p>
        <p className="card-info">{song.info || song.artist}</p>
      </div>
    );
  };

  return (
    <main className="main-content">
      {/* Sticky Top Navigation */}
      <StickyNav
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSearchInput={showSearchInput}
        setShowSearchInput={setShowSearchInput}
        onFileUpload={onFileUpload}
        onExplorePremium={onExplorePremium}
        onGoBack={onGoBack}
        onGoForward={onGoForward}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
      />

      {/* SEARCH RESULTS VIEW */}
      {(searchQuery.trim().length > 0 || activeView === 'search') && (
        <section>
          <div className="section-header">
            <h2>
              {searchQuery.trim()
                ? `Results for "${searchQuery}"`
                : 'Browse All Tracks'}
            </h2>
            <span className="show-all-link">
              {searchFilteredSongs.length} {searchFilteredSongs.length === 1 ? 'song' : 'songs'}
            </span>
          </div>

          {searchFilteredSongs.length === 0 ? (
            <div className="empty-state">
              <i className="fa-solid fa-magnifying-glass"></i>
              <h3>No songs found for "{searchQuery}"</h3>
              <p>Please check your spelling or upload an MP3 track using the "Add MP3" button above.</p>
            </div>
          ) : (
            <div className="card-container">
              {searchFilteredSongs.map(renderCard)}
            </div>
          )}
        </section>
      )}

      {/* LIKED SONGS VIEW */}
      {searchQuery.trim().length === 0 && activeView === 'liked' && (
        <section>
          <div className="section-header">
            <h2>Liked Songs</h2>
            <span className="show-all-link">
              {likedSongs.length} {likedSongs.length === 1 ? 'song' : 'songs'}
            </span>
          </div>

          {likedSongs.length === 0 ? (
            <div className="empty-state">
              <i className="fa-regular fa-heart"></i>
              <h3>Songs you like will appear here</h3>
              <p>Save songs by tapping the heart icon in the music player bar.</p>
            </div>
          ) : (
            <div className="card-container">
              {likedSongs.map(renderCard)}
            </div>
          )}
        </section>
      )}

      {/* CUSTOM PLAYLIST VIEW */}
      {searchQuery.trim().length === 0 && activeView.startsWith('playlist-') && currentPlaylist && (
        <section>
          <div className="section-header">
            <h2>{currentPlaylist.name}</h2>
            <span className="show-all-link">
              {playlistSongs.length} {playlistSongs.length === 1 ? 'song' : 'songs'}
            </span>
          </div>

          {playlistSongs.length === 0 ? (
            <div className="empty-state">
              <i className="fa-solid fa-music"></i>
              <h3>This playlist is currently empty</h3>
              <p>Add songs to your playlist or upload new MP3 tracks.</p>
            </div>
          ) : (
            <div className="card-container">
              {playlistSongs.map(renderCard)}
            </div>
          )}
        </section>
      )}

      {/* HOME VIEW */}
      {searchQuery.trim().length === 0 && activeView === 'home' && (
        <>
          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button
              className={`filter-chip ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button
              className={`filter-chip ${activeTab === 'music' ? 'active' : ''}`}
              onClick={() => setActiveTab('music')}
            >
              Music
            </button>
            <button
              className={`filter-chip ${activeTab === 'podcasts' ? 'active' : ''}`}
              onClick={() => setActiveTab('podcasts')}
            >
              Podcasts
            </button>
          </div>

          {/* Section: Uploaded Tracks (if any) */}
          {uploadedSongs.length > 0 && (
            <section>
              <div className="section-header">
                <h2>Your Uploaded Tracks</h2>
                <span className="show-all-link">Local Audio</span>
              </div>
              <div className="card-container">
                {uploadedSongs.map(renderCard)}
              </div>
            </section>
          )}

          {/* Section 1: Recently Played */}
          {(activeTab === 'all' || activeTab === 'music') && (
            <section>
              <div className="section-header">
                <h2>Recently Played</h2>
                <span className="show-all-link">Show all</span>
              </div>
              <div className="card-container">
                {recentlyPlayed.map(renderCard)}
              </div>
            </section>
          )}

          {/* Section 2: Trending now near you */}
          {(activeTab === 'all' || activeTab === 'music') && (
            <section>
              <div className="section-header">
                <h2>Trending now near you</h2>
                <span className="show-all-link">Show all</span>
              </div>
              <div className="card-container">
                {trendingSongs.map(renderCard)}
              </div>
            </section>
          )}

          {/* Section 3: Featured Charts */}
          {(activeTab === 'all' || activeTab === 'music') && (
            <section>
              <div className="section-header">
                <h2>Featured Charts</h2>
                <span className="show-all-link">Show all</span>
              </div>
              <div className="card-container">
                {chartSongs.map(renderCard)}
              </div>
            </section>
          )}

          {/* Section for Podcasts tab */}
          {activeTab === 'podcasts' && (
            <section>
              <div className="section-header">
                <h2>Popular Podcasts</h2>
                <span className="show-all-link">Show all</span>
              </div>
              <div className="empty-state">
                <i className="fa-solid fa-podcast"></i>
                <h3>New podcasts dropping soon</h3>
                <p>Stay tuned for handpicked stories, news, and developer audio shows.</p>
              </div>
            </section>
          )}
        </>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="line"></div>
        <p className="footer-text">
          Spotify Clone • Built with <span style={{ color: '#1bd760' }}>React & Vite</span> • Designed for pairing with your local MP3 library.
        </p>
      </footer>
    </main>
  );
}
