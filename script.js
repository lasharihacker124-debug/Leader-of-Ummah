const playPauseBtn = document.getElementById('play-pause');
const video = document.getElementById('video');
const shortSection = document.querySelector('.shorts');
const progressFill = document.getElementById('progress-fill');
const fullScreenBtn = document.querySelector('.full-screen');
const icons = document.querySelectorAll(".footer-icon");
const menuBtn = document.getElementById('menu');
const playPauseDiv = document.querySelector('.play-pause');
const videoWrapper = document.querySelector('.video-wrapper');
const viewShortBtn = document.getElementById('view-short');
const likeBtn = document.getElementById('likebtn');
const volumeBtn = document.getElementById('volume-btn');
const ArrowUpBtn = document.getElementById('UpArrow');
const ArrowDownBtn = document.getElementById('DownArrow');
const shareBtn = document.querySelector('.share.icon');
const downloadBtn = document.querySelector('.download.icon');

let i = 0;
let touchStartY = 0;
let touchEndY = 0;
let touchActive = false;
let shorts = [];
let videosLoaded = false;

async function loadVideoList() {
  try {
    const response = await fetch('videos/');
    if (!response.ok) throw new Error('Failed to fetch videos directory');
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = doc.querySelectorAll('a[href$=".mp4"]');
    shorts = Array.from(links).map(link => link.getAttribute('href').split('/').pop()).sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''));
      const numB = parseInt(b.replace(/\D/g, ''));
      return numA - numB;
    });
    videosLoaded = true;
    // Load first video if none is loaded
    if (shorts.length > 0 && !video.src) {
      changeVideo(shorts[0]);
    }
    
    // Handle shared video URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const sharedVideo = urlParams.get('v');
    if (sharedVideo && shorts.includes(sharedVideo)) {
      const index = shorts.indexOf(sharedVideo);
      i = index;
      changeVideo(sharedVideo);
      // Scroll to shorts section
      setTimeout(() => {
        const shortsSection = document.getElementById('shorts');
        if (shortsSection) {
          shortsSection.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }, 100);
    }
  } catch (error) {
    console.error('Could not load video list:', error);
  }
}

// TypeWriter text animation
var typed = new Typed('#naming', {
  strings: ['Hope of Muslim Ummah.', 'Leader of Muslim Ummah.', 'Defender of Islam.'],
  typeSpeed: 150,
  backSpeed: 150,
  loop: true
});

// function to toggle menu
function toggleMenu(e) {
  e.preventDefault();
  const menuicon = menuBtn.querySelector('img');
  const navbar = document.querySelector('nav');
  navbar.classList.toggle('menu-appear');
  if (navbar.classList.contains('menu-appear')) {
    menuicon.src = 'assest/cancel.svg';
  } else {
    menuicon.src = 'assest/bar.svg';
  }
}

// function to play button
function togglePlayPause() {
  if (video.paused) {
    video.play();
    playPauseBtn.src = 'assest/play.svg';
  } else {
    video.pause();
    playPauseBtn.src = 'assest/pause.svg';
  }
}

function toggleRed() {
  likeBtn.classList.toggle('red-bg');
}

function toggleVolume() {
  const volumeicon = volumeBtn.querySelector('img');
  if (video.muted) {
    video.muted = false;
    volumeicon.src = 'assest/volumeUp.svg';
  } else {
    video.muted = true;
    volumeicon.src = 'assest/volumemute.svg';
  }
}

function showPlayPauseIcon() {
  playPauseBtn.classList.remove('disappear');
}

function hidePlayPauseIcon() {
  playPauseBtn.classList.add('disappear');
}

function moveForward(event) {
  if (event) event.preventDefault();
  if (!videosLoaded || shorts.length === 0) return;
  if (i >= (shorts.length - 1)) i = 0;
  else i += 1;
  changeVideo(shorts[i]);
}

function moveBackward(event) {
  if (event) event.preventDefault();
  if (!videosLoaded || shorts.length === 0) return;
  if (i <= 0) return;
  i -= 1;
  changeVideo(shorts[i]);
}

