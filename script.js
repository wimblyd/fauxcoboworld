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
  function preloadVideos(videoList) {
    videoList.forEach(src => {
      const v = document.createElement("video");
      v.src = src;
      v.preload = "auto";
      v.muted = true;
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
    backVid.src = directions[dirKey];
    backVid.currentTime = 0;
    backVid.play();
    currentAction = null;
  }

  // Event
  function playSpecial(src, { onend = null } = {}) {
    if (currentAction) return; // Prevent overlapping specials
    currentAction = "special";

    // Hide front video until fully loaded
    frontVid.style.visibility = "hidden";
    frontVid.src = src;
    frontVid.currentTime = 0;

    // Remove any previous loadeddata listener
    frontVid.onloadstart = null;

    // Show video when loaded
    const handleLoad = () => {
      frontVid.removeEventListener("loadeddata", handleLoad);
      frontVid.style.visibility = "visible";
      frontVid.play();
    };

    frontVid.addEventListener("loadeddata", handleLoad);

    frontVid.onended = () => {
      frontVid.style.visibility = "hidden";
      currentAction = null;
      if (onend) onend();
      else setDirection(lastDirection);
    };
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

    // Direction
    if (directions[e.key]) {
      if (!currentAction) setDirection(e.key);
      return;
    }

    // Hop
    if (e.key === " ") {
      playSpecial("vid/BokoHop.mp4");
      return;
    }

    // E = random event
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

    // R = random relax
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
