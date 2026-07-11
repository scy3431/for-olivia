const CONFIG = {
  siteTitle: "A Gift For My Love",

  backgroundImage: "",

  vinylArt: "assets/images/album.jpg",
  vinylArtSideB: "assets/images/album-b.jpg",

  hiddenLetterText:
    "Hi baby, if you find this, I want you to know that... I LOVE YOUUUUUUUU :). You're so cute and beautiful and sexy and amazing. Happy 14th Monthaversary!",

  journalPassword: "februarysixteenth",
};

const playlist = [
  { title: "Sweet Love",     youtubeId: "Q-p2mVc8qsQ" },
  { title: "Bloom",      youtubeId: "8inJtTG_DuU" },
  { title: "Ordinary",     youtubeId: "NaZznqme2hg" },
  { title: "Waking Up Slow",      youtubeId: "cTSdJEGswtg" },
  { title: "Tenerife Sea", youtubeId: "2tHes1FQfwU" },
  { title: "Cherry Wine",   youtubeId: "1o00J04ThXQ" },
  { title: "Stay Love",    youtubeId: "hLWLS-Csppw" },
  { title: "Bad Dreams",    youtubeId: "iMIZf1YY0zs" },
  { title: "Runnin' Home to You",    youtubeId: "f4a1vf7l-jI" },
  { title: "Iris",      youtubeId: "hpy8F9uzqv0" },
  { title: "Amsterdam",   youtubeId: "lz2qpnRB5_E" },
  { title: "San Luis",     youtubeId: "7BJ7MDOmLPE" },
  { title: "Flightless Bird, American Mouth",      youtubeId: "RGVmhrfQqzg" },
  { title: "If We Were Vampires",   youtubeId: "246pND4SGXk" },
];

const playlistB = [
  { title: "Human Nature",   youtubeId: "YNzuiRuQNYY" },
  { title: "Rosary",   youtubeId: "xTkOUOkHQfI" },
  { title: "I THINK YOU'RE SPECIAL",   youtubeId: "Pk-2Ha1e2sc" },
  { title: "Big Black Car",   youtubeId: "JgumMOMHpns" },
  { title: "Road Trips",   youtubeId: "HhS8eJES-C8" },
  { title: "Orange Juice",   youtubeId: "WtKTfzNcX9Y" },
  { title: "Treat You Better",   youtubeId: "29bfaHc1XiY" },
  { title: "Floating",   youtubeId: "m8t5mqYO9Yc" },
  { title: "LA FAMA",   youtubeId: "BwBVEB3jGLs" },
  { title: "Dive",   youtubeId: "NM4e606yFJg" },
  { title: "",   youtubeId: "" },
  { title: "",   youtubeId: "" },
  { title: "",   youtubeId: "" },
  { title: "",   youtubeId: "" },
];

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
  { src: "assets/images/photo14.jpg", caption: "" },
];


