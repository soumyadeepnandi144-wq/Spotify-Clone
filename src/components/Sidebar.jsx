import React from 'react';

export default function Sidebar({
  activeView,
  setActiveView,
  likedSongIds,
  playlists,
  onCreatePlaylistClick,
  onSearchClick,
}) {
  return (
    <aside className="sidebar">
      {/* Top Nav: Home & Search */}
      <nav className="nav">
        <div
          className={`nav-option ${activeView === 'home' ? 'active' : ''}`}
          onClick={() => setActiveView('home')}
        >
          <i className="fa-solid fa-house"></i>
          <span>Home</span>
        </div>
        <div
          className={`nav-option ${activeView === 'search' ? 'active' : ''}`}
          onClick={() => {
            setActiveView('search');
            if (onSearchClick) onSearchClick();
          }}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
          <span>Search</span>
        </div>
      </nav>

      {/* Library Section */}
      <section className="library">
        <div className="options">
          <div
            className={`lib-option ${activeView === 'library' ? 'active' : ''}`}
            onClick={() => setActiveView('home')}
          >
            <img
              src="/assets/library_icon.png"
              alt="Library"
              onError={(e) => {
                // If library_icon.png fails, replace with FontAwesome icon
                e.target.style.display = 'none';
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = 'inline-block';
                }
              }}
            />
            <i className="fa-solid fa-book" style={{ display: 'none' }}></i>
            <span>Your Library</span>
          </div>
          <div className="icons">
            <i
              className="fa-solid fa-plus"
              title="Create playlist"
              onClick={onCreatePlaylistClick}
            ></i>
            <i
              className="fa-solid fa-arrow-right"
              title="Enlarge your library"
              onClick={() => setActiveView('home')}
            ></i>
          </div>
        </div>

        {/* Scrollable Library Boxes */}
        <div className="lib-boxes">
          {/* Liked Songs Quick Item */}
          <div
            className={`playlist-item ${activeView === 'liked' ? 'active' : ''}`}
            onClick={() => setActiveView('liked')}
          >
            <div className="playlist-item-left">
              <div className="playlist-liked-icon">
                <i className="fa-solid fa-heart"></i>
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#fff' }}>Liked Songs</div>
                <div style={{ fontSize: '0.72rem', color: '#b3b3b3' }}>
                  Playlist • {likedSongIds.length} {likedSongIds.length === 1 ? 'song' : 'songs'}
                </div>
              </div>
            </div>
            {likedSongIds.length > 0 && (
              <span className="playlist-badge-count">{likedSongIds.length}</span>
            )}
          </div>

          {/* User Custom Playlists */}
          {playlists && playlists.length > 0 && (
            <div className="custom-playlists">
              {playlists.map((pl) => (
                <div
                  key={pl.id}
                  className={`playlist-item ${activeView === `playlist-${pl.id}` ? 'active' : ''}`}
                  onClick={() => setActiveView(`playlist-${pl.id}`)}
                >
                  <div className="playlist-item-left">
                    <i
                      className="fa-solid fa-music"
                      style={{ color: '#1bd760', fontSize: '0.85rem' }}
                    ></i>
                    <span>{pl.name}</span>
                  </div>
                  <span className="playlist-badge-count">{pl.songIds ? pl.songIds.length : 0}</span>
                </div>
              ))}
            </div>
          )}

          {/* Original Box 1: Create Playlist */}
          <div className="box">
            <p className="box-p1">Create your first playlist</p>
            <p className="box-p2">It's easy, we'll help you</p>
            <button className="badge" onClick={onCreatePlaylistClick}>
              Create playlist
            </button>
          </div>

          {/* Original Box 2: Browse Podcasts */}
          <div className="box2">
            <p className="box-p1">Let's find some podcasts to follow</p>
            <p className="box-p2">We'll keep you updated on new episodes</p>
            <button
              className="badge dark-badge"
              onClick={() => setActiveView('podcasts')}
            >
              Browse podcasts
            </button>
          </div>
        </div>
      </section>
    </aside>
  );
}
