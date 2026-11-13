const API_URL = '/api';

const loginSection = document.getElementById('loginSection');
const appSection = document.getElementById('appSection');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const technologyForm = document.getElementById('technologyForm');
const technologyTable = document.getElementById('technologyTable');
const formMessage = document.getElementById('formMessage');

let token = sessionStorage.getItem('token') || '';

function showMessage(element, message, type = '') {
    element.textContent = message;
    element.className = `feedback ${type}`;
}

function showApplication() {
    loginSection.classList.add('hidden');
    appSection.classList.remove('hidden');
    carregarTecnologias();
}

function showLogin() {
    appSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
}

async function requestApi(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401 && endpoint !== '/auth/login') {
        logout();
    }

    if (!response.ok) {
        throw new Error(data.mensagem || 'Ocorreu um erro na solicitacao.');
    }

    return data;
}

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    showMessage(loginMessage, 'Verificando acesso...');

    try {
        const resultado = await requestApi('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: document.getElementById('email').value.trim(),
                senha: document.getElementById('senha').value
            })
        });

        token = resultado.token;
        sessionStorage.setItem('token', token);
        loginForm.reset();
        showApplication();
    } catch (error) {
        showMessage(loginMessage, error.message, 'error');
    }
});

async function carregarTecnologias() {
    technologyTable.innerHTML = '<tr><td colspan="4" class="empty-state">Carregando...</td></tr>';

    try {
        const tecnologias = await requestApi('/tecnologias');
        document.getElementById('totalCount').textContent =
            `${tecnologias.length} ${tecnologias.length === 1 ? 'registro' : 'registros'}`;

        if (tecnologias.length === 0) {
            technologyTable.innerHTML = '<tr><td colspan="4" class="empty-state">Nenhuma tecnologia cadastrada ainda.</td></tr>';
            return;
        }

        technologyTable.innerHTML = '';
        tecnologias.forEach((tecnologia) => {
            const linha = document.createElement('tr');

            const nome = document.createElement('td');
            nome.textContent = tecnologia.nome;

            const baseCell = document.createElement('td');
            const baseTag = document.createElement('span');
            baseTag.className = 'base-tag';
            baseTag.textContent = tecnologia.base;
            baseCell.appendChild(baseTag);

            const curva = document.createElement('td');
            curva.textContent = tecnologia.curvaAprendizado;

            const acoes = document.createElement('td');
            const grupo = document.createElement('div');
            grupo.className = 'row-actions';

            const editar = document.createElement('button');
            editar.className = 'action-button edit-button';
            editar.type = 'button';
            editar.textContent = 'Editar';
            editar.addEventListener('click', () => prepararEdicao(tecnologia));

            const excluir = document.createElement('button');
            excluir.className = 'action-button delete-button';
            excluir.type = 'button';
            excluir.textContent = 'Excluir';
            excluir.addEventListener('click', () => excluirTecnologia(tecnologia._id));

            grupo.append(editar, excluir);
            acoes.appendChild(grupo);
            linha.append(nome, baseCell, curva, acoes);
            technologyTable.appendChild(linha);
        });
    } catch (error) {
        technologyTable.innerHTML = `<tr><td colspan="4" class="empty-state">${error.message}</td></tr>`;
    }
}

technologyForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('technologyId').value;
    const dados = {
        nome: document.getElementById('nome').value.trim(),
        base: document.getElementById('base').value,
        curvaAprendizado: document.getElementById('curvaAprendizado').value.trim()
    };

    try {
        const resultado = await requestApi(id ? `/tecnologias/${id}` : '/tecnologias', {
            method: id ? 'PUT' : 'POST',
            body: JSON.stringify(dados)
        });

        showMessage(formMessage, resultado.mensagem, 'success');
        limparFormulario();
        await carregarTecnologias();
    } catch (error) {
        showMessage(formMessage, error.message, 'error');
    }
});

function prepararEdicao(tecnologia) {
    document.getElementById('technologyId').value = tecnologia._id;
    document.getElementById('nome').value = tecnologia.nome;
    document.getElementById('base').value = tecnologia.base;
    document.getElementById('curvaAprendizado').value = tecnologia.curvaAprendizado;
    document.getElementById('formTitle').textContent = 'Editar tecnologia';
    document.getElementById('saveButton').textContent = 'Salvar alterações';
    document.getElementById('cancelButton').classList.remove('hidden');
    showMessage(formMessage, 'Edite os campos e salve as alteracoes.');
    document.getElementById('nome').focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function excluirTecnologia(id) {
    if (!confirm('Tem certeza de que deseja excluir esta tecnologia?')) return;

    try {
        const resultado = await requestApi(`/tecnologias/${id}`, { method: 'DELETE' });
        showMessage(formMessage, resultado.mensagem, 'success');
        await carregarTecnologias();
    } catch (error) {
        showMessage(formMessage, error.message, 'error');
    }
}

function limparFormulario() {
    technologyForm.reset();
    document.getElementById('technologyId').value = '';
    document.getElementById('formTitle').textContent = 'Nova tecnologia';
    document.getElementById('saveButton').textContent = 'Cadastrar tecnologia';
    document.getElementById('cancelButton').classList.add('hidden');
}

document.getElementById('cancelButton').addEventListener('click', () => {
    limparFormulario();
    showMessage(formMessage, '');
});

function logout() {
    token = '';
    sessionStorage.removeItem('token');
    showLogin();
}

document.getElementById('logoutButton').addEventListener('click', logout);

if (token) {
    showApplication();
} else {
    showLogin();
}