(function () {
  "use strict";

  function setVinylArt(imgEl, src) {
    if (!imgEl) return;
    // clear any "hide on error" state left over from a previous missing image
    // (e.g. flipping to a Side B image that doesn't exist yet, then back to Side A)
    imgEl.style.display = "";
    imgEl.src = src;
  }

  function applyConfig() {
    document.title = CONFIG.siteTitle;

    if (CONFIG.backgroundImage) {
      const backdrop = document.getElementById("home-backdrop");
      backdrop.style.backgroundImage =
        `linear-gradient(180deg, rgba(243,236,221,0.55), rgba(228,212,180,0.72)), url("${CONFIG.backgroundImage}")`;
      backdrop.style.backgroundSize = "cover";
      backdrop.style.backgroundPosition = "center";
    }

    const miniArt = document.getElementById("mini-vinyl-art");
    const playerArt = document.getElementById("player-vinyl-art");
    setVinylArt(miniArt, CONFIG.vinylArt);
    setVinylArt(playerArt, CONFIG.vinylArt);
  }

  const screens = {
    home: document.getElementById("home-screen"),
    player: document.getElementById("player-screen"),
    gallery: document.getElementById("gallery-screen"),
    journal: document.getElementById("journal-screen"),
  };

  function showScreen(name) {
    Object.entries(screens).forEach(([key, el]) => {
      if (!el) return;
      el.classList.toggle("is-active", key === name);
    });

    if (name !== "journal") {
      lockJournal();
    }
  }

  function initNavigation() {
    const openPlayer = document.getElementById("open-player");
    const openGallery = document.getElementById("open-gallery");
    const openJournal = document.getElementById("open-journal");
    const backButtons = document.querySelectorAll("[data-back]");
    const backKeepMusicButtons = document.querySelectorAll("[data-back-keep-music]");

    openPlayer.addEventListener("click", () => {
      showScreen("player");
      resetToSideA();
      playSongAt(0);
    });

    openGallery.addEventListener("click", () => {
      triggerCameraFlash();
      showScreen("gallery");
    });

    openJournal.addEventListener("click", () => {
      showScreen("journal");
      refreshJournalLockState();
    });

    // plain "back" buttons: only the one on the record player screen actually
    // stops the music. Everywhere else, music (if playing) just keeps going.
    backButtons.forEach((btn) => {
      const stopsMusic = btn.closest("#player-screen") !== null;
      btn.addEventListener("click", () => {
        if (stopsMusic) pausePlayback();
        showScreen("home");
      });
    });

    // "back (with music)": always goes home, music keeps playing uninterrupted
    // until the player screen is opened again.
    backKeepMusicButtons.forEach((btn) =>
      btn.addEventListener("click", () => showScreen("home"))
    );
  }

  function triggerCameraFlash() {
    const flash = document.querySelector(".mini-camera__flash-burst");
    if (!flash) return;
    flash.classList.add("is-flashing");
    flash.addEventListener("animationend", function handler() {
      flash.classList.remove("is-flashing");
      flash.removeEventListener("animationend", handler);
    });
  }

  /* playlist ui \u2014 activePlaylist points at either `playlist` (Side A) or `playlistB` (Side B) */
  const playlistEl = document.getElementById("playlist");
  let currentIndex = 0;
  let activePlaylist = playlist;

  /* side A / side B flip */
  let currentSide = "A";

  function resetToSideA() {
    currentSide = "A";
    activePlaylist = playlist;
    currentIndex = 0;
    const sideLabel = document.getElementById("side-label");
    const playerArt = document.getElementById("player-vinyl-art");
    if (sideLabel) sideLabel.innerHTML = "Side&nbsp;A";
    setVinylArt(playerArt, CONFIG.vinylArt);
    buildPlaylist();
  }

  function initSideFlip() {
    const flipBtn = document.getElementById("flip-side");
    const sideLabel = document.getElementById("side-label");
    const playerArt = document.getElementById("player-vinyl-art");
    if (!flipBtn || !sideLabel || !playerArt) return;

    flipBtn.addEventListener("click", () => {
      currentSide = currentSide === "A" ? "B" : "A";
      activePlaylist = currentSide === "A" ? playlist : playlistB;
      sideLabel.innerHTML = currentSide === "A" ? "Side&nbsp;A" : "Side&nbsp;B";
      setVinylArt(playerArt, currentSide === "A" ? CONFIG.vinylArt : CONFIG.vinylArtSideB);

      flipBtn.classList.add("is-flipping");
      window.setTimeout(() => flipBtn.classList.remove("is-flipping"), 500);

      // flipping stops whatever was playing and rebuilds the list for the new side
      pausePlayback();
      setPlayingUI(false);
      currentIndex = 0;
      buildPlaylist();
      const nowPlaying = document.getElementById("now-playing");
      if (nowPlaying) nowPlaying.textContent = "Choose a song to begin";
    });
  }

  function buildPlaylist() {
    playlistEl.innerHTML = "";
    activePlaylist.forEach((song, i) => {
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
    highlightActiveSong();
  }

  function highlightActiveSong() {
    document.querySelectorAll(".playlist__item").forEach((li) => {
      li.classList.toggle("is-active", Number(li.dataset.index) === currentIndex);
    });
    const nowPlaying = document.getElementById("now-playing");
    const song = activePlaylist[currentIndex];
    if (nowPlaying && song) {
      nowPlaying.textContent = song.title || `Track ${currentIndex + 1}`;
    }
  }

  /* youtube iframe api integration*/
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
      // keep playing straight through the list; stop after the last track.
      if (currentIndex < activePlaylist.length - 1) {
        goNext();
      } else {
        setPlayingUI(false);
      }
    }
  }

  function loadAndPlay(index) {
    const song = activePlaylist[index];
    if (!song || !song.youtubeId || !ytReady) {
      highlightActiveSong();
      return;
    }
    ytPlayer.loadVideoById(song.youtubeId);
  }

  function playSongAt(index) {
    if (index < 0 || index >= activePlaylist.length) return;
    currentIndex = index;
    highlightActiveSong();
    loadAndPlay(index);
  }

  function goNext() {
    if (currentIndex < activePlaylist.length - 1) playSongAt(currentIndex + 1);
  }

  function goPrev() {
    if (currentIndex > 0) playSongAt(currentIndex - 1);
  }

  function togglePlayPause() {
    if (!ytReady) return;
    const state = ytPlayer.getPlayerState();
    if (state === YT.PlayerState.PLAYING) {
      ytPlayer.pauseVideo();
    } else if (activePlaylist[currentIndex] && activePlaylist[currentIndex].youtubeId) {
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

  /* visual state, tonearm movement */
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

  /* play, pause, next, previous */
  function initControls() {
    btnPlay.addEventListener("click", togglePlayPause);
    document.getElementById("btn-next").addEventListener("click", goNext);
    document.getElementById("btn-prev").addEventListener("click", goPrev);
  }

  /* grid of all photos */
  const galleryGrid = document.getElementById("gallery-grid");

  function buildGallery() {
    galleryGrid.innerHTML = "";
    photos.forEach((photo, i) => {
      const item = document.createElement("div");
      item.className = "gallery-item";
      // tilt per photo
      const tilt = ((i % 5) - 2) * 1.1;
      item.style.setProperty("--tilt", `${tilt}deg`);
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-label", `Enlarge photograph ${i + 1}`);

      const img = document.createElement("img");
      img.src = photo.src;
      img.loading = "eager";
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

  /* photo enlarge */
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

  /* hidden letter */
  const letterOverlay = document.getElementById("letter-overlay");
  const letterText = document.getElementById("letter-overlay-text");

  function openLetter() {
    letterText.textContent = CONFIG.hiddenLetterText;
    letterOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLetter() {
    letterOverlay.hidden = true;
    document.body.style.overflow = "";
  }

  function initHiddenLetter() {
    const trigger = document.getElementById("hidden-letter");
    if (!trigger) return;
    trigger.addEventListener("click", openLetter);
    document.getElementById("letter-overlay-close").addEventListener("click", closeLetter);
    letterOverlay.addEventListener("click", (e) => {
      if (e.target === letterOverlay) closeLetter();
    });
    document.addEventListener("keydown", (e) => {
      if (!letterOverlay.hidden && e.key === "Escape") closeLetter();
    });
  }

  /* journal: password gate (re-asked every visit), JSON-backed entries, calendar view */
  const JOURNAL_DATA_URL = "assets/data/journal.json";
  let journalEntries = [];       // loaded from journal.json at startup
  let previewEntries = [];       // entries added this session, not yet in the downloaded file
  let journalUnlockedThisVisit = false;
  let journalDataLoaded = false;

  function loadJournalData() {
    fetch(JOURNAL_DATA_URL, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        journalEntries = Array.isArray(data) ? data : [];
        journalDataLoaded = true;
        if (journalUnlockedThisVisit) buildJournalCalendar();
      })
      .catch(() => {
        journalEntries = [];
        journalDataLoaded = true;
      });
  }

  function lockJournal() {
    journalUnlockedThisVisit = false;
    const lock = document.getElementById("journal-lock");
    const content = document.getElementById("journal-content");
    const input = document.getElementById("journal-password-input");
    const error = document.getElementById("journal-lock-error");
    if (lock) lock.hidden = false;
    if (content) content.hidden = true;
    if (input) input.value = "";
    if (error) error.hidden = true;
  }

  function refreshJournalLockState() {
    const lock = document.getElementById("journal-lock");
    const content = document.getElementById("journal-content");
    if (!lock || !content) return;
    lock.hidden = journalUnlockedThisVisit;
    content.hidden = !journalUnlockedThisVisit;
    if (journalUnlockedThisVisit) buildJournalCalendar();
  }

  function initJournalLock() {
    const form = document.getElementById("journal-lock-form");
    const input = document.getElementById("journal-password-input");
    const error = document.getElementById("journal-lock-error");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (input.value === CONFIG.journalPassword) {
        error.hidden = true;
        input.value = "";
        journalUnlockedThisVisit = true;
        refreshJournalLockState();
      } else {
        error.hidden = false;
      }
    });
  }

  /* calendar rendering, grouped by month */
  const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const MONTH_LABELS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Parses "YYYY-MM-DD" without timezone surprises, returns null if unparseable.
  function parseIsoDate(str) {
    if (typeof str !== "string") return null;
    const m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    const year = Number(m[1]), month = Number(m[2]) - 1, day = Number(m[3]);
    const d = new Date(year, month, day);
    if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) return null;
    return d;
  }

  function openJournalEntryView(entry) {
    const overlay = document.getElementById("journal-entry-view");
    const dateEl = document.getElementById("journal-entry-view-date");
    const textEl = document.getElementById("journal-entry-view-text");
    const parsed = parseIsoDate(entry.date);
    dateEl.textContent = parsed
      ? parsed.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
      : (entry.date || "Undated");
    textEl.textContent = entry.text || "";
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function initJournalEntryView() {
    const overlay = document.getElementById("journal-entry-view");
    const closeBtn = document.getElementById("journal-entry-view-close");
    function close() {
      overlay.hidden = true;
      document.body.style.overflow = "";
    }
    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", (e) => {
      if (!overlay.hidden && e.key === "Escape") close();
    });
  }

  function buildJournalCalendar() {
    const container = document.getElementById("journal-entries");
    if (!container) return;
    container.innerHTML = "";

    const combined = journalEntries
      .map((e) => ({ ...e, isPreview: false }))
      .concat(previewEntries.map((e) => ({ ...e, isPreview: true })));

    const scheduled = combined.filter((e) => parseIsoDate(e.date));
    const undated = combined.filter((e) => !parseIsoDate(e.date));

    if (combined.length === 0) {
      const empty = document.createElement("p");
      empty.className = "journal-empty";
      empty.textContent = "No entries yet \u2014 tap the + to write the first one.";
      container.appendChild(empty);
      return;
    }

    // group scheduled entries by year-month, most recent month first
    const groups = new Map();
    scheduled.forEach((entry) => {
      const d = parseIsoDate(entry.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!groups.has(key)) groups.set(key, { year: d.getFullYear(), month: d.getMonth(), entries: [] });
      groups.get(key).entries.push(entry);
    });

    const sortedGroups = Array.from(groups.values()).sort((a, b) => {
      return b.year - a.year || b.month - a.month;
    });

    sortedGroups.forEach((group) => {
      const monthWrap = document.createElement("div");
      monthWrap.className = "journal-calendar-month";

      const title = document.createElement("h3");
      title.className = "journal-calendar-month__title";
      title.textContent = `${MONTH_LABELS[group.month]} ${group.year}`;
      monthWrap.appendChild(title);

      const grid = document.createElement("div");
      grid.className = "journal-calendar-grid";

      WEEKDAY_LABELS.forEach((label) => {
        const wd = document.createElement("div");
        wd.className = "journal-calendar-weekday";
        wd.textContent = label;
        grid.appendChild(wd);
      });

      const firstOfMonth = new Date(group.year, group.month, 1);
      const daysInMonth = new Date(group.year, group.month + 1, 0).getDate();
      const startOffset = firstOfMonth.getDay();

      const entriesByDay = new Map();
      group.entries.forEach((entry) => {
        const day = parseIsoDate(entry.date).getDate();
        if (!entriesByDay.has(day)) entriesByDay.set(day, []);
        entriesByDay.get(day).push(entry);
      });

      for (let i = 0; i < startOffset; i++) {
        const blank = document.createElement("div");
        blank.className = "journal-calendar-day journal-calendar-day--blank";
        grid.appendChild(blank);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement("div");
        const dayEntries = entriesByDay.get(day);

        if (dayEntries && dayEntries.length) {
          const anyPreview = dayEntries.some((e) => e.isPreview);
          cell.className = "journal-calendar-day journal-calendar-day--has-entry" +
            (anyPreview ? " journal-calendar-day--preview" : "");
          cell.setAttribute("role", "button");
          cell.setAttribute("tabindex", "0");
          cell.setAttribute("aria-label", `Read journal entry for ${MONTH_LABELS[group.month]} ${day}`);
          const openThisDay = () => {
            const combinedText = dayEntries.map((e) => e.text).join("\n\n");
            openJournalEntryView({ date: dayEntries[0].date, text: combinedText });
          };
          cell.addEventListener("click", openThisDay);
          cell.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openThisDay(); }
          });
        } else {
          cell.className = "journal-calendar-day";
        }
        cell.textContent = String(day);
        grid.appendChild(cell);
      }

      monthWrap.appendChild(grid);
      container.appendChild(monthWrap);
    });

    // entries with an unrecognized date format still need to be reachable
    if (undated.length) {
      const monthWrap = document.createElement("div");
      monthWrap.className = "journal-calendar-month";
      const title = document.createElement("h3");
      title.className = "journal-calendar-month__title";
      title.textContent = "Undated";
      monthWrap.appendChild(title);

      undated.forEach((entry) => {
        const row = document.createElement("div");
        row.className = "journal-calendar-day journal-calendar-day--has-entry";
        row.style.width = "100%";
        row.style.aspectRatio = "auto";
        row.style.padding = "0.6rem";
        row.textContent = entry.date || "(no date)";
        row.addEventListener("click", () => openJournalEntryView(entry));
        monthWrap.appendChild(row);
      });
      container.appendChild(monthWrap);
    }
  }

  function showJournalToast(message) {
    const toast = document.getElementById("journal-toast");
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(showJournalToast._t);
    showJournalToast._t = window.setTimeout(() => { toast.hidden = true; }, 4200);
  }

  function downloadJournalJson(entries) {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "journal.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function initJournalComposer() {
    const addButton = document.getElementById("journal-add-button");
    const composer = document.getElementById("journal-composer");
    const dateInput = document.getElementById("journal-composer-date");
    const textInput = document.getElementById("journal-composer-text");
    const cancelBtn = document.getElementById("journal-composer-cancel");
    const saveBtn = document.getElementById("journal-composer-save");

    if (!addButton) return;

    function todayIso() {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }

    function openComposer() {
      dateInput.value = todayIso();
      textInput.value = "";
      composer.hidden = false;
      window.setTimeout(() => textInput.focus(), 50);
    }

    function closeComposer() {
      composer.hidden = true;
    }

    addButton.addEventListener("click", openComposer);
    cancelBtn.addEventListener("click", closeComposer);
    composer.addEventListener("click", (e) => {
      if (e.target === composer) closeComposer();
    });

    saveBtn.addEventListener("click", () => {
      const date = dateInput.value;
      const text = textInput.value.trim();
      if (!text) {
        textInput.focus();
        return;
      }

      previewEntries.push({ date, text });
      closeComposer();
      buildJournalCalendar();

      const fullEntries = journalEntries.concat(previewEntries);
      downloadJournalJson(fullEntries);
      showJournalToast(
        "Saved here as a preview \u2014 journal.json just downloaded. Replace assets/data/journal.json with it and push to make it permanent."
      );
    });
  }

  function init() {
    applyConfig();
    initNavigation();
    buildPlaylist();
    buildGallery();
    initControls();
    initEnlargeOverlay();
    initSideFlip();
    initHiddenLetter();
    initJournalLock();
    initJournalEntryView();
    initJournalComposer();
    loadJournalData();
    highlightActiveSong();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
