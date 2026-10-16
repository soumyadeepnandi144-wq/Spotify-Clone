import React from 'react';
import { handleImgError } from '../data/songs';

// Utility helper to format seconds as MM:SS
export const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || timeInSeconds === null || timeInSeconds === undefined) {
    return '0:00';
  }
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default function MusicPlayer({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  isShuffle,
  onToggleShuffle,
  repeatMode,
  onToggleRepeat,
  isLiked,
  onToggleLike,
  onToggleFullscreen,
}) {
  return (
    <div className="music-player">
      {/* 1. ALBUM SECTION (25%) */}
      <div className="album">
        <img
          src={currentTrack?.cover || '/assets/album_picture.jpeg'}
          alt={currentTrack?.title || 'Track Cover'}
          className="album-img"
          onError={(e) => handleImgError(e, currentTrack?.fallbackCover)}
        />
        <div className="album-details">
          <div className="album-title" title={currentTrack?.title}>
            {currentTrack?.title || 'Daylight'}
          </div>
          <div className="album-artist" title={currentTrack?.artist}>
            {currentTrack?.artist || 'David Kushner'}
          </div>
        </div>
        <div className="album-icons">
          <button
            className={`album-icon ${isLiked ? 'liked' : ''}`}
            onClick={onToggleLike}
            title={isLiked ? 'Remove from Your Library' : 'Save to Your Library'}
          >
            <i className={isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
          </button>
          <button
            className="album-icon hide-mobile"
            title="Picture in picture"
            onClick={() => {
              if (document.pictureInPictureEnabled) {
                // optional pip handler
              }
            }}
          >
            <i className="fa-regular fa-square-caret-right"></i>
          </button>
        </div>
      </div>

      {/* 2. PLAYER SECTION (50%) */}
      <div className="player">
        <div className="player-controls">
          {/* Shuffle Button */}
          <button
            className={`player-control-icon ${isShuffle ? 'active-mode' : ''}`}
            onClick={onToggleShuffle}
            title={isShuffle ? 'Disable shuffle' : 'Enable shuffle'}
          >
            <i className="fa-solid fa-shuffle"></i>
          </button>

          {/* Previous Track */}
          <button
            className="player-control-icon"
            onClick={onPrev}
            title="Previous"
          >
            <i className="fa-solid fa-backward-step"></i>
          </button>

          {/* Play / Pause Main Circle */}
          <button
            className="play-btn-circle"
            onClick={onPlayPause}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>

          {/* Next Track */}
          <button
            className="player-control-icon"
            onClick={onNext}
            title="Next"
          >
            <i className="fa-solid fa-forward-step"></i>
          </button>

          {/* Repeat Mode Button */}
          <button
            className={`player-control-icon ${repeatMode !== 'off' ? 'active-mode' : ''}`}
            onClick={onToggleRepeat}
            title={
              repeatMode === 'one'
                ? 'Repeat One (Click for Off)'
                : repeatMode === 'all'
                ? 'Repeat All (Click for Repeat One)'
                : 'Enable repeat'
            }
          >
            <i className={`fa-solid ${repeatMode === 'one' ? 'fa-repeat fa-spin-pulse' : 'fa-repeat'}`}></i>
          </button>
        </div>

        {/* Seek / Progress Bar */}
        <div className="playback-bar">
          <span className="curr-time">{formatTime(currentTime)}</span>
          <input
            type="range"
            className="progress-bar"
            min="0"
            max={duration && !isNaN(duration) ? duration : 100}
            step="0.5"
            value={currentTime}
            onChange={onSeek}
            title="Seek playback"
          />
          <span className="tot-time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* 3. CONTROLS SECTION (25%) */}
      <div className="controls">
        <button className="control-icon" title="Now playing view">
          <i className="fa-regular fa-circle-play"></i>
        </button>
        <button className="control-icon" title="Lyrics">
          <i className="fa-solid fa-microphone-lines"></i>
        </button>
        <button className="control-icon" title="Queue">
          <i className="fa-solid fa-bars-staggered"></i>
        </button>
        <button className="control-icon" title="Connect to a device">
          <i className="fa-solid fa-computer"></i>
        </button>

        {/* Volume Slider & Mute Toggle */}
        <div className="volume-container">
          <button
            className="control-icon"
            onClick={onToggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <i
              className={`fa-solid ${
                isMuted || volume === 0
                  ? 'fa-volume-xmark'
                  : volume < 50
                  ? 'fa-volume-low'
                  : 'fa-volume-high'
              }`}
            ></i>
          </button>
          <input
            type="range"
            className="volume-bar"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={onVolumeChange}
            title="Adjust volume"
          />
        </div>

        {/* Fullscreen Button */}
        <button
          className="control-icon"
          title="Full screen"
          onClick={onToggleFullscreen}
        >
          <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
        </button>
      </div>
    </div>
  );
}
