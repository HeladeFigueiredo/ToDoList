//Crio uma constante que lê os seletores input
//Atividade
const texto = document.querySelector('.txtInputTarefa input');
//Categoria
const categoria = document.querySelector('.txtInputCategoria select');
//hora
const hora = document.querySelector('.txtInputHora input');

const modalTarefas = new bootstrap.Modal(document.getElementById('modal'));

let edita = false;

//Pego o clique no + para editar texto do modal
const btnAbreModal = document.getElementById('addTarefa');
btnAbreModal.onclick = () => {
  document.getElementById('modal-titulo').innerHTML = 'Nova Tarefa';
  document.getElementById('salvar').innerHTML = 'Salvar';
  document.querySelector('.txtInputTarefa input').value = '';
  document.querySelector('.txtInputCategoria select').value = '';
  document.querySelector('.txtInputHora input').value = '';
  edita = false;
}

//Lê dentro da class .divInsert o atributo button
// const btnInsert = document.querySelector('.divInsert button');
const btnInsert = document.querySelector('.modal-footer button');

//Delete All - Lê dentro da classe header o atributo button
const btnDeleteAll = document.querySelector('.footer button');

//Btn Edição de Categorias
const btnEditCategorias = document.querySelector('.txtInputCategoria span');



//Leio todos as listas (atentar para que se usar outra lista ordenada agrupar por classe ou dentro de algum id)
const ul = document.querySelector('ul');

//Inicaliza a variável ítensDB como um array
//Observar que ela fica como var para ser usada no escopo de funções posteriores
var itensDB = []



//Ação de deletar todos os registros
//O delete apenas registra o valor vazio no array
btnDeleteAll.onclick = () => {
  if(confirm('Tem certeza que deseja limpar suas tarefas?')) {
    itensDB = []
    updateDB();
  }
}


btnEditCategorias.onclick = () => {  
  //e.preventDefault();
  //alert('Botão de edição de categoria pressionado');
  document.getElementById("modalcategoria").style.display = "block";
  //Oculto o botão salvar e o close modal tarefas
  document.getElementById("salvar").style.display = "none";
  document.getElementById("close-modal-tarefa").style.display = "none";
  //Carrego as categorias
  loadItensCategorias();
}

function closeCategorias() {
  document.getElementById("modalcategoria").style.display = "none";
  //Exibo o botão salvar
  document.getElementById("salvar").style.display = "block";
  document.getElementById("close-modal-tarefa").style.display = "block";
  carregaItensCategorias();
  
}

//Ação ao pressionar tecla. apenas tecla enter está configurada
hora.addEventListener('keypress', e => {
      if (e.key == 'Enter' && texto.value != '') {
      setItemDB();
    }     
});







//Ação ao clicar botão btnInsert
btnInsert.onclick = () => {
  //Analiso se o conteúdo do botão é diferente de vazio
  if (texto.value != '' && categoria.value != '' && hora.value != '') {
    setItemDB();//Seta itemDB
    //Verifico se é update, caso seja apago o item anterior    
    if (edita) {
      const i = document.getElementById('id-edita').value;
      removeItem(i);
    }
    
    texto.style.borderColor = '#ced4da';
    categoria.style.borderColor = '#ced4da';
    hora.style.borderColor = '#ced4da';

    modalTarefas.toggle();
  } else {
    texto.style.borderColor = (texto.value == '') ? '#dc3545' : '#ced4da';
    categoria.style.borderColor = (categoria.value == '') ? '#dc3545' : '#ced4da';
    hora.style.borderColor = (hora.value == '') ? '#dc3545' : '#ced4da';

    alert('Formulário preenchido incorretamente. Tente novamente.');
    return;
  }
}

//Inserir ítem no LS
function setItemDB() {
  if (itensDB.length >= 20) {//Limita em 20 as atividades
    alert('Limite máximo de 20 atividades atingido!');
    return
  }
  //Adiciona um ítem ao array  
  itensDB.push({ 'item': texto.value, 'categoria': categoria.value, hora: hora.value, 'status': '' })
  updateDB();
}

//Atualizo Local Storage com os dados armazenados no itensDB
function updateDB() {
  itensDB.sort((a, b) => {
    const horaA = (a.hora ?? '00:00').toString();
    const horaB = (b.hora ?? '00:00').toString();

    return horaA.localeCompare(horaB);
  });

  localStorage.setItem('todolist', JSON.stringify(itensDB))
  loadItens();
}

//Atualizo as categorias
// function updateCategoria() {
//   localStorage.setItem('listcategorias', JSON.stringify(itensCategorias))
//   //loadItens();
// }


function loadItens() { //line-tho AQUIIIIIIIIIIIII
  ul.innerHTML = "";
  itensDB = JSON.parse(localStorage.getItem('todolist')) ?? [];
  if (itensDB.length > 0) {
    document.getElementById('footer-trash').style.display = 'block';
  } else {
    document.getElementById('footer-trash').style.display = 'none';
  }
  itensDB.forEach((item, i) => {
    insertItemTela(item.item, item.categoria, item.hora, item.status, i);
  })
}

//Inserir ítem na tela
function insertItemTela(text, categoria, hora, status, i) {

  const li = document.createElement('li');

  li.innerHTML = `
    <div class="divLi">
      <input type="checkbox" ${status} data-i=${i} onchange="done(this, ${i});" />
      <span data-si=${i}>${text}</span>
      <span>${categoria}</span>
      <span>${hora}</span>
      <button onclick="editaItem(${i})" data-bs-toggle="modal" data-bs-target="#modal" data-i=${i}><i class='bx bx-edit'></i></button>
      <button onclick="removeItem(${i})" data-i=${i}><i class='bx bx-trash'></i></button>
    </div>
    `;
  //Adiciona uma ul ao final da lista
  ul.appendChild(li);

  //Linha riscada - Atividade Concluída
  if (status) {
    document.querySelector(`[data-si="${i}"]`).classList.add('line-through');
  } else {
    document.querySelector(`[data-si="${i}"]`).classList.remove('line-through');
  }

  texto.value = '';
}

