/* =====================================================================
   KEEPSAKE — script.js
   A vinyl record player + photograph gallery scrapbook.
   Vanilla JS only. No build step. No backend.
===================================================================== */

const CONFIG = {
  // The title shown in the browser tab
  siteTitle: "Keepsake",

  // A background image for the home screen (leave "" to keep the default
  // paper-toned gradient). Example: "assets/images/background.jpg"
  backgroundImage: "",

  // The image shown in the center of the vinyl record, on the mini icon
  // and on the turntable label. Recommended: a square image, at least
  // 400x400px. Example: "assets/images/album.jpg"
  vinylArt: "assets/images/album.jpg",
};

const playlist = [
  { title: "Waking Up Slow",      youtubeId: "cTSdJEGswtg" },
  { title: "Flightless Bird, American Mouth",      youtubeId: "RGVmhrfQqzg" },
  { title: "Stay Love",    youtubeId: "hLWLS-Csppw" },
  { title: "Ordinary",     youtubeId: "NaZznqme2hg" },
  { title: "Sweet Love",     youtubeId: "Q-p2mVc8qsQ" },
  { title: "Iris",      youtubeId: "hpy8F9uzqv0" },
  { title: "Song Seven",    youtubeId: "" },
  { title: "Song Eight",    youtubeId: "" },
  { title: "Song Nine",     youtubeId: "" },
  { title: "Song Ten",      youtubeId: "" },
  { title: "Song Eleven",   youtubeId: "" },
  { title: "Song Twelve",   youtubeId: "" },
  { title: "Song Thirteen", youtubeId: "" },
];

// Exactly 13 photographs, shown together in the gallery grid.
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
     Pure CSS-opacity crossfade, no page reloads, no carousels.
  ------------------------------------------------------------- */
  const screens = {
    home: document.getElementById("home-screen"),
    player: document.getElementById("player-screen"),
    gallery: document.getElementById("gallery-screen"),
  };

  function showScreen(name) {
    // Visibility, hit-testing, and the crossfade are all handled purely
    // by the .is-active class in CSS, so switching screens is just a
    // class toggle.
    Object.entries(screens).forEach(([key, el]) => {
      if (!el) return;
      el.classList.toggle("is-active", key === name);
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
      showScreen("player");
      // Start the playlist from the first track every time the record
      // player is opened, then keep playing straight through to #13.
      playSongAt(0);
    });

    openGallery.addEventListener("click", () => {
      triggerCameraFlash();
      showScreen("gallery");
    });

    backButtons.forEach((btn) =>
      btn.addEventListener("click", () => showScreen("home"))
    );
  }

  // A quick, one-off bright flash on the camera icon when it's clicked
  // (the idle icon already flashes gently on its own — see the CSS).
  function triggerCameraFlash() {
    const flash = document.querySelector(".mini-camera__flash-burst");
    if (!flash) return;
    flash.classList.add("is-flashing");
    flash.addEventListener("animationend", function handler() {
      flash.classList.remove("is-flashing");
      flash.removeEventListener("animationend", handler);
    });
  }

  /* -------------------------------------------------------------
     Build the playlist UI
  ------------------------------------------------------------- */
  const playlistEl = document.getElementById("playlist");
  let currentIndex = 0;

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
          ytPlayer.setVolume(80);
        },
        onStateChange: onPlayerStateChange,
      },
    });
  };

  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
      setPlayingUI(true);
    } else if (event.data === YT.PlayerState.PAUSED) {
      setPlayingUI(false);
    } else if (event.data === YT.PlayerState.ENDED) {
      // Keep playing straight through the list; stop after track 13.
      if (currentIndex < playlist.length - 1) {
        goNext();
      } else {
        setPlayingUI(false);
      }
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
    if (currentIndex < playlist.length - 1) playSongAt(currentIndex + 1);
  }

  function goPrev() {
    if (currentIndex > 0) playSongAt(currentIndex - 1);
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
     Transport controls: previous, play/pause, next
  ------------------------------------------------------------- */
  function initControls() {
    btnPlay.addEventListener("click", togglePlayPause);
    document.getElementById("btn-next").addEventListener("click", goNext);
    document.getElementById("btn-prev").addEventListener("click", goPrev);
  }

  /* -------------------------------------------------------------
     Photograph gallery — a plain grid of all 13 photos, lazy-loaded.
     Clicking a photo enlarges it. No lightbox carousel: just one
     photo at a time, with a close button (or Esc, or clicking the
     background) to dismiss it.
  ------------------------------------------------------------- */
  const galleryGrid = document.getElementById("gallery-grid");

  function buildGallery() {
    galleryGrid.innerHTML = "";
    photos.forEach((photo, i) => {
      const item = document.createElement("div");
      item.className = "gallery-item";
      // gentle, deterministic tilt per photo for a handmade feel
      const tilt = ((i % 5) - 2) * 1.1;
      item.style.setProperty("--tilt", `${tilt}deg`);
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-label", `Enlarge photograph ${i + 1}`);

      const img = document.createElement("img");
      img.src = photo.src;
      img.loading = "lazy";
      img.decoding = "async";
      img.alt = photo.caption || `Photograph ${i + 1}`;
      img.onerror = function () {
        // keep the grid looking tidy even before real photos are added
        item.style.minHeight = "160px";
        item.style.background =
          "linear-gradient(155deg, var(--beige), var(--cream-deep))";
      };

      item.appendChild(img);
      item.addEventListener("click", () => openEnlargedPhoto(photo, i));
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openEnlargedPhoto(photo, i);
        }
      });
      galleryGrid.appendChild(item);
    });
  }

  /* -------------------------------------------------------------
     Photo enlarge overlay (enlarge + close only — no carousel)
  ------------------------------------------------------------- */
  const enlargeOverlay = document.getElementById("photo-enlarge");
  const enlargeImg = document.getElementById("photo-enlarge-img");
  const enlargeCaption = document.getElementById("photo-enlarge-caption");

  function openEnlargedPhoto(photo, index) {
    enlargeImg.src = photo.src;
    enlargeImg.alt = photo.caption || `Photograph ${index + 1}`;
    enlargeCaption.textContent = photo.caption || "";
    enlargeOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeEnlargedPhoto() {
    enlargeOverlay.hidden = true;
    document.body.style.overflow = "";
  }

  function initEnlargeOverlay() {
    document.getElementById("photo-enlarge-close").addEventListener("click", closeEnlargedPhoto);
    enlargeImg.addEventListener("click", closeEnlargedPhoto);
    enlargeOverlay.addEventListener("click", (e) => {
      if (e.target === enlargeOverlay) closeEnlargedPhoto();
    });
    document.addEventListener("keydown", (e) => {
      if (!enlargeOverlay.hidden && e.key === "Escape") closeEnlargedPhoto();
    });
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
    initEnlargeOverlay();
    highlightActiveSong();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
