document.addEventListener("DOMContentLoaded", function () {
    // Replace 'your-markdown-file.md' with the path to your Markdown file
    fetch('source/source.md')
        .then(response => response.text())
        .then(data => parseMarkdown(data));
});

function parseMarkdown(markdownContent) {
    // Use marked.js to parse the Markdown content
    const parsedHTML = marked(markdownContent);

    // Get the output container element
    const outputContainer = document.getElementById('output');

    // Set the parsed HTML as the innerHTML of the output container
    outputContainer.innerHTML = parsedHTML;

    // Apply styles to the parsed elements
    applyStyles(outputContainer);

    // Add line breaks for empty lines
    addLineBreaks(outputContainer);

    // Format images with 90% width
    formatImages(outputContainer);

    // appendEntryNumbers(outputContainer);

    // Append Roman numerals after occurrences of the word "entry"
    appendEntryNumerals(outputContainer);

    // Apply styles to combined bold and italic text
    // applyCombinedStyles(outputContainer);
    // applyStencilFilter(outputContainer);
    applyGreyscaleFilter(outputContainer);
}

function appendEntryNumbers(container) {
    // Find all text nodes in the container
    const textNodes = getTextNodes(container);

    // Iterate through text nodes and append numbers after the word "entry"
    textNodes.forEach((textNode, index) => {
        const textContent = textNode.nodeValue;
        const updatedContent = textContent.replace(/(Entry:)/gi, `$1 ${index + 1}`);
        textNode.nodeValue = updatedContent;
    });
}
function appendEntryNumerals(container) {
    // Find all text nodes in the container
    const textNodes = getTextNodes(container);

    // Initialize a counter for the occurrences of the word "entry"
    let entryCount = 0;

    // Iterate through text nodes and append Roman numerals after the word "entry"
    textNodes.forEach(textNode => {
        const textContent = textNode.nodeValue;

        // Use a regular expression to find occurrences of the word "entry"
        const matches = textContent.match(/entry/gi);

        if (matches) {
            // Update the entryCount based on the number of matches
            entryCount += matches.length;

            // Append Roman numerals after the word "entry"
            const updatedContent = textContent.replace(/(entry)/gi, match => `${match} ${toRoman(entryCount)}`);
            textNode.nodeValue = updatedContent;
        }
    });
}

function getTextNodes(element) {
    const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];

    let currentNode;
    while (currentNode = treeWalker.nextNode()) {
        textNodes.push(currentNode);
    }

    return textNodes;
}

function toRoman(num) {
    const romanNumerals = [
        { value: 1000, numeral: 'M' },
        { value: 900, numeral: 'CM' },
        { value: 500, numeral: 'D' },
        { value: 400, numeral: 'CD' },
        { value: 100, numeral: 'C' },
        { value: 90, numeral: 'XC' },
        { value: 50, numeral: 'L' },
        { value: 40, numeral: 'XL' },
        { value: 10, numeral: 'X' },
        { value: 9, numeral: 'IX' },
        { value: 5, numeral: 'V' },
        { value: 4, numeral: 'IV' },
        { value: 1, numeral: 'I' }
    ];

    let result = '';

    for (const pair of romanNumerals) {
        const { value, numeral } = pair;
        while (num >= value) {
            result += numeral;
            num -= value;
        }
    }

    return result;
}


function addLineBreaks(container) {
    // Split the container's innerHTML by lines
    const lines = container.innerHTML.split('\n');

    // Reconstruct the innerHTML with added line breaks
    container.innerHTML = lines.join('<br>');

    // Add an additional line break for empty lines
    container.innerHTML = container.innerHTML.replace(/<br><br>/g, '<br><br><br>');
}

function formatImages(container) {
    // Get all image elements within the container
    const images = container.querySelectorAll('img');

    images.forEach(image => {
        // Apply 90% width to the image
        image.style.width = '95%';
    });
}


function applyStyles(container) {
    // Get all headers and paragraphs within the container
    const elements = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, strong, em,b,i');

    elements.forEach(element => {
        // Get the computed styles of the element
        const styles = window.getComputedStyle(element);

        // Extract the color property from the computed styles
        const color = styles.getPropertyValue('color');

        // Apply the extracted color as the text color
        element.style.color = color;
    });
}

// function applyCombinedStyles(container) {
//     const textNodes = getTextNodes(container);

//     textNodes.forEach(textNode => {
//         const textContent = textNode.nodeValue;

//         // Use a regular expression to find combined bold and italic text
//         const matches = textContent.match(/(\*\*\*|___)(.*?)\1/g);

//         if (matches) {
//             matches.forEach(match => {
//                 // Wrap the combined bold and italic text with a span and apply styles
//                 const span = document.createElement('span');
//                 span.style.fontWeight = 'bold';
//                 span.style.fontStyle = 'italic';
//                 span.textContent = match;

//                 textNode.parentNode.replaceChild(span, textNode.splitText(textContent.indexOf(match)));
//             });
//         }
//     });
// }

function applyGreyscaleFilter(container) {
    const images = container.querySelectorAll('img');
    images.forEach(img => {
        img.style.filter = 'grayscale(100%)';
    });
}


function applyGreyscaleCanvas(container) {
    const images = container.querySelectorAll('img');

    images.forEach(img => {
        if (!img.complete) {
            img.onload = () => convertToGrayscale(img);
        } else {
            convertToGrayscale(img);
        }
    });
}

function convertToGrayscale(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = img.naturalWidth;
    const height = img.naturalHeight;

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const avg = 0.3 * data[i] + 0.59 * data[i+1] + 0.11 * data[i+2];
        data[i] = data[i+1] = data[i+2] = avg;
    }

    ctx.putImageData(imageData, 0, 0);
    img.replaceWith(canvas);
}