function done(chk, i) {

  if (chk.checked) {
    itensDB[i].status = 'checked'
  } else {
    itensDB[i].status = ''
  }

  updateDB();
}

function removeItem(i) {
  itensDB.splice(i, 1);//Alterar conteúdo do array e reordenar o mesmo
  updateDB();
}

function editaItem(i) {
  //O modal é aberto pelo button
  //Insiro as informações já preenchidas ao modal
  //const recTxtTarefa = document.querySelector('.txtInputTarefa input');
  const dadosPreenchidos = itensDB[i];
  //alert(dadosPreenchidos.item);
  //.categoria
  //.hora  
  document.querySelector('.txtInputTarefa input').value = dadosPreenchidos.item;
  //document.querySelector('.txtInputCategoria select').selected = dadosPreenchidos.categoria;
  document.querySelector('.txtInputCategoria select').value = dadosPreenchidos.categoria;
  document.querySelector('.txtInputHora input').value = dadosPreenchidos.hora;
  document.getElementById('id-edita').value = i;
  //Altero os texto do modal
  document.getElementById('modal-titulo').innerHTML = 'Editar Tarefa';
  document.getElementById('salvar').innerHTML = 'Atualizar Tarefa';
  //itensDB.splice(i, 1)
  //updateDB()

  edita = true;

}




//DATA E RELÓGIO 
var timeDisplay = document.getElementById('relogio');

function refreshTime() {

  var dateString = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  var formattedString = dateString.replace(', ', ' - ');
  timeDisplay.innerHTML = formattedString;
}

setInterval(refreshTime, 1000);


/**************************CRIAÇÃO DAS CATEGORIAS*********************/
const textoCategoria = document.querySelector('.txtCadastroCategoria input')
const btnInsertCategoria = document.querySelector('.divInsertCategoria button')
//const btnDeleteAllCategoria = document.querySelector('.header button')
const ol = document.querySelector('ol');



var itensDBCategorias = []

// btnDeleteAllCategoria.onclick = () => {
//   itensDBCategorias = []
//   updateDBCategorias()
// }

textoCategoria.addEventListener('keypress', e => {
  if (e.key == 'Enter' && textoCategoria.value != '') {
    setItemDBCategorias()
  }
})

btnInsertCategoria.onclick = () => {
  if (textoCategoria.value != '') {
    setItemDBCategorias()
  }
}

function setItemDBCategorias() {
  if (itensDBCategorias.length >= 10) {
    alert('Limite máximo de 10 categorias atingido!')
    return
  }
  itensDBCategorias.push({ 'item': textoCategoria.value, 'status': '' })
  updateDBCategorias()
}

function updateDBCategorias() {
  localStorage.setItem('categorias', JSON.stringify(itensDBCategorias))
  loadItensCategorias();
}

function loadItensCategorias() {
  ol.innerHTML = "";
  itensDBCategorias = JSON.parse(localStorage.getItem('categorias')) ?? []
  itensDBCategorias.forEach((itemCat, i) => {
    insertItemTelaCategorias(itemCat.item, itemCat.status, i)
  })
}

function insertItemTelaCategorias(text, statusCategoria, i) {
  const liCategoria = document.createElement('li');
  //<input type="checkbox" ${statusCategoria} data-i=${i} onchange="doneCategoria(this, ${i});" />
  liCategoria.innerHTML = `
    <div class="divLi">      
      <span data-si=${i}>${text}</span>
      <button onclick="removeItemCategoria(${i})" data-i=${i}><i class='bx bx-trash'></i></button>
    </div>
    `
  ol.appendChild(liCategoria)

  if (statusCategoria) {
    document.querySelector(`[data-si="${i}"]`).classList.add('line-through')
  } else {
    document.querySelector(`[data-si="${i}"]`).classList.remove('line-through')
  }
  textoCategoria.value = ''
}

function doneCategoria(chk, i) {

  if (chk.checked) {
    itensDBCategorias[i].statusCategoria = 'checked'
  } else {
    itensDBCategorias[i].statusCategoria = ''
  }
  updateDBCategorias()
}

function removeItemCategoria(i) {
  itensDBCategorias.splice(i, 1)
  updateDBCategorias()
}

loadItens();//Inicaliza os registros gerais


/***********************EXIBIÇÃO DAS CATEGORIAS NO SELECT***********/


function carregaItensCategorias() {
  limparSelect();
  let itensCategorias = [];
  const selectCategorias = document.getElementById("categoria");
  itensCategorias = JSON.parse(localStorage.getItem('categorias')) ?? []
  itensCategorias.forEach((itensCategorias) => {
    //geraSelectCategorias(itensCategorias.item); 
    option = new Option(itensCategorias.item, itensCategorias.item.toLowerCase());
    selectCategorias.options[selectCategorias.options.length] = option;
  })

}

function limparSelect() {
  // obter o elemento select
  var elem = document.getElementById("categoria");
  // excluir todas as opções
  elem.options.length = 1;
}


carregaItensCategorias();

function mudaCor(){
  const element = document.querySelector('body');
  if(element.classList.contains('bg-dark')){
    element.classList.remove('bg-dark');
    element.classList.remove('text-white');
  }else{
    element.classList.add('bg-dark');
    element.classList.add('text-white');
  } 
  updateDB();
}

