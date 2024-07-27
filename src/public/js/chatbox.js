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
            timer: 750, // Duración en milisegundos
            showConfirmButton: false // Opcional: oculta el botón de confirmación
        });
        title.innerText = `Bienvenido al Chat Grupal, ${user}!`;
    } else {
        user = "Anónimo";
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
        const h4 = document.createElement('h4');
        const mensaje = document.createElement('p');
        const hora = document.createElement('p');
        const horaSpan = document.createElement('span');
        hora.classList.add('horario-mensaje');
        const minSpan = document.createElement('span');
        h4.innerText = element.user == user ? 'Yo' : element.user +': ';
        mensaje.innerText = element.mensaje;
        horaSpan.innerText = element.hora + ":";
        minSpan.innerText = element.min;
        
        div.appendChild(h4);
        div.appendChild(mensaje);
        hora.appendChild(horaSpan);
        hora.appendChild(minSpan);
        div.appendChild(hora);

        chatBox.appendChild(div);
    });

});

socket.on('userON', (data) => {
    const usersON = document.querySelector("#usersON");
    const ul = document.createElement('ul');
    usersON.innerHTML = '';
    data.forEach(element => {
        const li = document.createElement('li');
        li.innerHTML = element.user;
        ul.appendChild(li);
    });
    usersON.appendChild(ul);
});

window.addEventListener('beforeunload', () => {
    socket.emit('userOff', { user });
});