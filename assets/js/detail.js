// Pega o ID do pokémon pela URL: /pokemon-detail.html?id=25
const params = new URLSearchParams(window.location.search)
const pokemonId = params.get('id')

const detailContainer = document.getElementById('pokemonDetail')

// Mapeamento de stat para label legível
const statLabels = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Speed'
}

// Cor da barra de stat baseada no valor
function getStatColor(value) {
    if (value >= 100) return '#77c850'
    if (value >= 60) return '#6890f0'
    return '#f08030'
}

// Gera o HTML da barra de stat
function createStatBar(statName, value) {
    const label = statLabels[statName] || statName
    const percentage = Math.min((value / 150) * 100, 100)
    const color = getStatColor(value)

    return `
        <div class="stat-row">
            <span class="stat-label">${label}</span>
            <div class="stat-bar-bg">
                <div class="stat-bar" style="width: ${percentage}%; background-color: ${color};"></div>
            </div>
            <span class="stat-value">${value}</span>
        </div>
    `
}

// Renderiza os detalhes do pokémon
function renderDetail(pokemonDetail) {
    const types = pokemonDetail.types.map((t) => t.type.name)
    const [primaryType] = types
    const photo = pokemonDetail.sprites.other.dream_world.front_default
    const stats = pokemonDetail.stats

    const typesHtml = types
        .map((type) => `<li class="type ${type}">${type}</li>`)
        .join('')

    const statsHtml = stats
        .map((s) => createStatBar(s.stat.name, s.base_stat))
        .join('')

    detailContainer.innerHTML = `
        <div class="detail-hero ${primaryType}">
            <span class="detail-number">#${String(pokemonDetail.id).padStart(3, '0')}</span>
            <h1 class="detail-name">${pokemonDetail.name}</h1>
            <ol class="types detail-types">
                ${typesHtml}
            </ol>
            <img
                class="detail-photo"
                src="${photo}"
                alt="${pokemonDetail.name}"
            />
        </div>

        <div class="detail-stats">
            <h2 class="stats-title">Base Stats</h2>
            <div class="stats-list">
                ${statsHtml}
            </div>
        </div>
    `
}

// Carrega e exibe os dados
if (pokemonId) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        .then((res) => res.json())
        .then(renderDetail)
        .catch(() => {
            detailContainer.innerHTML = '<p class="loading-text">Pokémon não encontrado.</p>'
        })
} else {
    detailContainer.innerHTML = '<p class="loading-text">Nenhum pokémon selecionado.</p>'
}