function changeVideo(newSrc) {
  video.style.opacity = 0.5;
  video.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
  video.style.transform = 'translateY(0)';
  video.src = "videos/" + newSrc;
  video.currentTime = 0;
  video.onloadeddata = () => {
    video.style.opacity = 1;
    video.play().catch(() => { });
    playPauseBtn.src = 'assest/pause.svg';
  };
}

function showVisualFeedback(tooltip, originalText) {
  tooltip.textContent = "Copied!";
  tooltip.style.color = "var(--accent-color)";
  setTimeout(() => {
    tooltip.textContent = originalText;
    tooltip.style.color = "";
  }, 1500);
}

function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  textArea.setSelectionRange(0, 99999);
  try { document.execCommand('copy'); } catch (err) { console.error(err); }
  document.body.removeChild(textArea);
};

// Close mobile menu instantly
function closeMobileMenu() {
  if (window.innerWidth > 768) return;
  const navbar = document.querySelector('nav');
  if (navbar) {
    navbar.style.transition = 'none';
    navbar.classList.remove('menu-appear');
    void navbar.offsetHeight;
    navbar.style.transition = '';
  }
  const menuIcon = menuBtn.querySelector('img');
  if (menuIcon) menuIcon.src = 'assest/bar.svg';
}

// Scroll to section using scrollIntoView (better mobile support)
function scrollToSection(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleNavClick(event, targetKey) {
  event.preventDefault();
  const targetId = targetKey === 'home' ? 'home' : targetKey;
  // Close menu FIRST (instantly, with transition disabled)
  closeMobileMenu();
  // Then scroll to section
  scrollToSection(targetId);
}

function toggleScreenMode() {
  const fullscreenIcon = fullScreenBtn.querySelector('img');
  if (!document.fullscreenElement) {
    videoWrapper.requestFullscreen().catch((err) => {});
    fullscreenIcon.src = 'assest/exitFullScreen.svg';
  } else {
    document.exitFullscreen();
    fullscreenIcon.src = 'assest/fullscreen.svg';
  }
}

menuBtn.addEventListener('click', (e) => { toggleMenu(e) });
video.addEventListener('pointerdown', togglePlayPause);
playPauseDiv.addEventListener('pointerdown', togglePlayPause);

document.querySelectorAll('.nav-link').forEach((link) => {
  const targetKey = link.getAttribute('data-target') || 'home';
  link.addEventListener('click', (event) => handleNavClick(event, targetKey));
  link.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleNavClick(event, targetKey);
    }
  });
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    togglePlayPause();
    showPlayPauseIcon();
  } else if (e.code === 'ArrowUp') {
    e.preventDefault();
    moveBackward();
  } else if (e.code === 'ArrowDown') {
    e.preventDefault();
    moveForward();
  }
});

video.addEventListener('pointerenter', showPlayPauseIcon);
playPauseBtn.addEventListener('pointerenter', showPlayPauseIcon);
video.addEventListener('pointerleave', hidePlayPauseIcon);

video.addEventListener('timeupdate', () => {
  const current = video.currentTime;
  const total = video.duration;
  if (total) {
    progressFill.style.width = `${(current / total) * 100}%`;
  }
});

video.addEventListener('contextmenu', (event) => { event.preventDefault(); });

document.addEventListener("DOMContentLoaded", () => {
  loadVideoList();
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      loader.classList.add('hidden');
    });
  }
  document.querySelectorAll(".footer-icon").forEach(icon => {
    icon.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const tooltip = icon.querySelector(".tooltip");
      if (!tooltip) return;
      const text = tooltip.textContent;
      if (text === "Copied!" || text === "0" || !text.trim()) return;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      tooltip.textContent = "Copied!";
      tooltip.style.color = "var(--accent-color)";
      setTimeout(() => {
        tooltip.textContent = text;
        tooltip.style.color = "";
      }, 1500);
    }, { passive: false });
  });
});

videoWrapper.addEventListener('touchstart', (event) => {
  touchStartY = event.touches[0].clientY;
  touchEndY = touchStartY;
  touchActive = true;
}, { passive: true });

videoWrapper.addEventListener('touchmove', (event) => {
  if (!touchActive) return;
  touchEndY = event.touches[0].clientY;
  const deltaY = touchEndY - touchStartY;
  if (Math.abs(deltaY) > 8) {
    event.preventDefault();
    video.style.transition = 'none';
    video.style.transform = `translateY(${deltaY}px)`;
  }
}, { passive: false });

