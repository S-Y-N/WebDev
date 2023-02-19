const api = "https://api.quotable.io/random";

const quote = document.getElementById('quote');
const author = document.getElementById('author');

const link = "https://twitter.com/intent/tweet?text=";

async function getQuote(url) {
    const response = await fetch(url);
    var data = await response.json();
    console.log(data);
    quote.innerHTML = data.content;
    author.innerHTML = data.author;
}
getQuote(api);

function shareToTweeter(link, width, height) {
    window.open(link + quote.innerHTML + "©" + author.innerHTML, 'width=' + width + ',height=' + height + ',left=' + ((window.innerWidth - width) / 2) + ',top=' + ((window.innerHeight - height) / 2));
}
