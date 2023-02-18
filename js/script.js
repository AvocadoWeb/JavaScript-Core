let searchInput = document.querySelector("input");
let searchContainerResults = document.querySelector(".search-container__results");
let found = document.querySelector(".found");

async function getSearchResults() {
	const searchUrl = new URL("https://api.github.com/search/repositories");
	let repositorySearch = searchInput.value;
	if (repositorySearch == "") {
		removeResults();
		return;
	}
	searchUrl.searchParams.append("q", repositorySearch);
	try {
		let response = await fetch(searchUrl);
		if (response.ok) {
			let searchResults = await response.json();
			showResults(searchResults);
		} else return;
	}
	catch (error) {
		return null;
	}
}

function showResults(results) {
	removeResults();
	for (let i = 0; i < 5; i++) {
		let div = document.createElement("div");
		div.classList.add("search-container__result");
		div.textContent = `${results.items[i].name}`;
		div.dataset.owner = `${results.items[i].owner.login}`;
		div.dataset.stars = `${results.items[i].stargazers_count}`;
		searchContainerResults.append(div);
	}
}

function foundResult(foundResult) {
	let name = foundResult.textContent;
	let owner = foundResult.dataset.owner;
	let stars = foundResult.dataset.stars;

	let div = document.createElement("div");
	div.classList.add("found__result");

	let divInfo = document.createElement("div");
	divInfo.classList.add("found__info");

	let pName = document.createElement("p");
	pName.textContent = `Name: ${name}`;
	divInfo.append(pName);

	let pOwner = document.createElement("p");
	pOwner.textContent = `Owner: ${owner}`;
	divInfo.append(pOwner);

	let pStars = document.createElement("p");
	pStars.textContent = `Stars: ${stars}`;
	divInfo.append(pStars);
	div.append(divInfo);

	let btn = document.createElement("button");
	btn.classList.add("btn-close");
	div.append(btn);
	found.append(div);
}

function removeResults() {
	searchContainerResults.textContent = "";
}

searchContainerResults.addEventListener("click", function (event) {
	if (event.target.classList.contains("search-container__result")) {
		foundResult(event.target);
		searchInput.value = "";
		removeResults();
	} else return;
})

found.addEventListener("click", function (event) {
	if (event.target.classList.contains("btn-close")) {
		event.target.parentElement.remove();
	} else return;
})

const debounce = (fn, debounceTime) => {
	let timer;
	return function () {
		clearTimeout(timer)
		timer = setTimeout(() => fn.apply(this, arguments), debounceTime)
	}
};

const getSearchResultsDebounce = debounce(getSearchResults, 400);
searchInput.addEventListener("input", getSearchResultsDebounce);