const tituloApp = document.getElementById('titulo-app');
const btnAlarme = document.getElementById('btnAlarme');
const btnCrono = document.getElementById('btnCrono');
const btnTempo = document.getElementById('btnTempo');
const btnTempoX = document.getElementById('btnTempoX');
const secaoAlarme = document.getElementById('secao-alarme');
const secaoCrono = document.getElementById('secao-crono');
const secaoTemporizador = document.getElementById('secao-temporizador');
const secaoTempox = document.getElementById('secao-tempox');
const relogio = document.getElementById('relogio');
const btnCriarAlarme = document.getElementById('btnCriarAlarme');
const listaAlarmes = document.getElementById('lista-alarmes');
const somAlarme = document.getElementById('somAlarme');
const somPreview = document.getElementById('somPreview');
const popupCriarAlarme = document.getElementById('popup-criar-alarme');
const tituloPopupAlarme = document.getElementById('titulo-popup-alarme');
const inputNovoAlarme = document.getElementById('inputNovoAlarme');
const selectSomAlarme = document.getElementById('selectSomAlarme');
const btnSalvarAlarme = document.getElementById('btnSalvarAlarme');
const btnOuvirAlarme = document.getElementById('btnOuvirAlarme');
const closeBtnCriar = popupCriarAlarme.querySelector('.close-btn');
const popupAlarmeTocando = document.getElementById('popup-alarme-tocando');
const alarmeTocandoHora = document.getElementById('alarme-tocando-hora');
const btnParar = document.getElementById('btnParar');
const btnSoneca = document.getElementById('btnSoneca');
const cronoDisplay = document.getElementById('crono-display');
const btnIniciarCrono = document.getElementById('btnIniciarCrono');
const btnPausarCrono = document.getElementById('btnPausarCrono');
const btnMarcarCrono = document.getElementById('btnMarcarCrono');
const btnZerarCrono = document.getElementById('btnZerarCrono');
const tituloMarcacoes = document.getElementById('titulo-marcacoes');
const listaMarcacoes = document.getElementById('lista-marcacoes');
const btnLimparMarcacoes = document.getElementById('btnLimparMarcacoes');
const inputHoras = document.getElementById('inputHoras');
const inputMinutos = document.getElementById('inputMinutos');
const inputSegundos = document.getElementById('inputSegundos');
const tempoDisplay = document.getElementById('tempo-display');
const btnIniciarTempo = document.getElementById('btnIniciarTempo');
const btnPausarTempo = document.getElementById('btnPausarTempo');
const btnZerarTempo = document.getElementById('btnZerarTempo');
const popupTemporizadorTocando = document.getElementById('popup-temporizador-tocando');
const btnPararTempo = document.getElementById('btnPararTempo');
const btnContarNovamente = document.getElementById('btnContarNovamente');
const btnCriarTempox = document.getElementById('btnCriarTempox');
const listaTemposX = document.getElementById('lista-temposx');
const popupTempox = document.getElementById('popup-tempox');
const closeBtnTempox = popupTempox.querySelector('.close-btn');
const inputNome = document.getElementById('inputNome');
const inputDescricao = document.getElementById('inputDescricao');
const inputRepeticaoHoras = document.getElementById('inputRepeticaoHoras');
const inputRepeticaoMinutos = document.getElementById('inputRepeticaoMinutos');
const inputDias = document.getElementById('inputDias');
const btnSalvarTempox = document.getElementById('btnSalvarTempox');
// Nova constante para o seletor de som do Tempo X
const selectSomTempox = document.getElementById('selectSomTempox');
// Nova constante para o botão de ouvir do Tempo X
const btnOuvirTempox = document.getElementById('btnOuvirTempox');
let tempoxEditandoId = null;
const settingsButton = document.getElementById('settings-button');
const settingsPopup = document.getElementById('settings-popup');
const closeBtnSettings = settingsPopup.querySelector('.close-btn');
const btnApagarTudo = document.getElementById('btnApagarTudo');
const btnToggleTheme = document.getElementById('btnToggleTheme');
const btnRequestNotification = document.getElementById('btnRequestNotification');
const popupConfirmacao = document.getElementById('popup-confirmacao');
const mensagemConfirmacao = document.getElementById('mensagem-confirmacao');
const btnConfirmarSim = document.getElementById('btnConfirmarSim');
const btnConfirmarNao = document.getElementById('btnConfirmarNao');
// Novas constantes para a tela de atualizações
const btnAtualizacoes = document.getElementById('btnAtualizacoes');
const popupAtualizacoes = document.getElementById('popup-atualizacoes');
const closeBtnAtualizacoes = popupAtualizacoes.querySelector('.close-btn');

