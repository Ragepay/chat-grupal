const socket = io();
const title = document.querySelector("#title");
let user = '';

Swal.fire({
    title: 'Ingresar Nickname',
    input: 'text',
    inputPlaceholder: 'Ingrese su Nickname',
    showCancelButton: true,
    confirmButtonText: 'Enviar',
    cancelButtonText: 'Cancelar',
    allowOutsideClick: false,
    inputValidator: (value) => {
        if (!value) {
            return '¡Debe ingresar un Nickname!';
        }
    }
}).then((result) => {
    if (result.isConfirmed) {
        user = result.value;
        Swal.fire({
            title: 'Nickname ingresado',
            text: user,
            timer: 500, // Duración en milisegundos
            showConfirmButton: false // Opcional: oculta el botón de confirmación
        });
        title.innerText = `Bienvenido al Chat Grupal, ${user}!`;
    } else {
        user = "Anonimo";
    }
    socket.emit('newUser', { user });
});


const inputChatBox = document.querySelector("#inputMensajes");

inputChatBox.addEventListener('keyup', (event) => {
    if (event.key == 'Enter') {
        const id = new Date();
        const fecha = id.toLocaleDateString(); // Obtener la fecha en formato local
        const hora = String(id.getHours()).padStart(2, '0'); // Obtener la hora en formato local
        const min = String(id.getMinutes()).padStart(2, '0');
        socket.emit('mensaje', { user, mensaje: event.target.value, fecha: fecha, hora: hora, min: min });
        inputChatBox.value = '';
    }
});


socket.on('conversacion', (data) => {
    const chatBox = document.querySelector("#mensajes");
    chatBox.innerHTML = '';
    data.forEach(element => {
        const div = document.createElement('div');
        div.innerHTML = `
        <h4>${element.user}</h4>
        <p>${element.mensaje}</p>
        <p class="horario-mensaje"><span>${element.hora}</span>:<span>${element.min}</span></p>`
        chatBox.appendChild(div);
    });
    
});

socket.on('userON', (data)=>{
    const usersON = document.querySelector("#usersON");
    const ul = document.createElement('ul');
    usersON.innerHTML = '';
    data.forEach(element => {
        const li = document.createElement('li');
        li.innerHTML = element.user;
        ul.appendChild(li);
    })
    usersON.appendChild(ul)
});