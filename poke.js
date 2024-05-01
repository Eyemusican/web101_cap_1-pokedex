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

// Fetch the species data for a Pokemon
async function fetchPokemonSpecies(pokemonData) {
  try {
    const response = await fetch(pokemonData.species.url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while fetching the Pokemon species data');
  }
}

// Display detailed information about a Pokemon
function displayPokemonDetails(pokemonData, speciesData) {
  const detailsContainer = document.createElement('div');
  detailsContainer.classList.add('pokemon-details');
  detailsContainer.innerHTML = `
    <p>Species: ${speciesData.genera[7].genus}</p>
    <p>Abilities: ${pokemonData.abilities.map(ability => ability.ability.name).join(', ')}</p>
    <p>Types: ${pokemonData.types.map(type => type.type.name).join(', ')}</p>
  `;
  return detailsContainer;
}

// Display the list of Pokemon cards
async function displayPokemonCards() {
  const pokemonList = await fetchPokemonList();
  const mainElement = document.querySelector('main');
  mainElement.innerHTML = `<h2 class="pokemon-list-heading">Pokemon List</h2>`;

  pokemonList.forEach(async (pokemon, index) => {
    const pokemonData = await fetchPokemon(pokemon.name);
    const speciesData = await fetchPokemonSpecies(pokemonData);
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');
    pokemonCard.innerHTML = `
      <div class="pokemon-card-front">
        <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" class="pokemon-image">
        <div>
          <h3>${pokemonData.name}</h3>
          <p>Weight: ${pokemonData.weight / 10} (Kg)</p>
          <p>Height: ${pokemonData.height / 10} (m)</p>
        </div>
      </div>
      <div class="pokemon-card-back">
        <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" class="pokemon-image">
        <div class="pokemon-details">
          ${displayPokemonDetails(pokemonData, speciesData).outerHTML}
        </div>
      </div>
    `;

    pokemonCard.addEventListener('mouseover', () => {
      pokemonCard.classList.add('flipped');
    });

    pokemonCard.addEventListener('mouseout', () => {
      pokemonCard.classList.remove('flipped');
    });

    mainElement.appendChild(pokemonCard);
  });
}

// Display a single Pokemon's data
async function displayPokemonData(pokemonIdentifier) {
  const mainElement = document.querySelector('main');
  mainElement.innerHTML = '';

  const pokemonData = await fetchPokemon(pokemonIdentifier);
  const speciesData = await fetchPokemonSpecies(pokemonData);

  const pokemonCard = document.createElement('div');
  pokemonCard.classList.add('pokemon-card');
  pokemonCard.innerHTML = `
    <div class="pokemon-card-front">
      <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" class="pokemon-image">
      <div>
        <h3>${pokemonData.name}</h3>
        <p>Weight: ${pokemonData.weight / 10} (Kg)</p>
        <p>Height: ${pokemonData.height / 10} (m)</p>
      </div>
    </div>
    <div class="pokemon-card-back">
      <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" class="pokemon-image">
      <div class="pokemon-details">
        ${displayPokemonDetails(pokemonData, speciesData).outerHTML}
      </div>
    </div>
  `;

  pokemonCard.addEventListener('mouseover', () => {
    pokemonCard.classList.add('flipped');
  });

  pokemonCard.addEventListener('mouseout', () => {
    pokemonCard.classList.remove('flipped');
  });

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

// Event listener for the search button
const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-bar input');

searchBtn.addEventListener('click', async () => {
  const pokemonIdentifier = searchInput.value.toLowerCase();
  try {
    displayPokemonData(pokemonIdentifier);
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while fetching the Pokemon data');
  }
});

// Display the list of Pokemon cards when the page loads
window.addEventListener('load', displayPokemonCards);