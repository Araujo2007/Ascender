// Inicializa o array de usuários

let publicacoes = [];

// Recupera os usuários salvos no localStorage
let listPublicacoes = localStorage.getItem('publicacoes');

publicacoes = listPublicacoes ? JSON.parse(listPublicacoes) : [];

let userLogado = JSON.parse(localStorage.getItem('userLogado'));

renderizarPublicacoes();
renderizarPublicacoesMinhaArea();

function renderizarPublicacoes() {
    document.getElementById('carousel-Publicacoes').innerHTML = '';
    publicacoes.forEach(publicacao => {
        if (publicacao.area !== userLogado.areaAtual) {
            document.getElementById('carousel-Publicacoes').innerHTML +=
            `<div class="card">
            <img src="${publicacao.img}" alt="img">
            <div class="card-content">
              <h3>${publicacao.nome}</h3>
              <p>${publicacao.area}</p>
            </div>
            </div>`;   
        }
    });
}

function renderizarPublicacoesMinhaArea() {
    document.getElementById('carousel-PublicacoesMinhaArea').innerHTML = '';
    publicacoes.forEach(publicacao => {
        if (publicacao.area === userLogado.areaAtual) {
            document.getElementById('carousel-PublicacoesMinhaArea').innerHTML +=
            `<div class="card">
            <img src="${publicacao.img}" alt="img">
            <div class="card-content">
              <h3>${publicacao.nome}</h3>
              <p>${publicacao.area}</p>
            </div>
            </div>`;   
        }
    });
}

const track = document.querySelector('.carousel-track');
const prevButton = document.getElementById('prevBtn');
const nextButton = document.getElementById('nextBtn');

let currentIndex = 0;

const cardWidth = 270; // Largura do card + margem (ajuste para corresponder ao seu design)
const totalCards = document.querySelectorAll('.card').length;
const visibleCards = Math.floor(document.querySelector('.carousel-container').offsetWidth / cardWidth);

const updateCarousel = () => {
  const maxIndex = totalCards - visibleCards;
  currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
  track.style.transform = `translateX(-${currentIndex*cardWidth}px)`;
};

prevButton.addEventListener('click', () => {
  currentIndex--;
  updateCarousel();
});

nextButton.addEventListener('click', () => {
  currentIndex++;
  updateCarousel();
});

// Ajustar o carrossel ao redimensionar a janela
window.addEventListener('resize', updateCarousel);