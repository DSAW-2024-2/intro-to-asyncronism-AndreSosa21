const pokemon = document.querySelector('#poke');
const buttonHabitat = document.querySelectorAll('.pokedex__btn');
const pokeInfo = document.querySelector('#info');
const previous = document.querySelector('.previous');
const next = document.querySelector('.next');
const pokemonInfo = document.querySelector('.pokeball__info-container');

let selectHabitat = 'all';
let first_endpoint="https://pokeapi.co/api/v2/pokemon/";
let third_endpoint ="https://pokeapi.co/api/v2/encounter-method/";
let offset = 0;
let limit = 6;

let totalpokemonsInHabitat = 0;

previous.addEventListener('click', () => {
    if (offset > 1){
        offset -= limit;
        erase_index();
        pagination(offset,limit, selectHabitat);
    }
    

})
next.addEventListener('click', () => {
    if(offset + limit < totalpokemonsInHabitat){
        offset += limit;
        erase_index();
        pagination(offset,limit, selectHabitat);
    }
        
    
    

})
function erase_index(){
    pokemon.innerHTML= '';
}




function pagination(offset, limit, selectHabitat) {
    // Si el hábitat seleccionado es 'all', mostrar todos los Pokémon normalmente
    if (selectHabitat === 'all') {
        for (let i = offset; i <= offset + limit; i++) {
            fetch(first_endpoint + i)
                .then((response) => response.json())
                .then(data => fetch(data.species.url)
                    .then((response) => response.json())
                    .then(habitatData => {
                        const habitat = habitatData.habitat.name;
                        fetch(third_endpoint + i)
                        .then((response) => response.json())
                        .then(encounterMethod => {
                            const encounter = encounterMethod.name; // Revisa aquí si es la estructura correcta
                            showPokemon_inPokeball(data, habitat, encounter);
                        });
                    })
                )
                .catch(error => console.error('Error fetching Pokémon:', error));
        }
    } else {
        // Si se selecciona un hábitat, obtener los Pokémon de ese hábitat directamente
        fetch(`https://pokeapi.co/api/v2/pokemon-habitat/${selectHabitat}`)
            .then((response) => response.json())
            .then(habitatData => {
                const pokemonsInHabitat = habitatData.pokemon_species;

                // Almacenar el número total de Pokémon en el hábitat para la paginación
                totalpokemonsInHabitat = pokemonsInHabitat.length;

                // Paginar los Pokémon de ese hábitat
                for (let i = offset; i < offset + limit && i < totalpokemonsInHabitat; i++) {
                    let speciesUrl = pokemonsInHabitat[i].url;
                    fetch(speciesUrl)
                        .then((response) => response.json())
                        .then(speciesData => {
                            // Obtener detalles del Pokémon
                            fetch(first_endpoint + speciesData.id)
                                .then((response) => response.json())
                                .then(data => {
                                    // Obtener método de encuentro
                                    fetch(third_endpoint + i) // Añade esto para obtener el encounter method
                                        .then((response) => response.json())
                                        .then(encounterMethod => {
                                            // Comprueba la estructura del JSON aquí
                                            const encounter = encounterMethod.name; // Reemplazar por el acceso correcto
                                            showPokemon_inPokeball(data, selectHabitat, encounter);
                                        })
                                        .catch(error => console.error('Error fetching encounter method:', error));
                                });
                        });
                }
            })
            .catch(error => console.error('Error fetching habitat:', error));
    }
}


function showPokemon_inPokeball(data,habitatData, encounter){
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
    
    
    cards(pokeImage,pokeContainer,data, habitatData,encounter);
    pokemon.append(div);
    
    
}
function cards (pokeImage, pokeContainer,data ,habitatData , encounterMethod){
    let card_visible = false;
    const pokeballInfoContainer = pokeImage.closest('.pokedex__pokeballs').querySelector('.pokeball__info-container');
    pokeImage.addEventListener('mouseover', (event) => {
        
        if(!card_visible){
            show_pokeInfo(pokeballInfoContainer, data, habitatData , encounterMethod);
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

//show pokemon info
function show_pokeInfo(container,data,habitat,encounterMethod){
    console.log(encounterMethod);
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


