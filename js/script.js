// https://pokeapi.co/api/v2/pokemon/1/
//link das infos do bulbasauro. Pra mudar o pokemon
//é só mudar o id no final do link

const pokemonsG1 = 'https://pokeapi.co/api/v2/pokemon/?limit=151&offset=0'
const pokemonUrl = 'https://pokeapi.co/api/v2/pokemon/'
const pkm_click_audio = document.querySelector('#pkm-click-audio')
let sectionPokemons = document.querySelector('#pokemons')
let formulario = document.querySelector('#searchForm')
let infosEimg = document.querySelector('#infosEimg')
let body = document.querySelector('body')
let is_box_visible = false

// INICIO DAS CHAMADAS DE FUNCOES
gerarPokemons()
$('.fa-bars').click(() => boxSlide())
$('#searchButton').click((event) => searchPokemon(event))
$('#searchInput').keyup((event) => searchPokemon(event))
//FIM DAS CHAMADAS DE FUNCOES

function gerarPokemons(){
  fetch(pokemonsG1).then(r => r.json()).then(function(data){
    let array = []
    let i = 1
    for(let pkm of data['results']){ // do bulbasauro até o mew
      array.push(`<div class="pokemon ${pkm.name}">
        <img class="img-pokemon" data-id="${i}" src="imgs/sprites/default/${i}.png">
        <span>${pkm.name}</span>
        </div>`)
      i++
    }
    sectionPokemons.insertAdjacentHTML('afterbegin', array.join(''))
    $('.img-pokemon').click(function(){
      mudarLightBox($(this).attr('data-id'))
    })
  })
}

function mudarLightBox(id){
  pkm_click_audio.play()
  fetch(pokemonUrl+id).then(res => res.json())
  .then(function(data){
    let str = lightBoxHtml(data, id)
    infosEimg.innerHTML = ""
    infosEimg.insertAdjacentHTML('afterbegin', str)
  })
}

function lightBoxHtml(data, id){
  let tipos = data['types'].map(tipo => tipo['type']['name']).join('/')
  return `<div id="infos">
    <p>Nome: ${data['name']}</p>
    <p>Id: ${id}</p>
    <p>Peso: ${data['weight']}</p>
    <p>Tipo(s): ${tipos}</p>
  </div>
  <div id="box-img-div">
    <img class="box-img" src="imgs/sprites/default/${id}.png">
    <img class="box-img" src="imgs/sprites/back/${id}.png">
  </div>`
}

function boxSlide(){
  if(!is_box_visible){
    $('#lightbox').css({'left': '0', 'opacity': '1'})
    $('.fa-bars').css('transform', 'rotate(-180deg)')
    $('#pokemons').css('filter', 'blur(10px)')
    body.style = "overflow: hidden;"
    is_box_visible = true
  }else{
    $('#lightbox').css({'left': '-495px', 'opacity': '0'})
    $('.fa-bars').css('transform', 'rotate(0deg)')
    $('#pokemons').css('filter', 'none')
    body.style = "overflow: visible;"
    is_box_visible = false
  }
}

function searchPokemon(event){
  event.preventDefault()
  let formData = new FormData(formulario)
  let pesquisa = formData.get('search')
  pesquisa = pesquisa.toLowerCase()
  let pokemons = document.querySelectorAll('.pokemon')
  let nome
  for(let pkm of pokemons){
    nome = pkm.className.split(' ')[1] //nome do pokemon
    if(nome.indexOf(pesquisa) == -1)
      pkm.style.display = 'none'
    else
      pkm.style.display = 'flex'
  }
}
