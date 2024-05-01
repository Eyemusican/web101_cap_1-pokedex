// Fetch a single Pokemon's data by name or ID
async function fetchPokemon(identifier) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while fetching the Pokemon data');
  }
}

// Display a single Pokemon's data
function displayPokemonData(pokemonData) {
  const mainElement = document.querySelector('main');
  mainElement.innerHTML = '';

  const pokemonCard = document.createElement('div');
  pokemonCard.classList.add('pokemon-card');
  pokemonCard.innerHTML = `
    <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
    <h3>${pokemonData.name}</h3>
    <p>Weight: ${pokemonData.weight / 10} (Kg)</p>
    <p>Height: ${pokemonData.height / 10} (m)</p>
  `;
  mainElement.appendChild(pokemonCard);
}

// Fetch the list of Pokemon
async function fetchPokemonList() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=200');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while fetching the Pokemon list');
  }
}

// Display the list of Pokemon cards
async function displayPokemonCards() {
  const pokemonList = await fetchPokemonList();
  const mainElement = document.querySelector('main');
  mainElement.innerHTML = `<h2 class="pokemon-list-heading">Pokemon List</h2>`;

  pokemonList.forEach(async (pokemon, index) => {
    const pokemonData = await fetchPokemon(pokemon.name);
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');
    pokemonCard.innerHTML = `
      <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
      <h3>${pokemonData.name}</h3>
      <p>Weight: ${pokemonData.weight / 10} (Kg)</p>
      <p>Height: ${pokemonData.height / 10} (m)</p>
    `;
    mainElement.appendChild(pokemonCard);
  });
}

// Event listener for the search button
const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-bar input');

searchBtn.addEventListener('click', async () => {
  const pokemonIdentifier = searchInput.value.toLowerCase();
  const pokemonData = await fetchPokemon(pokemonIdentifier);
  if (pokemonData) {
    displayPokemonData(pokemonData);
  } else {
    alert('Pokemon not found');
  }
});

// Display the list of Pokemon cards when the page loads
window.addEventListener('load', displayPokemonCards);