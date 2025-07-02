// Retro Music Player JavaScript

class RetroMusicPlayer {
    constructor() {
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.playlist = [];
        this.audioPlayer = document.getElementById('audio-player');
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.currentCover = document.getElementById('current-cover');
        this.currentTitle = document.getElementById('current-title');
        this.playlistContainer = document.getElementById('playlist');
        
        console.log('Constructor - currentTitle element:', this.currentTitle); // Debug log
        
        this.initializeEventListeners();
        this.loadPlaylist();
        this.setupNavigation();
        this.setupGallery();
        this.setupModal();
    }

    initializeEventListeners() {
        // Audio player events
        this.audioPlayer.addEventListener('ended', () => {
            console.log('Track ended, moving to next track'); // Debug log
            this.nextTrack();
        });
        
        // Add more detailed event listeners for debugging
        this.audioPlayer.addEventListener('loadstart', () => {
            console.log('Audio load started');
        });
        
        this.audioPlayer.addEventListener('canplay', () => {
            console.log('Audio can play');
        });
        
        this.audioPlayer.addEventListener('error', (e) => {
            console.error('Audio error:', e);
        });
        
        this.audioPlayer.addEventListener('timeupdate', () => {
            this.updateProgress();
            // Fallback: Check if track has ended (in case 'ended' event doesn't fire)
            if (this.audioPlayer.currentTime >= this.audioPlayer.duration && this.audioPlayer.duration > 0) {
                console.log('Track ended detected via timeupdate, moving to next track');
                this.nextTrack();
            }
        });
        this.audioPlayer.addEventListener('loadedmetadata', () => this.updateDuration());
        
        // Control buttons
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.previousTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'ArrowLeft':
                    this.previousTrack();
                    break;
                case 'ArrowRight':
                    this.nextTrack();
                    break;
            }
        });
    }

    loadPlaylist() {
        // Use playlist from playlist-config.js if available
        if (typeof samplePlaylist !== 'undefined' && Array.isArray(samplePlaylist)) {
            // Force all covers to cover1.jpg for visual consistency
            this.playlist = samplePlaylist.map(track => ({
                ...track,
                cover: 'covers/cover1.jpg'
            }));
            console.log('Loaded sample playlist with', this.playlist.length, 'tracks'); // Debug log
        } else {
            // Fallback minimal playlist
            this.playlist = [
                {
                    title: "Track 1 - Example",
                    artist: "Your Name",
                    file: "songs/track1.mp3",
                    cover: "covers/cover1.jpg",
                    duration: "3:00"
                }
            ];
            console.log('Using fallback playlist'); // Debug log
        }
        this.renderPlaylist();
        this.loadTrack(0);
    }

    renderPlaylist() {
        this.playlistContainer.innerHTML = '';
        this.playlist.forEach((track, index) => {
            const playlistItem = document.createElement('div');
            playlistItem.className = 'playlist-item';
            playlistItem.dataset.index = index;
            playlistItem.innerHTML = `
                <div class="track-cover">
                    <img src="${track.cover}" alt="Album Cover" onerror="this.src='placeholder-cover.jpg'; this.classList.add('placeholder');">
                </div>
                <div class="track-details">
                    <h4>${track.title}</h4>
                    <p>${track.artist} • ${track.duration}</p>
                </div>
            `;
            playlistItem.addEventListener('click', () => {
                this.loadTrack(index);
                this.playTrack();
            });
            this.playlistContainer.appendChild(playlistItem);
        });
    }

    loadTrack(index) {
        if (index < 0 || index >= this.playlist.length) return;
        
        this.currentTrackIndex = index;
        const track = this.playlist[index];
        
        console.log('Loading track:', track.title); // Debug log
        console.log('Track file path:', track.file); // Debug log
        console.log('Current title element:', this.currentTitle); // Debug log
        
        this.audioPlayer.src = track.file;
        // this.currentCover.src = 'album_cover.jpg';
        this.currentTitle.textContent = track.title;
        
        console.log('Set title to:', this.currentTitle.textContent); // Debug log
        
        // Update active playlist item
        document.querySelectorAll('.playlist-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        
        // Add retro loading effect
        this.addRetroEffect();
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pauseTrack();
        } else {
            this.playTrack();
        }
    }

    playTrack() {
        console.log('playTrack() called for index:', this.currentTrackIndex);
        this.audioPlayer.play().then(() => {
            console.log('Track started playing successfully');
            this.isPlaying = true;
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            this.playPauseBtn.classList.add('playing');
            // Track play event
            const track = this.playlist[this.currentTrackIndex];
            trackPlay(track.title);

        }).catch(error => {
            console.error('Error playing track:', error);
            this.showRetroError('Track not found! Check your file paths.');
        });
    }

    pauseTrack() {
        this.audioPlayer.pause();
        this.isPlaying = false;
        this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        this.playPauseBtn.classList.remove('playing');
    }

    nextTrack() {
        console.log('nextTrack() called, current index:', this.currentTrackIndex);
        const nextIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        console.log('Moving to next index:', nextIndex);
        this.loadTrack(nextIndex);
        // Always play the track when moving to next/previous
        this.playTrack();
    }

    previousTrack() {
        const prevIndex = this.currentTrackIndex === 0 ? this.playlist.length - 1 : this.currentTrackIndex - 1;
        this.loadTrack(prevIndex);
        // Always play the track when moving to next/previous
        this.playTrack();
    }

    updateProgress() {
        // Add visual feedback for progress
        const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
        // You can add a custom progress bar here if needed
    }

    updateDuration() {
        // Update duration display if needed
    }

    addRetroEffect() {
        // Add a brief retro loading effect
        const albumArt = document.querySelector('.album-art');
        if (albumArt) {
            albumArt.style.filter = 'hue-rotate(180deg)';
            setTimeout(() => {
                albumArt.style.filter = 'none';
            }, 300);
        }
    }

    showRetroError(message) {
        // Create a retro-style error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'retro-error';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h3>ERROR 404</h3>
                <p>${message}</p>
                <button onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #000;
            border: 2px solid #ff0080;
            color: #ff0080;
            padding: 2rem;
            z-index: 1000;
            text-align: center;
            box-shadow: 0 0 20px #ff0080;
        `;
        document.body.appendChild(errorDiv);
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.content-section');
        
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetSection = button.dataset.section;
                
                // Update active button
                navButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show target section
                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === targetSection) {
                        section.classList.add('active');
                    }
                });
                
                // Add retro transition effect
                this.addSectionTransition();
            });
        });
    }

    addSectionTransition() {
        const activeSection = document.querySelector('.content-section.active');
        activeSection.style.animation = 'none';
        setTimeout(() => {
            activeSection.style.animation = 'fadeIn 0.5s ease-in';
        }, 10);
    }

    setupGallery() {
        // this.loadCoverGallery();
        // this.loadBackCoverGallery();
    }

    loadCoverGallery() {
        const coverGrid = document.getElementById('cover-grid');
        coverGrid.innerHTML = '';
        const coverItem = document.createElement('div');
        coverItem.className = 'cover-item';
        coverItem.innerHTML = `
            <img src="covers/cover1.jpg" alt="Album Cover">
            <p>Main Album Cover</p>
        `;
        coverItem.addEventListener('click', () => {
            this.openModal('covers/cover1.jpg');
        });
        coverGrid.appendChild(coverItem);
    }

    loadBackCoverGallery() {
        const backCoverGrid = document.getElementById('back-cover-grid');
        
        // Generate back cover gallery items
        for (let i = 1; i <= 40; i++) {
            const backCoverItem = document.createElement('div');
            backCoverItem.className = 'cover-item';
            backCoverItem.innerHTML = `
                <img src="back-covers/back${i}.jpg" alt="Back Cover ${i}" onerror="this.src='placeholder-back-cover.jpg'">
                <h4>Track ${i}</h4>
                <p>Back Cover</p>
            `;
            
            backCoverItem.addEventListener('click', () => {
                this.openModal(`back-covers/back${i}.jpg`);
            });
            
            backCoverGrid.appendChild(backCoverItem);
        }
    }

    setupModal() {
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-img');
        const closeBtn = document.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }

    openModal(imageSrc) {
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-img');
        
        modalImg.src = imageSrc;
        modalImg.onerror = function() {
            this.src = 'placeholder-cover.jpg';
        };
        
        modal.style.display = 'block';
        
        // Add retro effect
        modalImg.style.animation = 'fadeIn 0.3s ease-in';
    }
}

// Initialize the player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const player = new RetroMusicPlayer();
    
    // Add some retro console messages
    
    // Add retro loading animation
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-cassette">
                <div class="loading-reel"></div>
                <div class="loading-reel"></div>
            </div>
            <h2>LOADING...</h2>
            <div class="loading-bars">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
            </div>
        </div>
    `;
    loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        color: #ff0080;
        font-family: 'VT323', monospace;
    `;
    
    document.body.appendChild(loadingScreen);
    
    // Remove loading screen after a short delay
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 2000);

    const albumArt = document.getElementById('album-art');
    const albumFront = document.getElementById('album-front');
    const albumBack = document.getElementById('album-back');
    const albumModal = document.getElementById('album-modal');
    const albumModalImg = document.getElementById('album-modal-img');
    const albumModalClose = document.getElementById('album-modal-close');

    function openAlbumModal() {
        console.log("album cover clicked");
        albumModalImg.src = 'album_cover_full.jpg';
        albumModal.style.display = 'block';
    }

    if (albumArt && albumModal && albumModalImg && albumModalClose) {
        albumArt.style.cursor = 'pointer';
        if (albumFront) albumFront.addEventListener('click', openAlbumModal);
        if (albumBack) albumBack.addEventListener('click', openAlbumModal);

        albumModalClose.addEventListener('click', () => {
            albumModal.style.display = 'none';
        });
        albumModal.addEventListener('click', (e) => {
            if (e.target === albumModal) {
                albumModal.style.display = 'none';
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && albumModal.style.display === 'block') {
                albumModal.style.display = 'none';
            }
        });
    }
});

// Add some additional retro effects
document.addEventListener('DOMContentLoaded', () => {
    // Add very subtle CRT scan lines effect
    const scanLines = document.createElement('div');
    scanLines.className = 'scan-lines';
    scanLines.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            transparent 50%,
            rgba(0, 0, 0, 0.02) 50%
        );
        background-size: 100% 8px;
        pointer-events: none;
        z-index: 1;
    `;
    document.body.appendChild(scanLines);
    
    // Add subtle flicker effect
    setInterval(() => {
        if (Math.random() < 0.05) {
            document.body.style.filter = 'brightness(0.98)';
            setTimeout(() => {
                document.body.style.filter = 'none';
            }, 30);
        }
    }, 2000);
});

function trackPlay(songTitle) {
  const url = "https://trackplay-2lz5scwsvq-uc.a.run.app?song=" + encodeURIComponent(songTitle);
  console.log("trackPlay called for:", songTitle);
  console.log("Fetching:", url);
  fetch(url)
    .then(response => {
      console.log("trackPlay response status:", response.status);
      return response.text();
    })
    .then(text => {
      console.log("trackPlay response text:", text);
    })
    .catch(error => {
      console.error("trackPlay fetch error:", error);
    });
} 