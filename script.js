const form = document.getElementById('form');
const saerch = document.getElementById('saerch');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiUrl = 'https://api.lyrics.ovh';

const currentList = {
	list: [],
	set current(currentPageSongs) {
	  this.list = currentPageSongs;
	},
	get current() {
		return this.list;
	  }
  };

async function searchSongs(term) {
	const res = await fetch(`${apiUrl}/suggest/${term}`);
	const data = await res.json();

	const currentUrl = `${apiUrl}/suggest/${term}`;
	const a = data.data;
	showData(data);
}

// Show songs / artists in DOM
function showData(data) {

	currentList.current = data;

	result.innerHTML = `
		<ul class="songs">
			${data.data.map(song => `
			<li>
				<span><strong>${song.artist.name}</strong> - ${song.title}</span>
				<button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}">Get Lyrics</button>
			</li>
		`). join('')
	}
		</ul>
	`;

	if (data.prev || data.next) {
		more.innerHTML = `
			${data.prev ? `<button class="btn btn-bottom" onclick="getMoreSongs('${data.prev}')">Previous</button>` : ``}
			${data.next ? `<button class="btn btn-bottom" onclick="getMoreSongs('${data.next}')">Next</button>` : ``}
		`;
	} else {
		more.innerHTML = ``;
	}
}

// Get songs of previous or next page
async function getMoreSongs(url) {
	const res = await fetch(`https://api.codetabs.com/v1/proxy?quest=${url}`);
	const data = await res.json();

	showData(data);
}

// Get song lyrics
async function getLyrics(artist, song) {
	const res = await fetch(`${apiUrl}/v1/${artist}/${song}`);
	const data = await res.json();

	const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');


	result.innerHTML = `<h2><strong>${artist} - ${song} </strong></h2><br>
	<span>${lyrics}</span>
	<button id="btn-home" class="btn btn-home">Home page</button>
	`;

	more.innerHTML = ``;
}

// Event listeners

// Enter search term
form.addEventListener('submit', e => {
	// not allow to submit a form to a file
	e.preventDefault();

	const searchWord = search.value.trim();

	if (!searchWord) {
		alert('Please type in a word');
	} else {
		searchSongs(searchWord);
	}
});

// Show lyrics
result.addEventListener('click', e => {
	const clickedEl = e.target;

	if (clickedEl.tagName === 'BUTTON' && clickedEl.id !== 'btn-home') {
		const artist = clickedEl.getAttribute('data-artist');
		const songTitle = clickedEl.getAttribute('data-song-title');
	
		getLyrics(artist, songTitle);
	  }

	  if (clickedEl.tagName === 'BUTTON' && clickedEl.id === 'btn-home') {
		showData(currentList.current);

	  }
});