let alarmes = [];
let temposX = [];
let tempoInicial = 0;
let tempoDecorido = 0;
let cronoInterval;
let marcacoes = [];
let tempoRestanteMilisegundos = 0;
let temporizadorInterval;
let temporizadorPausado = false;
let duracaoInicialTemporizador = 0;
let alarmeEditandoId = null;

const audioNames = {
    "alarme.mp3": "Padrão",
    "alarme2.mp3": "Dor",
    "alarme3.mp3": "Perigo",
    "alarme4.mp3": "Paizão",
    "alarme5.mp3": "Gamer"
};

function alternarSecao(secaoAtiva) {
    if (cronoInterval) pausarCrono();
    if (temporizadorInterval) pausarTemporizador();
    document.querySelectorAll('.nav-botoes button').forEach(btn => btn.classList.remove('ativo'));
    document.querySelectorAll('.secoes').forEach(secao => secao.classList.remove('ativo'));

    if (secaoAtiva === 'alarme') {
        btnAlarme.classList.add('ativo');
        secaoAlarme.classList.add('ativo');
        tituloApp.textContent = 'Alarme ++';
    } else if (secaoAtiva === 'crono') {
        btnCrono.classList.add('ativo');
        secaoCrono.classList.add('ativo');
        tituloApp.textContent = 'Cronômetro ++';
    } else if (secaoAtiva === 'tempo') {
        btnTempo.classList.add('ativo');
        secaoTemporizador.classList.add('ativo');
        tituloApp.textContent = 'Temporizador ++';
    } else if (secaoAtiva === 'tempox') {
        btnTempoX.classList.add('ativo');
        secaoTempox.classList.add('ativo');
        tituloApp.textContent = 'Tempo X ++';
    }
}

function salvarAlarmes() {
    localStorage.setItem('alarmes', JSON.stringify(alarmes));
}

function carregarAlarmes() {
    const alarmesSalvos = localStorage.getItem('alarmes');
    if (alarmesSalvos) {
        alarmes = JSON.parse(alarmesSalvos);
    }
}

function requestNotificationPermission() {
    if (!("Notification" in window)) {
        alert("Este navegador não suporta notificações.");
        return;
    }

    if (Notification.permission === "granted") {
        alert("As notificações já estão ativadas.");
        return;
    }

    if (Notification.permission === "denied") {
        alert("As notificações foram bloqueadas. Por favor, altere as permissões do seu navegador.");
        return;
    }
    
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            alert("Notificações ativadas com sucesso!");
            displayNotification("Alarme ++", "As notificações foram ativadas. Você receberá alertas aqui.");
        }
    });
}

function displayNotification(title, body) {
    if (Notification.permission === "granted") {
        new Notification(title, { body: body });
    }
}

function atualizarRelogio() {
    const data = new Date();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');
    relogio.textContent = `${horas}:${minutos}:${segundos}`;
    
    alarmes.forEach(alarme => {
        if (alarme.status === 'on' && `${horas}:${minutos}` === alarme.hora && somAlarme.paused) {
            tocarAlarme(alarme.hora, alarme.som);
            alarme.status = 'off';
            renderizarAlarmes();
            salvarAlarmes();
        }
    });
}

