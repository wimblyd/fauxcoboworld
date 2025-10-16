document.addEventListener("DOMContentLoaded", () => {
  const backVid = document.getElementById("boko-video-back");
  const frontVid = document.getElementById("boko-video-front");

  const directions = {
    ArrowLeft: "vid/BokoLeft.mp4",
    ArrowRight: "vid/BokoRight.mp4",
    ArrowUp: "vid/BokoUp.mp4",
    ArrowDown: "vid/BokoDown.mp4",
  };

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

  function preloadVideos(videoList) {
    videoList.forEach(src => {
      const v = document.createElement("video");
      v.src = src;
      v.preload = "auto";
      v.muted = true;
      v.play(); 
      v.pause(); 
      videoCache[src] = v;
    });
  }

  preloadVideos([
    ...Object.values(directions),
    ...randomEventSet,
    ...randomRelaxSet,
    "vid/BokoRoller.mp4",
    "vid/BokoLevel.mp4",
    "vid/BokoHop.mp4"
  ]);

  // Walk
  function setDirection(dirKey) {
    lastDirection = dirKey;
    const src = directions[dirKey];
    backVid.src = src;
    backVid.currentTime = 0;
    backVid.play();
    currentAction = null;
  }

  // Event
  function playSpecial(src, { onend = null } = {}) {
    if (currentAction) return;
    currentAction = "special";

    const cachedVid = videoCache[src];
    if (!cachedVid) return console.warn("Video not preloaded:", src);

    frontVid.src = cachedVid.src;
    frontVid.currentTime = 0;
    frontVid.style.visibility = "visible";

    frontVid.onended = () => {
      frontVid.style.visibility = "hidden";
      currentAction = null;
      if (onend) onend();
      else setDirection(lastDirection);
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
        setDirection(lastDirection);
      }
    }

    playNext();
  }

  // Key Handlers
  document.addEventListener("keydown", (e) => {
    if (e.repeat) return;

    // Directions
    if (directions[e.key]) {
      if (!currentAction) setDirection(e.key);
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
  setDirection(lastDirection);
});
