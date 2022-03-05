const { Client, Intents } = require("discord.js");
const { createCanvas } = require("canvas");
const fs = require("fs");
require("dotenv").config();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once("ready", () => {
  console.log("Ready!");
});

client.login(process.env.TOKEN);

client.on("messageCreate", async (msg) => {
  // console.log(msg);
  let [cmd, depth] = msg.content.split(" ");
  cmd = cmd.toLowerCase();
  if (cmd == "trougo" || cmd == "trougao") {
    if (depth > 8) {
      depth = 8;
    }
    if (depth < 0) {
      depth = 0;
    }

    if (!depth || isNaN(depth)) {
      await msg.reply("Molimo Vas unesite red rekurzije (0-8)");
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createSierpinskiTriangle([0, 1000], 1000, depth);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync("./triangle.png", buffer);
    await msg.reply({ files: ["./triangle.png"] });
    fs.unlinkSync("./triangle.png");
  }
});

// Triangle stuff
const canvas = createCanvas(1000, 1000);
const ctx = canvas.getContext("2d");
const createTriangle = (pos, sidelen) => {
  ctx.beginPath();
  ctx.moveTo(...pos);
  const colors = ["red", "green", "yellow", "blue"];
  const ran = Math.floor(Math.random() * colors.length);
  ctx.fillStyle = colors[ran];
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
