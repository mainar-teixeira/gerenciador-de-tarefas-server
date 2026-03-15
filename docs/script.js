

const txtarea = document.querySelector('#txtarea');
const btAdd = document.getElementById('Add');

const emailLogin = document.getElementById('emailLogin');
const senhaLogin = document.getElementById('senhaLogin');

const btEnter = document.getElementById('log');


let login =  localStorage.getItem('booLogin') === 'true';


let userDate = {
    id: 0, 
    name: "",
    Email: ""
};

let userStr = localStorage.getItem('userLogin');
let userConectado = userStr ? JSON.parse(userStr) : null;
console.log(userConectado);





if (btAdd) {
    document.addEventListener('DOMContentLoaded', () => {
        
        if (userConectado) {
            document.getElementById('usuarioNome').textContent = 'Usuário: ' + userConectado.name;
        }

        fetch('/loadTarefas', {
            method: 'POST',
            headers: { 'Content-Type' :  'application/json' },
            body: JSON.stringify({
                userID: userConectado.id
            })
        }).then(res => res.json()).then(tarefas => {
            
            tarefas.forEach(tarefa => {
                document.querySelector('.tarefas').innerHTML += `<div class="tarefa" data-id="${tarefa.id_tarefa}">
                <p class="txt-da-tarefa">${tarefa.txt_da_tarefa}</p>
                <button class="concluir">Concluír</button>
                <button class="editar">Editar</button>
                <button class="Deletar">Deletar</button>
            </div>`;

            });
        })


    });
}



if (btAdd) {

    btAdd.addEventListener('click', () => {

        
        if (!txtarea.value || txtarea.value.trim().length === 0) {
            return console.log('tarefa sem texto');
        }

        if (!login) {
            window.location.href = '/login.html';
        } else {

            

        fetch('/tarefa', {
            method: 'POST',
            headers: { 'Content-Type' :  'application/json' },
            body: JSON.stringify({
                texto: txtarea.value.trim().replace(/[ ]+/g, " "),
                userID: userConectado.id
            })
        }).then(res => res.json()).then(tarefa => {
            console.log(tarefa);


            
            
            document.querySelector('.tarefas').innerHTML += `<div class="tarefa" data-id="${tarefa.id}">
                <p class="txt-da-tarefa">${tarefa.texto}</p>
                <button class="concluir">Concluír</button>
                <button class="editar">Editar</button>
                <button class="Deletar">Deletar</button>
            </div>`;
            
        }
        ).catch(err => console.log('ERROR: ' + err));
        }

    });
}

if (btEnter) {
    btEnter.addEventListener('click', () => {
        // alert ('bt clicado!');

        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({
                emailL: emailLogin.value,
                senhaL: senhaLogin.value
            })
        }).then(res => res.json()).then(credenciais => {
            if (credenciais.length > 0) {
                const usuario = credenciais[0];

                userDate.id = usuario.id_usuario;
                userDate.name = usuario.nome;
                userDate.Email = usuario.email;
                
                
                localStorage.setItem('userLogin', JSON.stringify(userDate));
                
                localStorage.setItem('booLogin', 'true');
                document.querySelector('#txtLog').textContent = 'Conectando Usuário...';
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 500);

                
            } else {
                document.querySelector('#txtLog').textContent = 'Usuário não encontrado';
                setTimeout(() => {
                    document.querySelector('#txtLog').textContent = 'Fazer login';
                }, 500);
            }
        }).catch(err => console.log('ERROR: ' + err));
    });
};

document.querySelector('.tarefas').addEventListener('click', (event) => {
    const pickTarefa = event.target.closest('.tarefa');
    
    if (event.target.classList.contains('Deletar')) {
        fetch(`/deleteTarefa/${pickTarefa.dataset.id}`, {
            method: 'DELETE'
        })
        .then(res => {
            if (res.ok) {
                pickTarefa.remove();
            }
        }).catch(err => console.log('ERROR: ' + err));
    }
    
});
