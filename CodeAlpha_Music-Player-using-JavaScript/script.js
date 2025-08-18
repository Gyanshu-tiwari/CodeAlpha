// Helper function to format time as MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
}

// Song data
const songs = [
    {
        title: "Jhol",
        artist: "Mannu . Annural Khalid",
        cover: "./images/Jhol.webp",
        audio: "./musics/Jhol.mp3"
    },
    {
        title: "Special Cell",
        artist: "Masoom Sharma . Ashu Twinkle",
        cover: "./images/Special_Cell.webp",
        audio: "./musics/Special_Cell.mp3"
    },
    {
        title: "Naina",
        artist: "Diljit Dosanjh",
        cover: "./images/Naina.webp",
        audio: "./musics/Naina.mp3"
    },
    {
        title: "Losing Myself",
        artist: "AP Dhillon",
        cover: "./images/Losing_Myself.webp",
        audio: "./musics/Losing_Myself.mp3"
    },
    {
        title: "Nari Mantar",
        artist: "Kptaan",
        cover: "./images/Nari_Mantar.webp",
        audio: "./musics/Nari_Mantar.mp3"
    },
    
];

// DOM Elements
const playerEl = document.getElementById('player');
const cover = document.getElementById('cover');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const audio = document.getElementById('audio');
const volumeSlider = document.getElementById('volume-slider');
const playlistContainer = document.getElementById('playlist-container');
const songLoopBtn = document.getElementById('song-loop-btn');
const playlistLoopBtn = document.getElementById('playlist-loop-btn');
const playlistLoopBtn2 = document.getElementById('playlist-loop-btn-2');

// Current song index
let currentSongIndex = 0;

// Loop states
let loopSong = false;
let loopPlaylist = true;

// Store actual song durations
const songDurations = Array(songs.length).fill(0);

// Initialize the player
function initPlayer() {
    // Populate the playlist
    populatePlaylist();
    
    // Set volume
    audio.volume = volumeSlider.value;
    
    // Update loop buttons
    updateLoopButtons();
    
    // Load the first song
    loadSong(currentSongIndex);
}

// Load a song
function loadSong(index) {
    const song = songs[index];
    
    // Show loading state
    playerEl.classList.add('loading');
    durationEl.textContent = '0:00';
    currentTimeEl.textContent = '0:00';
    progress.style.width = '0%';
    
    // Update player UI
    cover.src = song.cover;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    audio.src = song.audio;
    
    // Reset time display
    durationEl.textContent = '0:00';
    
    // If we already have duration for this song, set it
    if (songDurations[index] > 0) {
        durationEl.textContent = formatTime(songDurations[index]);
    }
    
    // Update playlist active item
    updateActivePlaylistItem(index);
}

// Play song
function playSong() {
    playerEl.classList.add('playing');
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    audio.play();
}

// Pause song
function pauseSong() {
    playerEl.classList.remove('playing');
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    audio.pause();
}

// Previous song
function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(currentSongIndex);
    playSong();
}

// Next song
function nextSong() {
    if (loopSong) {
        // If song looping is enabled, just restart the current song
        audio.currentTime = 0;
        playSong();
        return;
    }
    
    currentSongIndex++;
    if (currentSongIndex > songs.length - 1) {
        if (loopPlaylist) {
            currentSongIndex = 0;
        } else {
            currentSongIndex = songs.length - 1;
            pauseSong();
            return;
        }
    }
    loadSong(currentSongIndex);
    playSong();
}

// Toggle song loop
function toggleSongLoop() {
    loopSong = !loopSong;
    if (loopSong) {
        // If enabling song loop, disable playlist loop
        loopPlaylist = false;
    }
    updateLoopButtons();
}

// Toggle playlist loop
function togglePlaylistLoop() {
    loopPlaylist = !loopPlaylist;
    if (loopPlaylist) {
        // If enabling playlist loop, disable song loop
        loopSong = false;
    }
    updateLoopButtons();
}

// Update loop buttons appearance
function updateLoopButtons() {
    // Update song loop button
    songLoopBtn.classList.toggle('active', loopSong);
    
    // Update playlist loop buttons
    playlistLoopBtn.classList.toggle('active', loopPlaylist);
    playlistLoopBtn2.classList.toggle('active', loopPlaylist);
    
    // Update player class for indicators
    playerEl.classList.toggle('loop-song', loopSong);
    playerEl.classList.toggle('loop-playlist', loopPlaylist);
}

// Update progress bar
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    
    // Only update if duration is a valid number
    if (isNaN(duration)) return;
    
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    
    // Update time display
    currentTimeEl.textContent = formatTime(currentTime);
}

// Set progress bar
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    
    // Only set if we have a valid duration
    if (isNaN(duration)) return;
    
    audio.currentTime = (clickX / width) * duration;
}

// Set volume
function setVolume() {
    audio.volume = this.value;
}

// Populate playlist
function populatePlaylist() {
    playlistContainer.innerHTML = '';
    
    songs.forEach((song, index) => {
        const playlistItem = document.createElement('div');
        playlistItem.classList.add('playlist-item');
        if (index === currentSongIndex) {
            playlistItem.classList.add('active');
        }
        
        playlistItem.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <div class="song-details">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>
            <div class="song-duration">${songDurations[index] > 0 ? formatTime(songDurations[index]) : '--:--'}</div>
        `;
        
        playlistItem.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        });
        
        playlistContainer.appendChild(playlistItem);
    });
}

// Update active playlist item
function updateActivePlaylistItem(index) {
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Update playlist duration display
function updatePlaylistDuration(index, duration) {
    const playlistItems = document.querySelectorAll('.playlist-item');
    if (index >= 0 && index < playlistItems.length) {
        const durationElement = playlistItems[index].querySelector('.song-duration');
        if (durationElement) {
            durationElement.textContent = duration;
        }
    }
}

// Event Listeners
playBtn.addEventListener('click', () => {
    const isPlaying = playerEl.classList.contains('playing');
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong);

// When audio metadata is loaded
audio.addEventListener('loadedmetadata', () => {
    if (!isNaN(audio.duration)) {
        // Store the actual duration
        songDurations[currentSongIndex] = audio.duration;
        
        // Update display
        durationEl.textContent = formatTime(audio.duration);
        
        // Update playlist display
        updatePlaylistDuration(currentSongIndex, formatTime(audio.duration));
    }
    
    // Hide loading spinner
    playerEl.classList.remove('loading');
});

// Show loading when source changes
audio.addEventListener('loadstart', () => {
    playerEl.classList.add('loading');
});

progressContainer.addEventListener('click', setProgress);

volumeSlider.addEventListener('input', setVolume);

songLoopBtn.addEventListener('click', toggleSongLoop);
playlistLoopBtn.addEventListener('click', togglePlaylistLoop);
playlistLoopBtn2.addEventListener('click', togglePlaylistLoop);

// Initialize the player
initPlayer();