function renderizarAlarmes() {
    listaAlarmes.innerHTML = '';
    if (alarmes.length === 0) {
        listaAlarmes.innerHTML = '<p style="text-align: center;">Nenhum alarme criado.</p>';
    }
    alarmes.forEach((alarme, index) => {
        const alarmeItem = document.createElement('div');
        alarmeItem.className = 'alarme-item';
        
        const somTexto = audioNames[alarme.som] || alarme.som;

        alarmeItem.innerHTML = `
            <div class="info-alarme">
                <span class="hora">${alarme.hora}</span>
                <span class="som">${somTexto}</span>
            </div>
            <div class="botoes">
                <button class="btn-editar">✏️</button>
                <button class="btn-ativar">${alarme.status === 'on' ? 'Ligado' : 'Desligado'}</button>
                <button class="btn-excluir">🗑️</button>
            </div>
        `;
        
        if (alarme.status === 'on') {
            alarmeItem.querySelector('.btn-ativar').classList.add('on');
        } else {
            alarmeItem.querySelector('.btn-ativar').classList.remove('on');
        }

        alarmeItem.querySelector('.btn-ativar').addEventListener('click', () => {
            alarme.status = alarme.status === 'on' ? 'off' : 'on';
            renderizarAlarmes();
            salvarAlarmes();
        });

        alarmeItem.querySelector('.btn-editar').addEventListener('click', () => {
            alarmeEditandoId = alarme.id;
            inputNovoAlarme.value = alarme.hora;
            selectSomAlarme.value = alarme.som;
            tituloPopupAlarme.textContent = 'Editar alarme';
            btnSalvarAlarme.textContent = 'Salvar edição';
            popupCriarAlarme.style.display = 'flex';
        });

        alarmeItem.querySelector('.btn-excluir').addEventListener('click', () => {
            mensagemConfirmacao.textContent = 'Deseja excluir este alarme?';
            popupConfirmacao.style.display = 'flex';
            btnConfirmarSim.onclick = () => {
                alarmes.splice(index, 1);
                renderizarAlarmes();
                salvarAlarmes();
                popupConfirmacao.style.display = 'none';
            };
        });

        listaAlarmes.appendChild(alarmeItem);
    });
}

// Modificado para aceitar o nome do alarme/temporizador e o caminho do som
function tocarAlarme(nome, som) {
    somAlarme.src = som;
    somAlarme.play();
    somAlarme.loop = true;
    alarmeTocandoHora.textContent = nome;
    popupAlarmeTocando.style.display = 'flex';
    displayNotification("Alarme", `${nome} está tocando!`);
}

function pararAlarme() {
    somAlarme.pause();
    somAlarme.currentTime = 0;
    somAlarme.loop = false;
    popupAlarmeTocando.style.display = 'none';
}

function formatarTempoCrono(milisegundos) {
    let totalSegundos = Math.floor(milisegundos / 1000);
    const horas = Math.floor(totalSegundos / 3600);
    totalSegundos %= 3600;
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    const milisegundosFormatado = String(Math.floor((milisegundos % 1000) / 10)).padStart(2, '0');
    
    const displayHoras = String(horas).padStart(2, '0');
    const displayMinutos = String(minutos).padStart(2, '0');
    const displaySegundos = String(segundos).padStart(2, '0');

    return `${displayHoras}:${displayMinutos}:${displaySegundos}:${milisegundosFormatado}`;
}

function atualizarCronoDisplay() {
    tempoDecorido = Date.now() - tempoInicial;
    cronoDisplay.textContent = formatarTempoCrono(tempoDecorido);
}

function iniciarCrono() {
    tempoInicial = Date.now() - tempoDecorido;
    cronoInterval = setInterval(atualizarCronoDisplay, 10);
    btnIniciarCrono.style.display = 'none';
    btnPausarCrono.style.display = 'inline-block';
    btnMarcarCrono.style.display = 'inline-block';
}

