const copySucc = document.getElementById("copy-succ");
const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
const depthInput = document.getElementById("depth");
const depthValue = document.getElementById("current-depth");

let nums = "";
let isRandom = true;

// Params
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const generate = (depth) => {
  nums = "";
  ctx.clearRect(0, 0, c.width, c.height);
  let num = depthElement.value;
  if (depth) num = depth;
  createSierpinskiTriangle([0, 750], 750, num);
};

const createTriangle = (pos, sidelen) => {
  ctx.beginPath();
  ctx.moveTo(...pos);

  let fillStyle = "";
  if (!isRandom) {
    // NOT RANDOM
    colors = [clr1, clr2, clr3];
    fillStyle = `#${colors[numSequence[counter++]]}`;
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
};

const createSierpinskiTriangle = (pos, sidelen, depth) => {
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
};

const depthElement = document.querySelector("#depth");
const clr1El = document.querySelector("#clr1");
const clr2El = document.querySelector("#clr2");
const clr3El = document.querySelector("#clr3");
const depthParam = params.depth;
const clr1 = params.clr1;
const clr2 = params.clr2;
const clr3 = params.clr3;
const numSequence = params.nums;
let counter = 0;
// console.log("PARAMS" + value);
let colors = [];
if (clr1) {
  isRandom = false;
  console.log("NOT RANDOM POCETAK");
  console.log("clr1 je " + clr1);
  // Populate the UI with the params
  depthElement.value = depthParam;
  depthValue.innerText = depthParam;
  clr1El.value = `#${clr1}`;
  clr2El.value = `#${clr2}`;
  clr3El.value = `#${clr3}`;
  generate(depthParam);

  isRandom = true;
}

const copyUrl = () => {
  let url = window.location.host;

  if (colors[0]) {
    url += `?depth=${depthElement.value}&clr1=${colors[0].value.replace(
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

// GAGI JS

depthInput.addEventListener("input", (e) => {
  depthValue.innerText = depthInput.value;
});

// Discord
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
