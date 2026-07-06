/* =====================================================================
   KEEPSAKE — script.js
   A vinyl record player + photograph gallery scrapbook.
   Vanilla JS only. No build step. No backend.
===================================================================== */

/* =====================================================================
   ░░░  EDIT ME  ░░░  — everything you'll want to personalize lives here
===================================================================== */

const CONFIG = {
  // The title shown on the home screen
  siteTitle: "Keepsake",

  // A background image for the home screen (leave "" to keep the default
  // paper-toned gradient). Example: "assets/images/background.jpg"
  backgroundImage: "",

  // The image shown in the center of the vinyl record, on the mini icon
  // and on the turntable label. Recommended: a square image, at least
  // 400x400px. Example: "assets/images/album.jpg"
  vinylArt: "assets/images/album.jpg",
};

// Exactly 13 songs. `youtubeId` is the part of the YouTube URL after
// "v=", e.g. for https://www.youtube.com/watch?v=dQw4w9WgXcQ the id is
// "dQw4w9WgXcQ". Replace the title and id for each track below.
const playlist = [
  { title: "Song One",      youtubeId: "" },
  { title: "Song Two",      youtubeId: "" },
  { title: "Song Three",    youtubeId: "" },
  { title: "Song Four",     youtubeId: "" },
  { title: "Song Five",     youtubeId: "" },
  { title: "Song Six",      youtubeId: "" },
  { title: "Song Seven",    youtubeId: "" },
  { title: "Song Eight",    youtubeId: "" },
  { title: "Song Nine",     youtubeId: "" },
  { title: "Song Ten",      youtubeId: "" },
  { title: "Song Eleven",   youtubeId: "" },
  { title: "Song Twelve",   youtubeId: "" },
  { title: "Song Thirteen", youtubeId: "" },
];

// Exactly 13 photographs. `src` is the file path, `caption` is optional
// text shown under the photo in the lightbox.
const photos = [
  { src: "assets/images/photo1.jpg",  caption: "" },
  { src: "assets/images/photo2.jpg",  caption: "" },
  { src: "assets/images/photo3.jpg",  caption: "" },
  { src: "assets/images/photo4.jpg",  caption: "" },
  { src: "assets/images/photo5.jpg",  caption: "" },
  { src: "assets/images/photo6.jpg",  caption: "" },
  { src: "assets/images/photo7.jpg",  caption: "" },
  { src: "assets/images/photo8.jpg",  caption: "" },
  { src: "assets/images/photo9.jpg",  caption: "" },
  { src: "assets/images/photo10.jpg", caption: "" },
  { src: "assets/images/photo11.jpg", caption: "" },
  { src: "assets/images/photo12.jpg", caption: "" },
  { src: "assets/images/photo13.jpg", caption: "" },
];

/* =====================================================================
   ░░░  END OF EDIT ME SECTION  ░░░  — the rest wires everything up
===================================================================== */

