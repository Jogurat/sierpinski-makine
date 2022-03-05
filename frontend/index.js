// Dom elements
const depthDisplay = document.getElementById("current-depth");
const depthInput = document.querySelector("#depth");
const clr1El = document.querySelector("#clr1");
const clr2El = document.querySelector("#clr2");
const clr3El = document.querySelector("#clr3");

// Params
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
const depthParam = params.depth;
const clr1 = params.clr1;
const clr2 = params.clr2;
const clr3 = params.clr3;
const numSequence = params.nums;

// Global variables
let isRandom = true;
let nums = "";
let numSequenceCounter = 0;
let colors = [];

// If clr1 param exists
if (clr1) {
  // Next generate will not be random
  isRandom = false;

  // Populate the UI with the params
  depthInput.value = depthParam;
  depthDisplay.innerText = depthParam;
  clr1El.value = `#${clr1}`;
  clr2El.value = `#${clr2}`;
  clr3El.value = `#${clr3}`;

  // Generate triangle
  generate(depthParam);

  // Next generate will be random
  isRandom = true;
}

// Discord server data
getDiscordData();
async function getDiscordData() {
  const res = await fetch(
    "https://discord.com/api/guilds/949634776606838794/widget.json"
  );

  const discordData = await res.json();

  const onlineNumber = discordData.members.length;
  const membersNumber = discordData.presence_count;

  document.querySelector(
    "#online-number"
  ).innerHTML = `🟢 ${onlineNumber} Online`;

  document.querySelector(
    "#members-number"
  ).innerHTML = `⚫ ${membersNumber} Members`;

  console.log(discordData);

  document.querySelector("#join-btn").addEventListener("click", () => {
    window.open(discordData.instant_invite, "_blank");
  });
}

// Depth range event listener
depthInput.addEventListener("input", (e) => {
  depthDisplay.innerText = depthInput.value;
});

// Copy url
const copyUrl = () => {
  const copySucc = document.getElementById("copy-succ");

  let url = window.location.host;

  if (colors[0]) {
    url += `?depth=${depthInput.value}&clr1=${colors[0].value.replace(
      "#",
      ""
    )}&clr2=${colors[1].value.replace("#", "")}&clr3=${colors[2].value.replace(
      "#",
      ""
    )}&nums=${nums}`;
  }

  navigator.clipboard.writeText(url);
  copySucc.style.display = "block";
  setTimeout(() => {
    copySucc.style.opacity = 1;
  }, 100);
  setTimeout(() => {
    copySucc.style.opacity = 0;
  }, 1600);
  setTimeout(() => {
    copySucc.style.display = "none";
  }, 2100);
};

/////// Triangle functions ///////
const canvasObj = document.getElementById("canvas");
const ctx = canvasObj.getContext("2d");

function generate(depth) {
  nums = "";
  ctx.clearRect(0, 0, canvasObj.width, canvasObj.height);
  let num = depthInput.value;
  if (depth) num = depth;
  createSierpinskiTriangle([0, 750], 750, num);
}

function createTriangle(pos, sidelen) {
  ctx.beginPath();
  ctx.moveTo(...pos);

  let fillStyle = "";
  if (!isRandom) {
    // NOT RANDOM
    colors = [clr1, clr2, clr3];
    fillStyle = `#${colors[numSequence[numSequenceCounter++]]}`;
  } else {
    // RANDOM
    colors = [...document.querySelectorAll("input[type='color']")];
    const ran = Math.floor(Math.random() * colors.length);
    fillStyle = colors[ran].value;
    nums += ran;
  }
  ctx.fillStyle = fillStyle;
  ctx.lineTo(pos[0] + sidelen / 2, pos[1] - sidelen * Math.sin(Math.PI / 3));
  ctx.lineTo(pos[0] + sidelen, pos[1]);
  ctx.lineTo(...pos);
  ctx.closePath();
  ctx.fill();
}

function createSierpinskiTriangle(pos, sidelen, depth) {
  const innerTriangleSidelen = sidelen / 2;
  const innerTrianglesPositions = [
    pos,
    [pos[0] + innerTriangleSidelen, pos[1]],
    [
      pos[0] + innerTriangleSidelen / 2,
      pos[1] - Math.sin(Math.PI / 3) * innerTriangleSidelen,
    ],
  ];
  if (depth == 0) {
    innerTrianglesPositions.forEach((trianglePosition) => {
      createTriangle(trianglePosition, innerTriangleSidelen);
    });
  } else {
    innerTrianglesPositions.forEach((trianglePosition) => {
      createSierpinskiTriangle(
        trianglePosition,
        innerTriangleSidelen,
        depth - 1
      );
    });
  }
}
