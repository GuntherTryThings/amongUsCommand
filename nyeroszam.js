let Parser = require('rss-parser');
let parser = new Parser();
const Discord = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

let str;
let elso = false;
let impostor;
let died;

async function main(msg) {
    let feed = await parser.parseURL('https://koronavirus.gov.hu/cikkek/rss.xml');
   
    feed.items.forEach(item => {
        if(!elso && item.title.includes("fővel emelkedett a beazonosított fertőzöttek száma")) str = item.title.slice(0).trim().split(' '), elso = true;
    });

    impostor = parseInt(str[0]);
    died = parseInt(str[9]);

    const canvas = createCanvas(1250, 600)
    const ctx = canvas.getContext('2d')

    let x = 20, y = 75;
    let block = 0;

    ctx.font = "bold 50px Verdana";
    ctx.fillStyle = 'white';
    ctx.fillText(`There are               ${impostor < 1000 ? '' : '  '}            among us`, 100, 50);
    ctx.fillStyle = 'red';
    ctx.fillText(`${impostor} Impostors`, 390, 50);
    ctx.fillStyle = 'white';
    ctx.fillText(`${died < 10 ? '' : '  '} died`, 670, 520);
    ctx.fillStyle = 'cyan';
    ctx.fillText(`${died} Crewmate`, 330, 520);

    for(let i = 0; i < impostor; i++) {
        let myimg = await loadImage(`images/amongUsCharacters/${Math.floor(Math.random()*12)+1}.png`)
        ctx.drawImage(myimg, x, y, 20, 30);
        x += 10;
        if(i%12 == 11) block++;
        if(block == 10) y += 43, x = 20, block = 0;
    }

    y = 545;
    x = 20;

    for(let i = 0; i < died; i++) {
        let myimg = await loadImage(`images/amongUsCharacters/${Math.floor(Math.random()*12)+1}.png`)
        ctx.drawImage(myimg, x, y, 20, 30);
        let myX = await loadImage(`images/amongUsCharacters/x.png`)
        ctx.drawImage(myX, x+3, y-5, 30, 30);
        x += 30;
        if(i%12 == 11) block++;
        if(block == 10) y += 43, x = 20, block = 0;
    }

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'nyeroszamCanvas.png');
    msg.channel.send(attachment);
}

module.exports = main