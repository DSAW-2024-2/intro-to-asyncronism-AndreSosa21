const pokemon = document.querySelector('#poke');
const buttonHabitat = document.querySelectorAll('.pokedex__btn');
const pokeInfo = document.querySelector('#info');
const previous = document.querySelector('.previous');
const next = document.querySelector('.next');
const pokemonInfo = document.querySelector('.pokeball__info-container');

let selectHabitat = 'all';
let first_endpoint="https://pokeapi.co/api/v2/pokemon/";
let third_endpoint="https://pokeapi.co/api/v2/encounter-method/";
let offset = 1;
let limit = 6;

let totalPokemonInHabitat = 0; 

function getTotalPokemonCount() {
    if (selectHabitat === 'all') {
        return fetch('https://pokeapi.co/api/v2/pokemon?limit=1')
            .then(response => response.json())
            .then(data => {
                totalPokemonInHabitat = data.count; 
                return totalPokemonInHabitat;
            });
    }
    return Promise.resolve(totalPokemonInHabitat); 
}

function pagination(offset, limit, selectHabitat) {
    getTotalPokemonCount().then(() => {
        if (selectHabitat === 'all') {
            for (let i = offset; i < offset + limit; i++) {
                fetch(first_endpoint + i)
                    .then((response) => response.json())
                    .then(data => fetch(data.species.url)
                        .then((response) => response.json())
                        .then(habitatData => {
                            const habitat = habitatData.habitat.name;
                            fetch(third_endpoint + i)
                            .then((response) => response.json())
                            .then(encounterMethod => {
                                const encounter= encounterMethod.name;
                                showPokemon_inPokeball(data, habitat, encounter);
                            });
                        })
                    )
                    .catch(error => console.error('Error fetching Pokémon:', error));
            }
        } else {
            
            fetch(`https://pokeapi.co/api/v2/pokemon-habitat/${selectHabitat}`)
                .then((response) => response.json())
                .then(habitatData => {
                    const pokemonsInHabitat = habitatData.pokemon_species;
                    totalPokemonInHabitat = pokemonsInHabitat.length;

                    
                    for (let i = offset; i < offset + limit && i < totalPokemonInHabitat; i++) {
                        let speciesUrl = pokemonsInHabitat[i].url;
                        fetch(speciesUrl)
                            .then((response) => response.json())
                            .then(speciesData => {
                                fetch(first_endpoint + speciesData.id)
                                    .then((response) => response.json())
                                    .then(data => {
                                        showPokemon_inPokeball(data, selectHabitat);
                                    });
                            });
                    }
                })
                .catch(error => console.error('Error fetching habitat:', error));
        }
    });
}


next.addEventListener('click', () => {
    
    if (offset + limit < totalPokemonInHabitat) {
        offset += limit;
        erase_index();
        pagination(offset, limit, selectHabitat);
    }
});


previous.addEventListener('click', () => {
    if (offset > 1) {
        offset -= limit;
        erase_index();
        pagination(offset, limit, selectHabitat);
    }
});


function erase_index(){
    pokemon.innerHTML= '';
}


function showPokemon_inPokeball(data,habitatData,encounterMethod){
    const div = document.createElement("div");
    const habitat= poke_habitat(habitatData);
    
    div.classList.add("pokedex__pokeballs");
    div.innerHTML = `
        <div class="pokeball__top ${habitat}"> </div>
        <div class="pokeball__botton">
            <p>${data.name}</p>
        </div>
        <div class="pokeball__center">
            <button class="pokeball__pokemons-image">
                <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}">
            </button>
        </div>
        <div class="pokeball__info-container"></div>
    `;
    const pokeImage = div.querySelector(".pokeball__pokemons-image img");
    const pokeContainer = div.querySelector(".pokeball__info-container");
    const pokeballs = div.querySelector(".pokedex__pokeballs");
    
    cards(pokeImage,pokeContainer,data, habitatData, encounterMethod);
    pokemon.append(div);
    
    
}
function cards (pokeImage, pokeContainer,data ,habitatData, encounterMethod){
    let card_visible = false;
    const pokeballInfoContainer = pokeImage.closest('.pokedex__pokeballs').querySelector('.pokeball__info-container');
    pokeImage.addEventListener('mouseover', (event) => {
        
        if(!card_visible){
            show_pokeInfo(pokeballInfoContainer, data, habitatData, encounterMethod);
            pokeContainer.style.display= 'block';
            setTimeout(()=> {
                pokeballInfoContainer.classList.add('visible');
            }, 10);
        
            card_visible = true;
        
        }
    });
    pokeContainer.addEventListener('mouseleave',(event) => {
        if(card_visible){
            pokeballInfoContainer.classList.remove('visible');
            setTimeout(()=> {
                pokeContainer.style.display= 'none';
            }, 300);
            
            card_visible = false;
            
        }

    });
    
}

function poke_habitat(habitatData){
    switch (habitatData.toLowerCase()){
        case "cave":
            return "pokeball__top--cave";
        case "forest":
            return "pokeball__top--forest";   
        case "grassland":
            return "pokeball__top--grassland";
        case "mountain":
            return "pokeball__top--mountain";
        case "rare":
            return "pokeball__top--rare";
        case "rough-terrain":
            return "pokeball__top--rough_terrain";
        case "sea":
            return "pokeball__top--sea";
        case "urban":
            return "pokeball__top--urban";
        case "waters-edge":
            return "pokeball__top--waters-edge";
    } 
}
buttonHabitat.forEach(boton => boton.addEventListener("click", (event) => {
    const idHabitat = event.currentTarget.id;
    selectHabitat = idHabitat;
    const pokemonElements = pokemon.querySelectorAll('.pokedex__pokeballs');
    pokemonElements.forEach(element => element.remove());
    
    offset = 1;
    erase_index();
    pagination(offset,limit, selectHabitat);

})) 

function show_pokeInfo(container,data,habitat,encounterMethod){
    const div = document.createElement("div");
    div.classList.add("pokedex__pokemon-info");


    let types = data.types.map(type =>
        `<li>${type.type.name} </li>`
        );
    types = types.join('');   
    
    
    div.innerHTML = `
            <h2>Pokemon Info ${data.name}</h2>
                <ul>
                    <li>Type: ${types}</li>
                    <li>Weight: ${data.weight}kg</li>
                    <li>Habitat: ${habitat}</li>
                    <li>encounter-method: ${encounterMethod}</li>
                </ul>
    `;
    container.innerHTML = '';
    container.append(div);
    
} 
pagination(offset,limit, selectHabitat);