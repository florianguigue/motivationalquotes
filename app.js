let fetch = require('node-fetch');
let Jimp = require('jimp');
let fs = require('fs');
let configRaw = fs.readFileSync('config.json');
let config = JSON.parse(configRaw);

const API_BASE_HOST = 'https://zenquotes.io/api/';

console.log(config);

async function getTodayQuote() {
    const response = await fetch(API_BASE_HOST + 'today');
    var data = await response.json();
    console.log('Quote of the day loaded !');
    return data[0];
}

async function loadFont(fontName) {
    const font = await Jimp.loadFont(`${fontName}`);
    console.log('Font loaded !');
    return font;
}

async function readImage() {
    const image = await Jimp.read(config.image.path);
    console.log('Image loaded !');
    return image;
}

async function resizeImage(image) {
    const resizedImage = await image.resize(config.image.height, config.image.width);
    console.log('Image resized !');
    return resizedImage;
}

async function blurImage(image) {
    const bluredImage = image.blur(3);
    bluredImage.write(`output/bluredImage.${bluredImage.getExtension()}`);
    console.log('Image blured !');
    return bluredImage;
}

async function printText(fontQuote, fontAuthor, bluredImage, quote) {
    const imageWithQuote = bluredImage.print(fontQuote, config.image.margin, 0, {
        text: quote.q,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }, config.image.height - (2 * config.image.margin), config.image.width);
    imageWithQuote.write(`output/imageWithQuote.${imageWithQuote.getExtension()}`);
    console.log('Image with quote created !');

    const imageWithQuoteAndAuthor = imageWithQuote.print(fontAuthor, 0, -35 ,{
        text: quote.a,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
    }, config.image.height, config.image.width);
    imageWithQuoteAndAuthor.write(`output/finalImage.${imageWithQuoteAndAuthor.getExtension()}`);
    console.log('Final image created !');
}

async function createMotivationalImage() {
    const fontQuote = await loadFont(config.fonts.quote);
    const fontAuthor = await loadFont(config.fonts.author);
    const image = await readImage();
    const resizedImage = await resizeImage(image);
    const bluredImage = await blurImage(resizedImage);
    const quote = await getTodayQuote();
    await printText(fontQuote, fontAuthor, bluredImage, quote)
}

createMotivationalImage();