videoWrapper.addEventListener('touchend', () => {
  if (!touchActive) return;
  const deltaY = touchEndY - touchStartY;
  if (deltaY < -70) moveForward();
  else if (deltaY > 70) moveBackward();
  else {
    video.style.transition = 'transform 0.2s ease';
    video.style.transform = 'translateY(0)';
  }
  touchActive = false;
}, { passive: true });

video.addEventListener("wheel", (event) => {
  event.preventDefault();
  if (event.deltaY > 0) moveForward();
  else if (event.deltaY < 0) moveBackward();
}, { passive: false });

viewShortBtn.addEventListener('click', (e) => {
  e.preventDefault();
  scrollToSection('shorts');
});
likeBtn.addEventListener('click', toggleRed);
volumeBtn.addEventListener('click', toggleVolume);
ArrowUpBtn.addEventListener('click', (e) => { moveBackward(e) });
ArrowDownBtn.addEventListener('click', (e) => { moveForward(e) });
fullScreenBtn.addEventListener('click', toggleScreenMode);

// Reset fullscreen icon when user exits via ESC or other means
document.addEventListener('fullscreenchange', () => {
  const fullscreenIcon = fullScreenBtn.querySelector('img');
  if (!document.fullscreenElement) {
    fullscreenIcon.src = 'assest/fullscreen.svg';
  } else {
    fullscreenIcon.src = 'assest/exitFullScreen.svg';
  }
});
document.addEventListener('webkitfullscreenchange', () => {
  const fullscreenIcon = fullScreenBtn.querySelector('img');
  if (!document.fullscreenElement) {
    fullscreenIcon.src = 'assest/fullscreen.svg';
  } else {
    fullscreenIcon.src = 'assest/exitFullScreen.svg';
  }
});

// Download video function
function downloadVideo() {
  const sourceEl = video.querySelector('source');
  const currentSrc = video.currentSrc || (sourceEl ? sourceEl.src : null) || video.getAttribute('src');
  if (!currentSrc) return;

  const a = document.createElement('a');
  a.href = currentSrc;
  a.download = currentSrc.split('/').pop() || 'short-video.mp4';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function shareVideo() {
  const currentSrc = video.getAttribute('src') || video.currentSrc;
  const videoFile = currentSrc.split('/').pop();

  const url = new URL(window.location.href);
  url.searchParams.set('v', videoFile);

  const shareData = {
    title: document.title || 'Check out this short video!',
    text: 'Check out this short video!',
    url: url.toString(),
  };

  if (navigator.share) {
    navigator.share(shareData).catch((err) => {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
      }
    });
  } else {
    copyToClipboard(url.toString());
  }
}


async function copyToClipboard(text) {
  try {
    // Modern API — requires secure context and user gesture
    await navigator.clipboard.writeText(text);
    showShareFeedback('Link copied to clipboard!');
  } catch (err) {
    console.warn('Clipboard API failed:', err);
    // Fallback for older browsers / insecure contexts / mobile restrictions
    fallbackCopyText(text);
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;

  // Prevent scrolling to bottom
  textArea.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 1px;
    height: 1px;
    padding: 0;
    border: none;
    outline: none;
    box-shadow: none;
    background: transparent;
    opacity: 0;
  `;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      showShareFeedback('Link copied to clipboard!');
    } else {
      showShareFeedback('Failed to copy. Please copy manually.');
      // Optional: select the URL in a visible input for manual copy
      prompt('Copy this link:', text);
    }
  } catch (err) {
    document.body.removeChild(textArea);
    showShareFeedback('Failed to copy. Please copy manually.');
    prompt('Copy this link:', text);
  }
}

function showShareFeedback(message) {
  const tooltip = shareBtn.querySelector('.tooltip');
  if (tooltip) {
    const originalText = tooltip.textContent;
    tooltip.textContent = message;
    tooltip.classList.add('visible');

    setTimeout(() => {
      tooltip.textContent = originalText;
      tooltip.classList.remove('visible');
    }, 2000);
  }
}

downloadBtn.addEventListener('click', downloadVideo);
shareBtn.addEventListener('click', shareVideo);
