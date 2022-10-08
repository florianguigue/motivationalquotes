let fetch = require('node-fetch');
let Jimp = require('jimp');

const API_BASE_HOST = 'https://zenquotes.io/api/';

async function getTodayQuote() {
    const response = await fetch(API_BASE_HOST + 'today');
    var data = await response.json();
    console.log('Quote of the day loaded !');
    return data[0];
}

async function loadFont(fontName) {
    const font = await Jimp.loadFont(`assets/fonts/${fontName}.fnt`);
    console.log('Font loaded !');
    return font;
}

async function readImage() {
    const image = await Jimp.read('assets/images/bg_low.jpg');
    console.log('Image loaded !');
    return image;
}

async function blurImage(image) {
    const bluredImage = image.blur(3);
    bluredImage.write(`output/bluredImage.${bluredImage.getExtension()}`);
    console.log('Image blured !');
    return bluredImage;
}

async function printText(fontQuote, fontAuthor, bluredImage, quote) {
    const imageWithQuote = bluredImage.print(fontQuote, 0, 0, {
        text: quote.q,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }, 640, 436);
    imageWithQuote.write(`output/imageWithQuote.${imageWithQuote.getExtension()}`);
    console.log('Image with quote created !');

    const imageWithQuoteAndAuthor = imageWithQuote.print(fontAuthor, 0, -35 ,{
        text: quote.a,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
    }, 640, 436);
    imageWithQuoteAndAuthor.write(`output/finalImage.${imageWithQuoteAndAuthor.getExtension()}`);
    console.log('Final image created !');
}

async function createMotivationalImage() {
    const fontQuote = await loadFont('font_text_48');
    const fontAuthor = await loadFont('font_author_32');
    const image = await readImage();
    const bluredImage = await blurImage(image);
    const quote = await getTodayQuote();
    await printText(fontQuote, fontAuthor, bluredImage, quote)
}

createMotivationalImage();