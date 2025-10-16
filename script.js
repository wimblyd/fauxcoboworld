document.addEventListener("DOMContentLoaded", () => {
  const frontVid = document.getElementById("boko-video-front");

  // Boko
  const backVids = {
    ArrowLeft: document.getElementById("back-left"),
    ArrowRight: document.getElementById("back-right"),
    ArrowUp: document.getElementById("back-up"),
    ArrowDown: document.getElementById("back-down"),
  };

  const directions = Object.keys(backVids);

  const randomEventSet = [
    "vid/BokoCredit.mp4",
    "vid/BokoEvent1.mp4",
    "vid/BokoEvent2.mp4",
    "vid/BokoEventA.mp4",
    "vid/BokoEventB.mp4",
    "vid/BokoEventC.mp4",
    "vid/BokoEventD.mp4",
    "vid/BokoFight.mp4"
  ];

  const randomRelaxSet = [
    "vid/BokoCake.mp4",
    "vid/BokoCamp.mp4",
    "vid/BokoFish.mp4",
    "vid/BokoKiss.mp4",
    "vid/BokoStars.mp4",
    "vid/BokoTV.mp4",
    "vid/BokoZzz.mp4"
  ];

  let lastDirection = "ArrowLeft";
  let currentAction = null;

  // Preload
  const videoCache = {};

  // Walk
  for (const dir of directions) {
    const v = backVids[dir];
    v.src = `vid/Boko${dir.slice(5)}.mp4`; // assumes ArrowLeft → BokoLeft.mp4
    v.preload = "auto";
    v.muted = true;
    v.play();
    videoCache[v.src] = v;
  }

  // Preload 2 Electric Boogaloo
  const allSpecials = [...randomEventSet, ...randomRelaxSet, "vid/BokoRoller.mp4", "vid/BokoLevel.mp4", "vid/BokoHop.mp4"];
  allSpecials.forEach(src => {
    const v = document.createElement("video");
    v.src = src;
    v.preload = "auto";
    v.muted = true;
    v.play(); // buffer it
    v.pause();
    videoCache[src] = v;
  });

  function showBack(dirKey) {
    for (const dir of directions) {
      backVids[dir].style.visibility = dir === dirKey ? "visible" : "hidden";
    }
    lastDirection = dirKey;
    currentAction = null;
  }

  // Event and Heal
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

  // Battle
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

  // Key Handlers
  document.addEventListener("keydown", e => {
    if (e.repeat) return;

    // Walk
    if (directions.includes(e.key)) {
      if (!currentAction) showBack(e.key);
      return;
    }

    // Hop
    if (e.key === " ") {
      playSpecial("vid/BokoHop.mp4");
      return;
    }

    // Random Event (E)
    if (e.key.toLowerCase() === "e") {
      if (!currentAction) {
        const randomVideo = randomEventSet[Math.floor(Math.random() * randomEventSet.length)];
        if (randomVideo.includes("BokoFight")) {
          playBokoFightSequence();
        } else {
          playSpecial(randomVideo);
        }
      }
      return;
    }

    // Random Relax (R)
    if (e.key.toLowerCase() === "r") {
      if (!currentAction) {
        const randomVideo = randomRelaxSet[Math.floor(Math.random() * randomRelaxSet.length)];
        playSpecial(randomVideo);
      }
      return;
    }
  });

  // Initialize
  showBack(lastDirection);
});
