const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const authorLink = document.getElementById('author-link');
const loader = document.getElementById('loader');


function showLoadingSpinner() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
  if(!loader.hidden) {
    loader.hidden = true;
    quoteContainer.hidden = false;
  }
}

let errorCounter = 0;

// const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // too much traffic
const proxyUrl = 'https://shielded-atoll-23713.herokuapp.com/'; // personal proxy server
const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';

// Get quote from API
async function getQuote() {
  
  showLoadingSpinner();
  
  try {
    const response = await fetch(proxyUrl + apiUrl);
    const data = await response.json();

    // If author is blank add 'Unknown';
    if(data.quoteAuthor === '') {
      authorText.innerText = 'Unknown';
      authorLink.removeAttribute('href');
      authorLink.removeAttribute('target');
    } else {
      authorText.innerText = data.quoteAuthor;
      authorLink.setAttribute('href', `https://en.wikipedia.org/wiki/${data.quoteAuthor}`);
      authorLink.setAttribute('target', '_blank');
    }
    
    // Reduce font-size for long quotes
    if(data.quoteText.length > 120) {
      quoteText.classList.add('long-quote');
    } else {
      quoteText.classList.remove('long-quote');
    }

    quoteText.innerText = data.quoteText;

    removeLoadingSpinner();

  } catch (error) {
    errorCounter ++;
    if(errorCounter === 10) {
      // Something is definitely wrong
      console.log('Whoops, no quote', error);
    } else {
      // Try to get a new quote
      getQuote();
    }
  }
}

// Tweet Quote
function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author} `;
  window.open(twitterUrl, '_blank');
}

// Event listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

// On Load
getQuote();