document.addEventListener("DOMContentLoaded", () => {
  const bokoImg = document.getElementById("boko-img");

  const directions = {
    ArrowLeft: "img/BokoLeft.gif",
    ArrowRight: "img/BokoRight.gif",
    ArrowUp: "img/BokoUp.gif",
    ArrowDown: "img/BokoDown.gif",
  };

  const randomEventSet = [
    "img/BokoCredit.gif",
    "img/BokoEvent1.gif",
    "img/BokoEvent2.gif",
    "img/BokoEventA.gif",
    "img/BokoEventB.gif",
    "img/BokoEventC.gif",
    "img/BokoEventD.gif",
    "img/BokoFight.gif" 
  ];

  const randomRelaxSet = [
    "img/BokoCake.gif",
    "img/BokoCamp.gif",
    "img/BokoFish.gif",
    "img/BokoKiss.gif",
    "img/BokoStars.gif",
    "img/BokoTV.gif",
    "img/BokoZzz.gif"
  ];

  let lastDirection = "ArrowLeft"; // default
  let currentAction = null;

  function setDirection(dirKey) {
    bokoImg.src = directions[dirKey];
    lastDirection = dirKey;
  }

  function playTemporaryAnimation(src, duration, callback) {
    bokoImg.src = src;
    currentAction = "special";
    setTimeout(() => {
      if (callback) callback();
      else {
        setDirection(lastDirection);
        currentAction = null;
      }
    }, duration);
  }

  function playBokoFightSequence() {
    // Battle
    playTemporaryAnimation("img/BokoFight.gif", 2000, () => {
      // Level Roll
      playTemporaryAnimation("img/BokoRoller.gif", 2000, () => {
        // Level Up
        if (Math.random() < 0.15) {
          playTemporaryAnimation("img/BokoLevel.gif", 2500, () => {
            setDirection(lastDirection);
            currentAction = null;
          });
        } else {
          setDirection(lastDirection);
          currentAction = null;
        }
      });
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.repeat) return; // prevent key spam

    // Walk
    if (directions[e.key]) {
      setDirection(e.key);
      currentAction = null;
      return;
    }

    // Hop
    if (e.key === " ") {
      if (currentAction) return;
      currentAction = "hop";
      bokoImg.src = "img/BokoHop.gif";
      setTimeout(() => {
        setDirection(lastDirection);
        currentAction = null;
      }, 1000);
      return;
    }

    // E = random event
    if (e.key.toLowerCase() === "e" && !currentAction) {
      const randomImage = randomEventSet[Math.floor(Math.random() * randomEventSet.length)];

      if (randomImage.includes("BokoFight")) {
        // Special chained event!
        playBokoFightSequence();
      } else {
        playTemporaryAnimation(randomImage, 1500);
      }
      return;
    }

    // R = random heal
    if (e.key.toLowerCase() === "r" && !currentAction) {
      const randomImage = randomRelaxSet[Math.floor(Math.random() * randomRelaxSet.length)];
      playTemporaryAnimation(randomImage, 2000);
      return;
    }
  });

  // initialize default
  setDirection(lastDirection);
});