function pausarCrono() {
    clearInterval(cronoInterval);
    btnIniciarCrono.style.display = 'inline-block';
    btnPausarCrono.style.display = 'none';
    btnMarcarCrono.style.display = 'none';
}

function zerarCrono() {
    pausarCrono();
    tempoDecorido = 0;
    cronoDisplay.textContent = '00:00:00:00';
    btnIniciarCrono.style.display = 'inline-block';
    btnPausarCrono.style.display = 'none';
    btnMarcarCrono.style.display = 'none';
    limparMarcacoes();
}

function marcarTempo() {
    if (cronoInterval) {
        const tempoAtual = formatarTempoCrono(tempoDecorido);
        marcacoes.push(tempoAtual);
        renderizarMarcacoes();
    }
}

function renderizarMarcacoes() {
    listaMarcacoes.innerHTML = '';
    if (marcacoes.length > 0) {
        tituloMarcacoes.style.display = 'block';
        btnLimparMarcacoes.style.display = 'block';
    } else {
        tituloMarcacoes.style.display = 'none';
        btnLimparMarcacoes.style.display = 'none';
    }
    marcacoes.forEach((tempo, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>Marca ${index + 1}:</span> <span>${tempo}</span>`;
        listaMarcacoes.appendChild(li);
    });
}

function limparMarcacoes() {
    marcacoes = [];
    renderizarMarcacoes();
}

function formatarTempoTemporizador(milisegundos) {
    const totalSegundos = Math.floor(milisegundos / 1000);
    const h = String(Math.floor(totalSegundos / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSegundos % 3600) / 60)).padStart(2, '0');
    const s = String(totalSegundos % 60).padStart(2, '0');
    const c = String(Math.floor((milisegundos % 1000) / 10)).padStart(2, '0');
    return `${h}:${m}:${s}:${c}`;
}

function iniciarTemporizador() {
    if (!temporizadorPausado) {
        const h = parseInt(inputHoras.value) || 0;
        const m = parseInt(inputMinutos.value) || 0;
        const s = parseInt(inputSegundos.value) || 0;
        duracaoInicialTemporizador = (h * 3600 + m * 60 + s) * 1000;
        tempoRestanteMilisegundos = duracaoInicialTemporizador;
        
        if (tempoRestanteMilisegundos <= 0) {
            alert('Por favor, defina um tempo válido.');
            return;
        }
    }
    
    btnIniciarTempo.style.display = 'none';
    btnPausarTempo.style.display = 'inline-block';
    inputHoras.disabled = true;
    inputMinutos.disabled = true;
    inputSegundos.disabled = true;

    const inicioContagem = Date.now();
    let tempoBase = tempoRestanteMilisegundos;

    temporizadorInterval = setInterval(() => {
        tempoRestanteMilisegundos = tempoBase - (Date.now() - inicioContagem);

        if (tempoRestanteMilisegundos <= 0) {
            clearInterval(temporizadorInterval);
            tempoRestanteMilisegundos = 0;
            tempoDisplay.textContent = formatarTempoTemporizador(tempoRestanteMilisegundos);
            tocarTemporizador();
            return;
        }
        tempoDisplay.textContent = formatarTempoTemporizador(tempoRestanteMilisegundos);
    }, 10);
    temporizadorPausado = false;
}

function pausarTemporizador() {
    clearInterval(temporizadorInterval);
    temporizadorPausado = true;
    btnIniciarTempo.style.display = 'inline-block';
    btnPausarTempo.style.display = 'none';
}

function zerarTemporizador() {
    clearInterval(temporizadorInterval);
    temporizadorPausado = false;
    tempoRestanteMilisegundos = 0;
    duracaoInicialTemporizador = 0;
    tempoDisplay.textContent = '00:00:00:00';
    btnIniciarTempo.style.display = 'inline-block';
    btnPausarTempo.style.display = 'none';
    inputHoras.value = '';
    inputMinutos.value = '';
    inputSegundos.value = '';
    inputHoras.disabled = false;
    inputMinutos.disabled = false;
    inputSegundos.disabled = false;
}

function tocarTemporizador() {
    somAlarme.src = 'alarme.mp3';
    somAlarme.play();
    somAlarme.loop = true;
    popupTemporizadorTocando.style.display = 'flex';
    displayNotification("Temporizador", "Seu tempo esgotado!");
}

function pararTemporizador() {
    somAlarme.pause();
    somAlarme.currentTime = 0;
    somAlarme.loop = false;
    popupTemporizadorTocando.style.display = 'none';
}

function contarNovamente() {
    pararTemporizador();
    tempoRestanteMilisegundos = duracaoInicialTemporizador;
    iniciarTemporizador();
}

function salvarTemposX() {
    localStorage.setItem('temposX', JSON.stringify(temposX.map(t => ({
        ...t,
        dataInicio: t.dataInicio.toISOString(),
        dataFim: t.dataFim.toISOString()
    }))));
}

function carregarTemposX() {
    const temposXSalvos = localStorage.getItem('temposX');
    if (temposXSalvos) {
        temposX = JSON.parse(temposXSalvos).map(t => ({
            ...t,
            dataInicio: new Date(t.dataInicio),
            dataFim: new Date(t.dataFim)
        }));
    }
}

function gerenciarTemposX() {
    const agora = new Date();
    temposX.forEach(tempox => {
        if (tempox.status === 'on') {
            const dataFim = new Date(tempox.dataFim);
            
            if (agora > dataFim) {
                tempox.status = 'off';
                salvarTemposX();
                renderizarTemposX();
                return;
            }

            if (tempox.repeticaoTotalMinutos > 0) {
                const tempoDesdeInicio = agora.getTime() - tempox.dataInicio.getTime();
                const minutosDesdeInicio = Math.floor(tempoDesdeInicio / (1000 * 60));

                const isMultiple = minutosDesdeInicio > 0 && minutosDesdeInicio % tempox.repeticaoTotalMinutos === 0;

                if (isMultiple) {
                    // Adicionando uma verificação para evitar que o alarme toque várias vezes no mesmo minuto
                    // Nova lógica: Verifique a última chamada do alarme
                    const ultimaChamadaMs = tempox.ultimaChamada || 0;
                    if (agora.getTime() - ultimaChamadaMs > 59000) { // Toca apenas uma vez por minuto
                        tocarAlarme(tempox.nome || 'Tempo X', tempox.som);
                        tempox.ultimaChamada = agora.getTime();
                        salvarTemposX();
                    }
                }
            }
        }
    });
}

function renderizarTemposX() {
    listaTemposX.innerHTML = '';
    if (temposX.length === 0) {
        listaTemposX.innerHTML = '<p style="text-align: center;">Nenhum Tempo X criado.</p>';
    }
    temposX.forEach((tempox, index) => {
        const tempoxItem = document.createElement('div');
        tempoxItem.className = 'tempox-item';
        
        let repeticaoHTML = '';
        let repeticaoTexto = 'Repetir a cada';
        if (tempox.repeticaoHoras > 0) {
            repeticaoTexto += ` ${tempox.repeticaoHoras}h`;
        }
        if (tempox.repeticaoMinutos > 0) {
            repeticaoTexto += ` ${tempox.repeticaoMinutos}m`;
        }
        // Adicionando a exibição do som selecionado
        const somTexto = audioNames[tempox.som] || tempox.som;

        if (tempox.dias > 0) {
            const textoDias = tempox.dias === 1 ? 'dia' : 'dias';
            repeticaoTexto += ` durante ${tempox.dias} ${textoDias}`;
        }
        
        if (tempox.repeticaoHoras > 0 || tempox.repeticaoMinutos > 0 || tempox.dias > 0) {
             repeticaoHTML = `<span class="repeticao">${repeticaoTexto.trim()}</span>`;
        }
        
        let infoDatas = '';
        if (tempox.dias > 0) {
            const dataFimFormatada = tempox.dataFim.toLocaleDateString('pt-BR');
            infoDatas = `<span class="descricao">Finaliza em: ${dataFimFormatada}</span>`;
        }

        tempoxItem.innerHTML = `
            <div class="info">
                <span class="nome">${tempox.nome || 'Tempo X Sem Nome'}</span>
                <span class="descricao">${tempox.descricao || ''}</span>
                <span class="som">${somTexto}</span>
                ${repeticaoHTML}
                ${infoDatas}
            </div>
            <div class="botoes">
                <button class="btn-editar">✏️</button>
                <button class="btn-ativar">${tempox.status === 'on' ? 'Ligado' : 'Desligado'}</button>
                <button class="btn-excluir">🗑️</button>
            </div>
        `;

        if (tempox.status === 'on') {
            tempoxItem.querySelector('.btn-ativar').classList.add('on');
        } else {
            tempoxItem.querySelector('.btn-ativar').classList.remove('on');
        }

        tempoxItem.querySelector('.btn-ativar').addEventListener('click', () => {
            tempox.status = tempox.status === 'on' ? 'off' : 'on';
            salvarTemposX();
            renderizarTemposX();
        });

        tempoxItem.querySelector('.btn-editar').addEventListener('click', () => {
            tempoxEditandoId = tempox.id;
            inputNome.value = tempox.nome;
            inputDescricao.value = tempox.descricao;
            inputRepeticaoHoras.value = tempox.repeticaoHoras;
            inputRepeticaoMinutos.value = tempox.repeticaoMinutos;
            inputDias.value = tempox.dias;
            // Populando o seletor de som com o valor salvo
            selectSomTempox.value = tempox.som;
            popupTempox.querySelector('h2').textContent = 'Editar Tempo X';
            popupTempox.querySelector('#btnSalvarTempox').textContent = 'Salvar Edição';
            popupTempox.style.display = 'flex';
        });

        tempoxItem.querySelector('.btn-excluir').addEventListener('click', () => {
            mensagemConfirmacao.textContent = `Deseja excluir o Tempo X "${tempox.nome}"?`;
            popupConfirmacao.style.display = 'flex';
            btnConfirmarSim.onclick = () => {
                temposX.splice(index, 1);
                renderizarTemposX();
                salvarTemposX();
                popupConfirmacao.style.display = 'none';
            };
        });
        
        listaTemposX.appendChild(tempoxItem);
    });
}

btnAlarme.addEventListener('click', () => alternarSecao('alarme'));
btnCrono.addEventListener('click', () => alternarSecao('crono'));
btnTempo.addEventListener('click', () => alternarSecao('tempo'));
btnTempoX.addEventListener('click', () => alternarSecao('tempox'));

btnCriarAlarme.addEventListener('click', () => {
    alarmeEditandoId = null;
    inputNovoAlarme.value = '';
    selectSomAlarme.value = 'alarme.mp3';
    tituloPopupAlarme.textContent = 'Criar novo alarme';
    btnSalvarAlarme.textContent = 'Salvar';
    popupCriarAlarme.style.display = 'flex';
});

btnSalvarAlarme.addEventListener('click', () => {
    const hora = inputNovoAlarme.value;
    const som = selectSomAlarme.value;
    if (hora) {
        if (alarmeEditandoId !== null) {
            const alarmeIndex = alarmes.findIndex(a => a.id === alarmeEditandoId);
            if (alarmeIndex !== -1) {
                alarmes[alarmeIndex].hora = hora;
                alarmes[alarmeIndex].som = som;
            }
        } else {
            alarmes.push({
                id: Date.now(),
                hora: hora,
                som: som,
                status: 'on'
            });
        }
        renderizarAlarmes();
        salvarAlarmes();
        popupCriarAlarme.style.display = 'none';
        inputNovoAlarme.value = '';
        selectSomAlarme.value = 'alarme.mp3';
        alarmeEditandoId = null;
    } else {
        alert("Por favor, selecione um horário para o alarme.");
    }
});

btnOuvirAlarme.addEventListener('click', () => {
    if (somPreview.paused) {
        somPreview.src = selectSomAlarme.value;
        somPreview.play();
        btnOuvirAlarme.textContent = 'Parar';
    } else {
        somPreview.pause();
        somPreview.currentTime = 0;
        btnOuvirAlarme.textContent = 'Ouvir';
    }
});

closeBtnCriar.addEventListener('click', () => {
    popupCriarAlarme.style.display = 'none';
    alarmeEditandoId = null;
    // Parar som de preview caso esteja tocando
    somPreview.pause();
    somPreview.currentTime = 0;
    btnOuvirAlarme.textContent = 'Ouvir';
});

settingsButton.addEventListener('click', () => {
    settingsPopup.style.display = 'flex';
});

closeBtnSettings.addEventListener('click', () => {
    settingsPopup.style.display = 'none';
});

btnApagarTudo.addEventListener('click', () => {
    if (alarmes.length === 0) {
        alert("Não há alarmes para apagar.");
        return;
    }
    
    settingsPopup.style.display = 'none';
    mensagemConfirmacao.textContent = 'Tem certeza que deseja excluir todos os alarmes?';
    popupConfirmacao.style.display = 'flex';

    btnConfirmarSim.onclick = () => {
        alarmes = [];
        renderizarAlarmes();
        salvarAlarmes();
        popupConfirmacao.style.display = 'none';
    };
});

btnConfirmarNao.addEventListener('click', () => {
    popupConfirmacao.style.display = 'none';
});

btnParar.addEventListener('click', pararAlarme);

btnSoneca.addEventListener('click', () => {
    pararAlarme();
    const now = new Date();
    const newAlarmTime = new Date(now.getTime() + 5 * 60000);
    const snoozeHour = String(newAlarmTime.getHours()).padStart(2, '0');
    const snoozeMinute = String(newAlarmTime.getMinutes()).padStart(2, '0');
    const newAlarmHora = `${snoozeHour}:${snoozeMinute}`;
    
    // Pega o som do último alarme ativo ou usa um padrão
    const lastActiveAlarm = alarmes.find(a => a.status === 'on') || { som: 'alarme.mp3' };

    alarmes.push({
        id: Date.now(),
        hora: newAlarmHora,
        som: lastActiveAlarm.som,
        status: 'on'
    });
    renderizarAlarmes();
    salvarAlarmes();
    alert(`Soneca de 5 minutos ativada! O próximo alarme tocará às ${newAlarmHora}.`);
});

window.addEventListener('click', (event) => {
    if (event.target.classList.contains('popup') && event.target.id !== 'popup-alarme-tocando' && event.target.id !== 'popup-temporizador-tocando') {
        event.target.style.display = 'none';
        alarmeEditandoId = null;
    }
});

btnIniciarCrono.addEventListener('click', iniciarCrono);
btnPausarCrono.addEventListener('click', pausarCrono);
btnMarcarCrono.addEventListener('click', marcarTempo);
btnZerarCrono.addEventListener('click', zerarCrono);
btnLimparMarcacoes.addEventListener('click', limparMarcacoes);

btnIniciarTempo.addEventListener('click', iniciarTemporizador);
btnPausarTempo.addEventListener('click', pausarTemporizador);
btnZerarTempo.addEventListener('click', zerarTemporizador);
btnPararTempo.addEventListener('click', pararTemporizador);
btnContarNovamente.addEventListener('click', contarNovamente);

btnCriarTempox.addEventListener('click', () => {
    tempoxEditandoId = null;
    inputNome.value = '';
    inputDescricao.value = '';
    selectSomTempox.value = 'alarme.mp3'; // Reseta o som para o padrão
    inputRepeticaoHoras.value = '';
    inputRepeticaoMinutos.value = '';
    inputDias.value = '';
    popupTempox.querySelector('h2').textContent = 'Criar Tempo X';
    popupTempox.querySelector('#btnSalvarTempox').textContent = 'Salvar Tempo X';
    popupTempox.style.display = 'flex';
});

closeBtnTempox.addEventListener('click', () => {
    popupTempox.style.display = 'none';
    // Parar som de preview caso esteja tocando
    somPreview.pause();
    somPreview.currentTime = 0;
    btnOuvirTempox.textContent = 'Ouvir';
});

btnSalvarTempox.addEventListener('click', () => {
    const nome = inputNome.value || 'Sem Nome';
    const descricao = inputDescricao.value;
    const som = selectSomTempox.value; // Pega o som do novo seletor
    const repeticaoHoras = parseInt(inputRepeticaoHoras.value) || 0;
    const repeticaoMinutos = parseInt(inputRepeticaoMinutos.value) || 0;
    const dias = parseInt(inputDias.value) || 0;
    
    const repeticaoTotalMinutos = (repeticaoHoras * 60) + repeticaoMinutos;

    if (repeticaoTotalMinutos === 0) {
        alert("Por favor, defina um tempo de repetição (horas ou minutos).");
        return;
    }
    
    const dataInicio = new Date();
    const dataFim = new Date(dataInicio.getTime() + dias * 24 * 60 * 60 * 1000);
    
    if (tempoxEditandoId !== null) {
        const tempoxIndex = temposX.findIndex(t => t.id === tempoxEditandoId);
        if (tempoxIndex !== -1) {
            temposX[tempoxIndex].nome = nome;
            temposX[tempoxIndex].descricao = descricao;
            temposX[tempoxIndex].som = som; // Salva o novo som
            temposX[tempoxIndex].repeticaoHoras = repeticaoHoras;
            temposX[tempoxIndex].repeticaoMinutos = repeticaoMinutos;
            temposX[tempoxIndex].repeticaoTotalMinutos = repeticaoTotalMinutos;
            temposX[tempoxIndex].dias = dias;
            temposX[tempoxIndex].dataInicio = dataInicio;
            temposX[tempoxIndex].dataFim = dataFim;
        }
    } else {
        temposX.push({
            id: Date.now(),
            nome,
            descricao,
            som, // Inclui o som na criação
            repeticaoHoras,
            repeticaoMinutos,
            repeticaoTotalMinutos,
            dias,
            dataInicio,
            dataFim,
            status: 'on'
        });
    }

    renderizarTemposX();
    salvarTemposX();
    
    popupTempox.style.display = 'none';
});

// Adicionado o listener para o botão de ouvir do Tempo X
btnOuvirTempox.addEventListener('click', () => {
    if (somPreview.paused) {
        somPreview.src = selectSomTempox.value;
        somPreview.play();
        btnOuvirTempox.textContent = 'Parar';
    } else {
        somPreview.pause();
        somPreview.currentTime = 0;
        btnOuvirTempox.textContent = 'Ouvir';
    }
});

btnToggleTheme.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLightTheme = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
});

btnRequestNotification.addEventListener('click', () => {
    requestNotificationPermission();
});

// Event listeners para a nova tela de atualizações
btnAtualizacoes.addEventListener('click', () => {
    settingsPopup.style.display = 'none';
    popupAtualizacoes.style.display = 'flex';
});

closeBtnAtualizacoes.addEventListener('click', () => {
    popupAtualizacoes.style.display = 'none';
});

function carregarTemaSalvo() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
}

setInterval(atualizarRelogio, 1000);
setInterval(gerenciarTemposX, 1000);
carregarAlarmes();
carregarTemposX();
carregarTemaSalvo();
atualizarRelogio();
renderizarAlarmes();
renderizarTemposX();
alternarSecao('alarme');