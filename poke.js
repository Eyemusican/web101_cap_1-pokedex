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
async function displayPokemonCards(generation) {
  const pokemonList = await fetchPokemonList(generation);
  const mainElement = document.querySelector('main');
  mainElement.innerHTML = `<h2 class="pokemon-list-heading">Pokemon List</h2>`;

  pokemonList.forEach(async (pokemon, index) => {
    const pokemonData = await fetchPokemon(pokemon.name);
    const speciesData = await fetchPokemonSpecies(pokemonData);
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');
    pokemonCard.innerHTML = `
    <div class="pokemon-card-front">
    <span class="pokemon-id">#${pokemonData.id}</span>
    <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" class="pokemon-image">
    <div>
      <h3>${pokemonData.name}</h3>
      <p>Weight: ${pokemonData.weight / 10} (Kg)</p>
      <p>Height: ${pokemonData.height / 10} (m)</p>
    </div>
    <button class="capture-button">
      <img src="path/to/pokeball.gif" alt="Capture">
    </button>
  </div>
  <div class="pokemon-card-back">
    <span class="pokemon-id">#${pokemonData.id}</span>
    <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" class="pokemon-image">
    <div class="pokemon-details">
      ${displayPokemonDetails(pokemonData, speciesData).outerHTML}
    </div>
    <button class="capture-button">
      <img src=assets/2860d2d8c3a1e402e0fc8913cd92cd7a_w200.gif>
    </button>
  </div>
`;

    pokemonCard.addEventListener('mouseover', () => {
      pokemonCard.classList.add('flipped');
    });

    pokemonCard.addEventListener('mouseout', () => {
      pokemonCard.classList.remove('flipped');
    });

    const captureButton = pokemonCard.querySelector('.capture-button');
    captureButton.addEventListener('click', () => {
      capturePokemon(pokemonData);
    });

    mainElement.appendChild(pokemonCard);
  });
}
// Display a single Pokemon's data
async function displayPokemonData(pokemonIdentifier) {
  const mainElement = document.querySelector('main');
  mainElement.innerHTML = '';

  try {
    const pokemonData = await fetchPokemon(pokemonIdentifier);
    const speciesData = await fetchPokemonSpecies(pokemonData);

    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');
    pokemonCard.innerHTML = `
    <div class="pokemon-card-front">
      <span class="pokemon-id">#${pokemonData.id}</span>
      <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" class="pokemon-image">
      <div>
        <h3>${pokemonData.name}</h3>
        <p>Weight: ${pokemonData.weight / 10} (Kg)</p>
        <p>Height: ${pokemonData.height / 10} (m)</p>
      </div>
    </div>
    <div class="pokemon-card-back">
      <span class="pokemon-id">#${pokemonData.id}</span>
      <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" class="pokemon-image">
      <div class="pokemon-details">
        ${displayPokemonDetails(pokemonData, speciesData).outerHTML}
      </div>
      <img src="assets/2860d2d8c3a1e402e0fc8913cd92cd7a_w200.gif" alt="Capture" class="capture-gif">
    </div>
  `;

    pokemonCard.addEventListener('mouseover', () => {
      pokemonCard.classList.add('flipped');
    });

    pokemonCard.addEventListener('mouseout', () => {
      pokemonCard.classList.remove('flipped');
    });

    mainElement.appendChild(pokemonCard);
  } catch (error) {
    const notFoundContainer = document.createElement('div');
    notFoundContainer.classList.add('not-found');
    notFoundContainer.innerHTML = `
      <img src="assets/HD-wallpaper-pokemon-pikachu-crying-emotional.jpg" alt="Not Found" class="not-found-image">
      <p>Pokemon not found</p>
    `;
    mainElement.appendChild(notFoundContainer);
    console.error('Error:', error);
  }
}

// Fetch the list of Pokemon based on the generation
async function fetchPokemonList(generation = 'all') {
  try {
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=200';
    if (generation !== 'all') {
      const generationNumber = generation.match(/\d+/)[0]; // Extract the generation number from the string
      url = `https://pokeapi.co/api/v2/generation/${generationNumber}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const pokemonList = generation === 'all' ? data.results : data.pokemon_species.map(species => species.pokemon);
    return pokemonList;
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

// Event listener for the dropdown links
const dropdownLinks = document.querySelectorAll('.dropdown-content a');

dropdownLinks.forEach(link => {
  link.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent the default link behavior
    const generation = event.target.dataset.generation;
    displayPokemonCards(generation);
  });
});

// Display the list of Pokemon cards when the page loads (default is all generations)
window.addEventListener('load', () => displayPokemonCards('all'));

