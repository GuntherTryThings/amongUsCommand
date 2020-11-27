const Parser = require('rss-parser');
const parser = new Parser();

const Discord = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = async (message) => {
    const virusData = await getVirusData();
    var canvas = createCanvas(1250, Math.floor(virusData.infected / 120) * 48 +  Math.floor(virusData.died / 100) * 48 + 200);
    var canvasContext = canvas.getContext('2d');
    await fillCanvas(canvasContext, virusData);
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'nyeroszam.png');
    message.channel.send(attachment);
}

async function getVirusData() {
    const feed = await parser.parseURL('https://koronavirus.gov.hu/cikkek/rss.xml');
    const latestDataTitle = feed.items.find(element => element.title.includes('fővel emelkedett a beazonosított fertőzöttek száma')).title;
    const infected = parseInt(latestDataTitle.substring(0, 10));
    const died = parseInt(latestDataTitle.substring(latestDataTitle.length - 10, latestDataTitle.length - 1));

    return {
        infected,
        died
    }
}

async function fillCanvas(canvasContext, virusData) {
    let canvasData = {
        xCoord: 20,
        yCoord: 75
    };

    drawImpostorTitle(canvasContext, virusData);
    await drawImpostors(canvasContext, virusData, canvasData);
    canvasData = drawCrewmateTitle(canvasContext, virusData, canvasData);
    await drawCrewmates(canvasContext, virusData, canvasData);
}

function drawImpostorTitle(canvasContext, virusData) {
    canvasContext.font = 'bold 50px Verdana';
    canvasContext.fillStyle = 'white';
    canvasContext.fillText('There are' + 'among us'.padStart(32 + (`${virusData.infected}`.length - 3) * 6), 100, 50);
    canvasContext.fillStyle = 'red';
    canvasContext.fillText(`${virusData.infected} Impostors`, 390, 50);
}

async function drawImpostors(canvasContext, virusData, canvasData) {
    for (let i = 0; i < virusData.infected; i++) {
        const amongUsCharacterImage = await loadImage(`images/amongUsCharacters/${Math.floor(Math.random() * 12) + 1}.png`);
        canvasContext.drawImage(amongUsCharacterImage, canvasData.xCoord, canvasData.yCoord, 20, 30);
        canvasData.xCoord += 10;
        if (i % 120 == 119)
            canvasData = newRow(canvasData);
    }
}

function newRow(canvasData) {
    canvasData.yCoord += 43;
    canvasData.xCoord = 20;
    canvasData.rowNum = 0;

    return canvasData;
}

function drawCrewmateTitle(canvasContext, virusData, canvasData) {
    canvasData.yCoord += 100;
    canvasData.xCoord = 20;
    canvasContext.fillStyle = 'white';
    canvasContext.fillText(`died`.padStart(6 + (`${virusData.died}`.length - 1) * 2), 670, canvasData.yCoord);
    canvasContext.fillStyle = 'cyan';
    canvasContext.fillText(`${virusData.died} Crewmate`, 330, canvasData.yCoord);
    canvasData.yCoord += 50;

    return canvasData;
}

async function drawCrewmates(canvasContext, virusData, canvasData) {
    for (let i = 0; i < virusData.died; i++) {
        const amongUsCharacterImage = await loadImage(`images/amongUsCharacters/${Math.floor(Math.random() * 12) + 1}.png`);
        canvasContext.drawImage(amongUsCharacterImage, canvasData.xCoord, canvasData.yCoord, 20, 30);
        const xImage = await loadImage(`images/amongUsCharacters/x.png`);
        canvasContext.drawImage(xImage, canvasData.xCoord + 3, canvasData.yCoord, 25, 25);
        canvasData.xCoord += 30;
        if (i % 40 == 39)
            canvasData = newRow(canvasData);
    }
}