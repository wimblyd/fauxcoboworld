document.addEventListener("DOMContentLoaded", () => {
  const bokoVid = document.getElementById("boko-video");

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
    "vid/BokoFight.mp4" // special chain
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

  function playVideo(src, { loop = false, onend = null } = {}) {
    bokoVid.loop = loop;
    bokoVid.src = src;
    bokoVid.currentTime = 0;
    bokoVid.play();
    currentAction = loop ? null : "special";

    if (!loop) {
      bokoVid.onended = () => {
        currentAction = null;
        if (onend) onend();
        else setDirection(lastDirection);
      };
    } else {
      bokoVid.onended = null;
    }
  }

  function setDirection(dirKey) {
    lastDirection = dirKey;
    playVideo(directions[dirKey], { loop: true });
  }

  function playBokoFightSequence() {
    // Battle
    playVideo("vid/BokoFight.mp4", {
      onend: () => {
        // Roller
        playVideo("vid/BokoRoller.mp4", {
          onend: () => {
            // Level Up
            if (Math.random() < 0.15) {
              playVideo("vid/BokoLevel.mp4", {
                onend: () => setDirection(lastDirection)
              });
            } else {
              setDirection(lastDirection);
            }
          }
        });
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.repeat) return;

    // Walk
    if (directions[e.key]) {
      setDirection(e.key);
      return;
    }

    // Hop
    if (e.key === " ") {
      if (currentAction) return;
      playVideo("vid/BokoHop.mp4", { onend: () => setDirection(lastDirection) });
      return;
    }

    // E = random event
    if (e.key.toLowerCase() === "e" && !currentAction) {
      const randomVideo = randomEventSet[Math.floor(Math.random() * randomEventSet.length)];
      if (randomVideo.includes("BokoFight")) {
        playBokoFightSequence();
      } else {
        playVideo(randomVideo, { onend: () => setDirection(lastDirection) });
      }
      return;
    }

    // R = random relax animation
    if (e.key.toLowerCase() === "r" && !currentAction) {
      const randomVideo = randomRelaxSet[Math.floor(Math.random() * randomRelaxSet.length)];
      playVideo(randomVideo, { onend: () => setDirection(lastDirection) });
      return;
    }
  });

  // initialize default
  setDirection(lastDirection);
});
