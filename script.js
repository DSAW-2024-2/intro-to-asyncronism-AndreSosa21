const pokemon = document.querySelector('#poke');
let Api="https://pokeapi.co/api/v2/pokemon/";
for (let i=1; i<= 151; i++){
    fetch(Api + i)
        .then((response) => response.json())
        .then(data => showPokemon(data))

}
function showPokemon(data){
    const div = document.createElement("div");
    div.classList.add("pokedex__pokeballs");
    div.innerHTML = `
        <div class="pokeball__top"></div>
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