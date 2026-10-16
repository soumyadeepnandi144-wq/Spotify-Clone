/**
 * Song data with local paths and fallback URLs.
 * 
 * Each song object carries:
 *   cover / fallbackCover    – artwork (local public/assets -> Unsplash)
 *   audioUrl / fallbackAudio – playback (local public/songs -> SoundHelix royalty-free)
 * 
 * Includes onError helper functions so image and audio elements gracefully fall back
 * if any local asset is missing.
 */

export const songsData = [
  {
    id: 1,
    title: 'Daylight',
    artist: 'David Kushner',
    category: 'recently-played',
    cover: '/assets/album_picture.jpeg',
    fallbackCover:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    audioUrl: '/songs/daylight.mp3',
    fallbackAudio:
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '3:33',
    info: 'David Kushner • Daylight'
  },
  {
    id: 2,
    title: 'Mahiye Jinna Sohna',
    artist: 'Darshan Raval',
    category: 'trending',
    cover: '/assets/card2img.jpeg',
    fallbackCover:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80',
    audioUrl: '/songs/mahiye-jinna-sohna.mp3',
    fallbackAudio:
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '3:45',
    info: 'Darshan Raval • Trending Now'
  },
  {
    id: 3,
    title: 'Mere Pass Tum Ho',
    artist: 'Rahat Fateh Ali Khan',
    category: 'trending',
    cover: '/assets/card3img.jpeg',
    fallbackCover:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    audioUrl: '/songs/mere-pass-tum-ho.mp3',
    fallbackAudio:
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '4:12',
    info: 'Rahat Fateh Ali Khan • Lofi Mix'
  },
  {
    id: 4,
    title: 'Alter Ego - Naa Ready',
    artist: 'Anirudh Ravichander, Thalapathy Vijay',
    category: 'trending',
    cover: '/assets/card4img.jpeg',
    fallbackCover:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    audioUrl: '/songs/naa-ready.mp3',
    fallbackAudio:
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: '3:58',
    info: 'Leo • Anirudh Ravichander, Vijay'
  },
  {
    id: 5,
    title: 'Top 50 - Global',
    artist: 'Spotify Charts',
    category: 'charts',
    cover: '/assets/card1img.jpeg',
    fallbackCover:
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=80',
    audioUrl: '/songs/top-global.mp3',
    fallbackAudio:
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: '4:05',
    info: 'Your daily update of the most played tracks right now - Global.'
  },
  {
    id: 6,
    title: 'Top Songs - India',
    artist: 'Spotify Charts',
    category: 'charts',
    cover: '/assets/card5img.jpeg',
    fallbackCover:
      'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=500&auto=format&fit=crop&q=80',
    audioUrl: '/songs/top-india.mp3',
    fallbackAudio:
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    duration: '3:50',
    info: 'Your weekly update of the most played tracks right now - India.'
  },
  {
    id: 7,
    title: 'Viral 50 - Global',
    artist: 'Viral Charts',
    category: 'charts',
    cover: '/assets/card6img.jpeg',
    fallbackCover:
      'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&auto=format&fit=crop&q=80',
    audioUrl: '/songs/viral-50.mp3',
    fallbackAudio:
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    duration: '3:22',
    info: 'Your daily update of the most viral tracks right now - Global.'
  }
];

/**
 * Image error fallback handler.
 * Swaps broken local images to the provided Unsplash fallback cover.
 */
export const handleImgError = (e, fallbackCover) => {
  if (fallbackCover && e.target.src !== fallbackCover) {
    e.target.src = fallbackCover;
  }
};

/**
 * Audio error fallback handler.
 * Swaps broken local MP3 sources to royalty-free SoundHelix audio without halting playback.
 */
export const handleAudioError = (audioElement, fallbackAudio, shouldPlay = false) => {
  if (audioElement && fallbackAudio && audioElement.src !== fallbackAudio) {
    audioElement.src = fallbackAudio;
    audioElement.load();
    if (shouldPlay) {
      audioElement.play().catch((err) => {
        console.warn('Audio fallback playback deferred:', err);
      });
    }
  }
};

export default songsData;
