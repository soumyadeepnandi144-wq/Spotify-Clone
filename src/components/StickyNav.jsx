import React, { useRef } from 'react';

export default function StickyNav({
  searchQuery,
  setSearchQuery,
  showSearchInput,
  setShowSearchInput,
  onFileUpload,
  onGoBack,
  onGoForward,
  canGoBack,
  canGoForward,
  onExplorePremium,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      onFileUpload(file);
      // Reset input so the same file can be uploaded again if needed
      e.target.value = '';
    }
  };

  return (
    <div className="sticky-nav">
      {/* Navigation history icons & optional live search */}
      <div className="sticky-nav-icons">
        <button
          className="nav-circle-btn"
          onClick={onGoBack}
          title="Go back"
          style={{ opacity: canGoBack ? 1 : 0.4, cursor: canGoBack ? 'pointer' : 'not-allowed' }}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button
          className="nav-circle-btn"
          onClick={onGoForward}
          title="Go forward"
          style={{ opacity: canGoForward ? 1 : 0.4, cursor: canGoForward ? 'pointer' : 'not-allowed' }}
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>

        {/* Live Search Input Field */}
        {showSearchInput && (
          <div className="nav-search-container">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              className="nav-search-input"
              placeholder="What do you want to play?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                className="nav-search-clear"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Sticky nav right actions */}
      <div className="sticky-nav-options">
        {/* Local MP3 Upload Button */}
        <label
          className="badge"
          title="Upload & play any local .mp3 from your PC"
          style={{ backgroundColor: '#1bd760', color: '#000', cursor: 'pointer' }}
        >
          <i className="fa-solid fa-cloud-arrow-up"></i>
          <span>Add MP3</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </label>

        {/* Explore Premium */}
        <button
          className="badge hide-mobile"
          onClick={onExplorePremium}
          title="Explore Premium Plans"
        >
          Explore Premium
        </button>

        {/* Install App */}
        <button
          className="badge dark-badge hide-mobile"
          title="Install Spotify Desktop App"
          onClick={() => window.open('https://www.spotify.com/download', '_blank')}
        >
          <i className="fa-regular fa-circle-down"></i>
          <span>Install App</span>
        </button>

        {/* User Profile */}
        <button className="nav-circle-btn user-btn" title="Profile">
          <i className="fa-regular fa-user"></i>
        </button>
      </div>
    </div>
  );
}
