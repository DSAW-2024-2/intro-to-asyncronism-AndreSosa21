const pokemon = document.querySelector('#poke');
const buttonHabitat = document.querySelectorAll('.pokedex__btn')
let Api="https://pokeapi.co/api/v2/pokemon/";
for (let i=1; i<= 151; i++){
    fetch(Api + i)
        .then((response) => response.json())
        .then(data => fetch(data.species.url) .then((response) => response.json())
    .then((habitatData => showPokemon_inPokeball(data,habitatData.habitat.name))))

}
function showPokemon_inPokeball(data,habitatData){
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
    `;
    pokemon.append(div);
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
    pokemon.replaceChildren();
    
    for (let i=1; i<= 151; i++){
        fetch(Api + i)
            .then((response) => response.json())
            .then(data => {
                return fetch(data.species.url)
                .then((response) => response.json())
                    .then(habitatData => {
                    const habitat = habitatData.habitat.name;
                    if (habitat=== idHabitat){
                        showPokemon_inPokeball(data, habitat);
                    }
                    else if(idHabitat==="all"){
                        showPokemon_inPokeball(data, habitat);
                    }
                    
                })
            })        
    }
})) 
//falta tarjeta personalizada con:
    


