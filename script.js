document.addEventListener("DOMContentLoaded", () => {
  const frontVid = document.getElementById("boko-video-front");

  // --- Boko ---
  const backVids = {
    ArrowLeft: document.getElementById("back-left"),
    ArrowRight: document.getElementById("back-right"),
    ArrowUp: document.getElementById("back-up"),
    ArrowDown: document.getElementById("back-down"),
  };
  const directions = Object.keys(backVids);

  const randomEventSet = [
    "vid/BokoCredit.mp4","vid/BokoEvent1.mp4","vid/BokoEvent2.mp4","vid/BokoEventA.mp4",
    "vid/BokoEventB.mp4","vid/BokoEventC.mp4","vid/BokoEventD.mp4","vid/BokoFight.mp4"
  ];
  const randomRelaxSet = [
    "vid/BokoCake.mp4","vid/BokoCamp.mp4","vid/BokoFish.mp4","vid/BokoKiss.mp4",
    "vid/BokoStars.mp4","vid/BokoTV.mp4","vid/BokoZzz.mp4"
  ];

  let lastDirection = "ArrowLeft";
  let currentAction = null;
  let gestureUnlocked = false; // <-- NEW: tracks first mobile gesture

  // --- Preload Back Videos ---
  for (const dir of directions) {
    const v = backVids[dir];
    v.src = `vid/Boko${dir.slice(5)}.mp4`;
    v.preload = "auto";
    v.muted = true;
    v.addEventListener("loadeddata", function handleLoad() {
      v.removeEventListener("loadeddata", handleLoad);
      v.currentTime = 0;
      v.play();
      v.pause();
    });
  }

  // --- Preload Specials ---
  const allSpecials = [...randomEventSet, ...randomRelaxSet, "vid/BokoRoller.mp4","vid/BokoLevel.mp4","vid/BokoHop.mp4"];
  const videoCache = {};
  allSpecials.forEach(src => {
    const v = document.createElement("video");
    v.src = src;
    v.preload = "auto";
    v.muted = true;
    v.play();
    v.pause();
    videoCache[src] = v;
  });

  // --- Show Back Direction ---
  function showBack(dirKey) {
    for (const dir of directions) {
      backVids[dir].style.visibility = dir === dirKey ? "visible" : "hidden";
    }
    lastDirection = dirKey;
    currentAction = null;
    const v = backVids[dirKey];
    if (v.paused) v.play();
  }

  // --- Play Special ---
  function playSpecial(src, { onend = null } = {}) {
    if (currentAction) return;
    currentAction = "special";
    frontVid.src = videoCache[src].src;
    frontVid.currentTime = 0;
    frontVid.style.visibility = "visible";
    frontVid.onended = () => {
      frontVid.style.visibility = "hidden";
      currentAction = null;
      if (onend) onend();
      else showBack(lastDirection);
    };
    frontVid.play();
  }

  // --- Battle Sequence ---
  function playBokoFightSequence() {
    const sequence = ["vid/BokoFight.mp4", "vid/BokoRoller.mp4"];
    if (Math.random() < 0.15) sequence.push("vid/BokoLevel.mp4");

    let index = 0;
    function playNext() {
      if (index < sequence.length) {
        playSpecial(sequence[index], { onend: playNext });
        index++;
      } else {
        showBack(lastDirection);
      }
    }
    playNext();
  }

  // --- Desktop Key Controls ---
  document.addEventListener("keydown", e => {
    if (e.repeat) return;
    if (directions.includes(e.key)) { if (!currentAction) showBack(e.key); return; }
    if (e.key === " ") { playSpecial("vid/BokoHop.mp4"); return; }
    if (e.key.toLowerCase() === "e") {
      if (!currentAction) {
        const randomVideo = randomEventSet[Math.floor(Math.random() * randomEventSet.length)];
        if (randomVideo.includes("BokoFight")) playBokoFightSequence();
        else playSpecial(randomVideo);
      }
      return;
    }
    if (e.key.toLowerCase() === "r") {
      if (!currentAction) {
        const randomVideo = randomRelaxSet[Math.floor(Math.random() * randomRelaxSet.length)];
        playSpecial(randomVideo);
      }
      return;
    }
  });

  // --- Click to Play / Gesture Unlock ---
  const clickOverlay = document.getElementById("start");
  clickOverlay.style.display = "flex";
  clickOverlay.addEventListener("click", () => {
    clickOverlay.style.display = "none";

    // --- NEW: Unlock mobile gesture ---
    gestureUnlocked = true;
    const firstVid = backVids[lastDirection];
    if (firstVid && firstVid.paused) firstVid.play().then(() => firstVid.pause());
  });

  // --- Initialize ---
  window.focus();
  showBack(lastDirection);

  // --- Mobile Swipe / Tap Controls ---
  const SWIPE_THRESHOLD = 50;
  const TAP_THRESHOLD = 10;
  let touchStartX = 0;
  let touchStartY = 0;
  let lastTap = 0;
  let doubleTapPending = false;

  const popup = document.getElementById("boko-popup");
  if (popup) {
    // Only disable pull-to-refresh / back-swipe
    popup.style.touchAction = "none";

    popup.addEventListener("touchstart", e => {
      if (!gestureUnlocked) return; // ignore until first gesture
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
    });

    popup.addEventListener("touchend", e => {
      if (!gestureUnlocked) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      const now = Date.now();

      // Double Tap
      if (now - lastTap < 300) {
        doubleTapPending = true;
        lastTap = 0;
        if (!currentAction) {
          const set = Math.random() < 0.5 ? randomEventSet : randomRelaxSet;
          const randomVideo = set[Math.floor(Math.random() * set.length)];
          if (randomVideo.includes("BokoFight")) playBokoFightSequence();
          else playSpecial(randomVideo);
        }
        setTimeout(() => (doubleTapPending = false), 300);
        return;
      }

      lastTap = now;

      // Swipe Detect
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > SWIPE_THRESHOLD && !currentAction) showBack("ArrowRight");
        else if (dx < -SWIPE_THRESHOLD && !currentAction) showBack("ArrowLeft");
      } else {
        if (dy > SWIPE_THRESHOLD && !currentAction) showBack("ArrowDown");
        else if (dy < -SWIPE_THRESHOLD && !currentAction) showBack("ArrowUp");
      }

      // Tap
      if (Math.abs(dx) < TAP_THRESHOLD && Math.abs(dy) < TAP_THRESHOLD) {
        setTimeout(() => {
          if (!doubleTapPending && !currentAction) {
            playSpecial("vid/BokoHop.mp4");
          }
        }, 300);
      }
    });
  }
});
