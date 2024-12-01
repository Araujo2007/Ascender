
// Inicializa o array de usuários

let publicacoes = [];

// Recupera os usuários salvos no localStorage
let listPublicacoes = localStorage.getItem('publicacoes');

publicacoes = listPublicacoes ? JSON.parse(listPublicacoes) : [];


// Inicializa o array de usuários
let users = [];

// Recupera os usuários salvos no localStorage
let listUsers = localStorage.getItem('users');

users = listUsers ? JSON.parse(listUsers) : [];

// Função para cadastrar um novo usuário
function cadastrar() {
    // Define uma função para verificar se o CPF já está cadastrado
    function verificarUserExistente(cpf) {
        return users.some(user => user.cpf === cpf);
    }

    // Obtém os valores dos inputs
    let nomeUser = document.getElementById("nome").value;
    let cpfUser = document.getElementById("cpf").value;
    let dataNascUser = document.getElementById("data").value;
    let senhaUser = document.getElementById("senha").value;
    let senha2User = document.getElementById("senha2").value;
    let areaAtualUser = document.getElementById('market-area').value;


    // Verifica se todos os campos foram preenchidos
    if (nomeUser && cpfUser && dataNascUser && senhaUser && senha2User) {
        if (!/^\d{11}$/.test(cpfUser)) {
            alert("Informe um CPF válido!");
            return;
        }

        // Verifica se o CPF já está cadastrado
        if (verificarUserExistente(cpfUser)) {
            alert("Usuário já existe!");
            return;
        }

        // Verifica se as senhas coincidem
        if (senhaUser !== senha2User) {
            alert("Senhas diferentes, verifique se preencheu corretamente!");
            return;
        }

        // Cria um novo objeto de usuário
        let user = {
            nome: nomeUser,
            cpf: cpfUser,
            dataNasc: dataNascUser,
            senha: senhaUser,
            escolhas: [],
            postagens: [],
            areaAtual: areaAtualUser,
            habilidades: []
        };

        // Adiciona o novo usuário ao array de usuários
        users.push(user);

        // Salva o array de usuários atualizado no localStorage
        localStorage.setItem('users', JSON.stringify(users));

        alert("Usuário cadastrado com sucesso!");

        document.getElementById("nome").value = '';
        document.getElementById("cpf").value = '';
        document.getElementById("data").value = '';
        document.getElementById("senha").value = '';
        document.getElementById("senha2").value = '';

        window.location.href = "entrar.html";
    } else {
        // Alerta se algum campo não foi preenchido
        alert("Preencha todos os campos!");
    }

    // verificar
    console.log(users);
}

function entrar() {
    let nomeUser = document.getElementById("nome").value;
    let cpfUser = document.getElementById("cpf").value;
    let senhaUser = document.getElementById("senha").value;

    // Inicializa o array de usuários
let users = [];

// Recupera os usuários salvos no localStorage
let listUsers = localStorage.getItem('users');

users = listUsers ? JSON.parse(listUsers) : [];

    if (nomeUser && cpfUser && senhaUser) {
        let userExistente = users.find(user =>
            user.cpf === cpfUser &&
            user.nome === nomeUser &&
            user.senha === senhaUser
        );

        document.getElementById("nome").value = '';
        document.getElementById("cpf").value = '';
        document.getElementById("senha").value = '';

        if (userExistente) {
            let userLogado = userExistente;
            localStorage.setItem('userLogado', JSON.stringify(userLogado));
            window.location.href = "perfil.html";

        } else{
            alert("Dados incorretos ou usuário inexistente");
        }
    }
}

//parte para usuario já logado

let userLogado = JSON.parse(localStorage.getItem('userLogado'));

if (userLogado) {
    document.getElementById('userLogado').innerText = userLogado.nome;
    document.getElementById('idadeUser').innerText = `${calcularIdade()} anos`;
    document.getElementById('areaUser').innerText = `Área de atuação: ${userLogado.areaAtual}`;

    renderizarMinhasPublicacoes();

    console.log(publicacoes);
}

function calcularIdade() {
    // Obtém a data atual
    const hoje = new Date();
    
    // Divide a data de nasc em ano, mês e dia
    const [anoNasc, mesNasc, diaNasc] = userLogado.dataNasc.split('-').map(Number);
    
    // Calcula a idade inicial
    let idade = hoje.getFullYear() - anoNasc;

    // Ajusta a idade se o aniversário ainda não ocorreu no ano atual
    if (
        hoje.getMonth() + 1 < mesNasc || 
        (hoje.getMonth() + 1 === mesNasc && hoje.getDate() < diaNasc)
    ) {
        idade--;
    }

    return idade;
}

//Adicionar Publicação:

function ADDpublicacao() {
    let nomePublicacao = document.getElementById('namePublicacao').value;
    let imgPublicacao = document.getElementById('link-img-publicacao').value;
    let areaPublicacao = document.getElementById('market-area').value;

    if (nomePublicacao && imgPublicacao && areaPublicacao) {
        let publicacao = {
            nome: nomePublicacao,
            img: imgPublicacao,
            area: areaPublicacao
        };

        let listUsers = localStorage.getItem('users');
        let users = JSON.parse(listUsers) || [];
        console.log(users);
        users = users.map(user => {
            if (user.cpf === userLogado.cpf) {
                user.postagens.push(publicacao);
                publicacoes.push(publicacao);
                userLogado = user;
                localStorage.setItem('publicacoes', JSON.stringify(publicacoes));
                localStorage.setItem('userLogado', JSON.stringify(userLogado));
                return user;
            }
        }); 
        renderizarMinhasPublicacoes();

        localStorage.setItem('users', JSON.stringify(users));

        document.getElementById('namePublicacao').value = '';
        document.getElementById('link-img-publicacao').value = '';
        document.getElementById('market-area').value = '';

        alert("Publicado com sucesso!");
    } else {
        alert("Preencha todos os campos!");
    }
}

function renderizarMinhasPublicacoes() {
    document.getElementById('carousel-userPublicacoes').innerHTML = '';
    let postagens = userLogado.postagens;
    postagens.forEach(publicacao => {
        document.getElementById('carousel-userPublicacoes').innerHTML +=
        `<div class="card">
            <img src="${publicacao.img}" alt="img">
            <div class="card-content">
              <h3>${publicacao.nome}</h3>
              <p>${publicacao.area}</p>
            </div>
        </div>`;
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

function deslogar() {
    userLogado = {};
    window.location.href = "home.html"
}