(function () {
  "use strict";

  /* -------------------------------------------------------------
     Apply basic customization to the DOM
  ------------------------------------------------------------- */
  function applyConfig() {
    document.title = CONFIG.siteTitle + " — A Scrapbook";
    const titleEl = document.getElementById("site-title");
    if (titleEl) titleEl.textContent = CONFIG.siteTitle;

    if (CONFIG.backgroundImage) {
      const backdrop = document.getElementById("home-backdrop");
      backdrop.style.backgroundImage =
        `linear-gradient(180deg, rgba(243,236,221,0.55), rgba(228,212,180,0.72)), url("${CONFIG.backgroundImage}")`;
      backdrop.style.backgroundSize = "cover";
      backdrop.style.backgroundPosition = "center";
    }

    const miniArt = document.getElementById("mini-vinyl-art");
    const playerArt = document.getElementById("player-vinyl-art");
    if (miniArt) miniArt.src = CONFIG.vinylArt;
    if (playerArt) playerArt.src = CONFIG.vinylArt;
  }

  /* -------------------------------------------------------------
     Screen navigation (home / player / gallery)
     Pure CSS-opacity crossfade, no page reloads.
  ------------------------------------------------------------- */
  const screens = {
    home: document.getElementById("home-screen"),
    player: document.getElementById("player-screen"),
    gallery: document.getElementById("gallery-screen"),
  };

  function showScreen(name) {
    Object.entries(screens).forEach(([key, el]) => {
      if (!el) return;
      if (key === name) {
        el.hidden = false;
        // allow the browser to register hidden=false before adding the
        // class, so the opacity transition actually plays
        requestAnimationFrame(() => el.classList.add("is-active"));
      } else {
        el.classList.remove("is-active");
        // wait for the fade-out transition before actually hiding
        window.setTimeout(() => {
          if (!el.classList.contains("is-active")) el.hidden = true;
        }, 550);
      }
    });

    if (name !== "player") {
      pausePlayback();
    }
  }

  function initNavigation() {
    const openPlayer = document.getElementById("open-player");
    const openGallery = document.getElementById("open-gallery");
    const backButtons = document.querySelectorAll("[data-back]");

    openPlayer.addEventListener("click", () => {
      triggerVinylGrowAnimation();
      showScreen("player");
    });

    openGallery.addEventListener("click", () => {
      triggerCameraFlash();
      window.setTimeout(() => showScreen("gallery"), 260);
    });

    backButtons.forEach((btn) =>
      btn.addEventListener("click", () => showScreen("home"))
    );
  }

  // A little momentary "grow" pulse on the mini vinyl before the record
  // player screen fades in, so the click feels like it opens the object.
  function triggerVinylGrowAnimation() {
    const mini = document.querySelector(".mini-vinyl");
    if (!mini) return;
    mini.style.transition = "transform .5s cubic-bezier(.22,.61,.36,1)";
    mini.style.transform = "scale(1.35)";
    mini.classList.add("is-spinning");
    window.setTimeout(() => {
      mini.style.transform = "";
    }, 550);
  }

  function triggerCameraFlash() {
    const flash = document.querySelector(".mini-camera__flash-burst");
    if (!flash) return;
    flash.classList.remove("is-flashing");
    // force reflow so the animation can restart
    void flash.offsetWidth;
    flash.classList.add("is-flashing");
  }

  /* -------------------------------------------------------------
     Build the playlist UI
  ------------------------------------------------------------- */
  const playlistEl = document.getElementById("playlist");
  let currentIndex = 0;
  let isShuffle = false;
  let isRepeat = false;

  function buildPlaylist() {
    playlistEl.innerHTML = "";
    playlist.forEach((song, i) => {
      const li = document.createElement("li");
      li.className = "playlist__item";
      li.dataset.index = String(i);

      const btn = document.createElement("button");
      btn.className = "playlist__button";
      btn.type = "button";
      btn.textContent = song.title || `Track ${i + 1}`;
      btn.addEventListener("click", () => playSongAt(i));

      li.appendChild(btn);
      playlistEl.appendChild(li);
    });
  }

  function highlightActiveSong() {
    document.querySelectorAll(".playlist__item").forEach((li) => {
      li.classList.toggle("is-active", Number(li.dataset.index) === currentIndex);
    });
    const nowPlaying = document.getElementById("now-playing");
    const song = playlist[currentIndex];
    if (nowPlaying && song) {
      nowPlaying.textContent = song.title || `Track ${currentIndex + 1}`;
    }
  }

  /* -------------------------------------------------------------
     YouTube IFrame API integration
  ------------------------------------------------------------- */
  let ytPlayer = null;
  let ytReady = false;
  let progressTimer = null;

  // Called automatically by the YouTube IFrame API script once loaded
  window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player("youtube-player", {
      height: "1",
      width: "1",
      videoId: "",
      playerVars: {
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          ytReady = true;
          ytPlayer.setVolume(Number(volumeSlider.value));
        },
        onStateChange: onPlayerStateChange,
      },
    });
  };

  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
      setPlayingUI(true);
      startProgressTimer();
    } else if (event.data === YT.PlayerState.PAUSED) {
      setPlayingUI(false);
      stopProgressTimer();
    } else if (event.data === YT.PlayerState.ENDED) {
      handleSongEnded();
    }
  }

  function handleSongEnded() {
    if (isRepeat) {
      playSongAt(currentIndex);
    } else {
      goNext();
    }
  }

  function loadAndPlay(index) {
    const song = playlist[index];
    if (!song || !song.youtubeId || !ytReady) {
      // No id provided yet — still update the UI so the scrapbook feels
      // alive even before real songs are wired in.
      highlightActiveSong();
      return;
    }
    ytPlayer.loadVideoById(song.youtubeId);
  }

  function playSongAt(index) {
    if (index < 0 || index >= playlist.length) return;
    currentIndex = index;
    highlightActiveSong();
    loadAndPlay(index);
  }

  function goNext() {
    if (isShuffle) {
      let next = currentIndex;
      if (playlist.length > 1) {
        while (next === currentIndex) {
          next = Math.floor(Math.random() * playlist.length);
        }
      }
      playSongAt(next);
    } else {
      playSongAt((currentIndex + 1) % playlist.length);
    }
  }

  function goPrev() {
    playSongAt((currentIndex - 1 + playlist.length) % playlist.length);
  }

  function togglePlayPause() {
    if (!ytReady) return;
    const state = ytPlayer.getPlayerState();
    if (state === YT.PlayerState.PLAYING) {
      ytPlayer.pauseVideo();
    } else if (playlist[currentIndex] && playlist[currentIndex].youtubeId) {
      if (state === YT.PlayerState.CUED || state === -1 || state === YT.PlayerState.ENDED) {
        loadAndPlay(currentIndex);
      } else {
        ytPlayer.playVideo();
      }
    }
  }

  function pausePlayback() {
    if (ytReady && ytPlayer && typeof ytPlayer.pauseVideo === "function") {
      try { ytPlayer.pauseVideo(); } catch (e) { /* noop */ }
    }
  }

  /* -------------------------------------------------------------
     Visual state: spinning record + tonearm gesture
  ------------------------------------------------------------- */
  const vinylRecord = document.getElementById("vinyl-record");
  const tonearm = document.getElementById("tonearm");
  const iconPlay = document.getElementById("icon-play");
  const iconPause = document.getElementById("icon-pause");
  const btnPlay = document.getElementById("btn-play");

  function setPlayingUI(isPlaying) {
    vinylRecord.classList.toggle("is-spinning", isPlaying);
    tonearm.classList.toggle("is-playing", isPlaying);
    iconPlay.style.display = isPlaying ? "none" : "block";
    iconPause.style.display = isPlaying ? "block" : "none";
    btnPlay.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
  }

  /* -------------------------------------------------------------
     Progress bar / seek / time display
  ------------------------------------------------------------- */
  const seekSlider = document.getElementById("seek");
  const timeCurrent = document.getElementById("time-current");
  const timeDuration = document.getElementById("time-duration");
  let isScrubbing = false;

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) seconds = 0;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function startProgressTimer() {
    stopProgressTimer();
    progressTimer = window.setInterval(() => {
      if (!ytReady || isScrubbing) return;
      const duration = ytPlayer.getDuration() || 0;
      const current = ytPlayer.getCurrentTime() || 0;
      if (duration > 0) {
        seekSlider.value = String(Math.round((current / duration) * 1000));
      }
      timeCurrent.textContent = formatTime(current);
      timeDuration.textContent = formatTime(duration);
    }, 400);
  }

  function stopProgressTimer() {
    if (progressTimer) {
      window.clearInterval(progressTimer);
      progressTimer = null;
    }
  }

  function initSeek() {
    seekSlider.addEventListener("input", () => { isScrubbing = true; });
    seekSlider.addEventListener("change", () => {
      if (ytReady) {
        const duration = ytPlayer.getDuration() || 0;
        const target = (Number(seekSlider.value) / 1000) * duration;
        ytPlayer.seekTo(target, true);
      }
      isScrubbing = false;
    });
  }

  /* -------------------------------------------------------------
     Transport controls: play/pause, prev/next, shuffle, repeat, volume
  ------------------------------------------------------------- */
  const volumeSlider = document.getElementById("volume");

  function initControls() {
    btnPlay.addEventListener("click", togglePlayPause);
    document.getElementById("btn-next").addEventListener("click", goNext);
    document.getElementById("btn-prev").addEventListener("click", goPrev);

    const shuffleBtn = document.getElementById("btn-shuffle");
    shuffleBtn.addEventListener("click", () => {
      isShuffle = !isShuffle;
      shuffleBtn.setAttribute("aria-pressed", String(isShuffle));
    });

    const repeatBtn = document.getElementById("btn-repeat");
    repeatBtn.addEventListener("click", () => {
      isRepeat = !isRepeat;
      repeatBtn.setAttribute("aria-pressed", String(isRepeat));
    });

    volumeSlider.addEventListener("input", () => {
      if (ytReady) ytPlayer.setVolume(Number(volumeSlider.value));
    });

    initSeek();
  }

  /* -------------------------------------------------------------
     Photograph gallery (masonry grid, lazy-loaded)
  ------------------------------------------------------------- */
  const galleryGrid = document.getElementById("gallery-grid");
  let currentPhotoIndex = 0;

  function buildGallery() {
    galleryGrid.innerHTML = "";
    photos.forEach((photo, i) => {
      const item = document.createElement("div");
      item.className = "gallery-item";
      // gentle, deterministic tilt per photo for a handmade feel
      const tilt = ((i % 5) - 2) * 1.1;
      item.style.setProperty("--tilt", `${tilt}deg`);

      const btn = document.createElement("button");
      btn.className = "gallery-item__button";
      btn.type = "button";
      btn.setAttribute("aria-label", `Open photograph ${i + 1}`);
      btn.addEventListener("click", () => openLightbox(i));

      const img = document.createElement("img");
      img.src = photo.src;
      img.loading = "lazy";
      img.decoding = "async";
      img.alt = photo.caption || `Photograph ${i + 1}`;
      img.onerror = function () {
        // keep layout tidy even before the user supplies real photos
        item.style.minHeight = "160px";
        item.style.background =
          "linear-gradient(155deg, var(--beige), var(--cream-deep))";
      };

      btn.appendChild(img);
      item.appendChild(btn);
      galleryGrid.appendChild(item);
    });
  }

  /* -------------------------------------------------------------
     Lightbox: fullscreen viewer with keyboard + swipe support
  ------------------------------------------------------------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");

  function openLightbox(index) {
    currentPhotoIndex = index;
    renderLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  function renderLightbox() {
    const photo = photos[currentPhotoIndex];
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.caption || `Photograph ${currentPhotoIndex + 1}`;
    lightboxCaption.textContent = photo.caption || "";
  }

  function lightboxNext() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    renderLightbox();
  }

  function lightboxPrev() {
    currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    renderLightbox();
  }

  function initLightbox() {
    document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
    document.getElementById("lightbox-next").addEventListener("click", lightboxNext);
    document.getElementById("lightbox-prev").addEventListener("click", lightboxPrev);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") lightboxNext();
      if (e.key === "ArrowLeft") lightboxPrev();
    });

    // touch swipe support for mobile
    let touchStartX = 0;
    lightbox.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) lightboxNext(); else lightboxPrev();
      }
    }, { passive: true });
  }

  /* -------------------------------------------------------------
     Boot
  ------------------------------------------------------------- */
  function init() {
    applyConfig();
    initNavigation();
    buildPlaylist();
    buildGallery();
    initControls();
    initLightbox();
    highlightActiveSong();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
