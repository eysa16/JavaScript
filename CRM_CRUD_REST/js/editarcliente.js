import { editarCliente, obtenerCliente } from "./API.js";
import { validar, mostrarAlertaNegativa, mostrarAlertaPositiva } from './funciones.js';

(function() {

    // Campos del formulario
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');
    const idInput = document.querySelector('#id');


    document.addEventListener('DOMContentLoaded', async () => {

        const parametrosURL = new URLSearchParams(window.location.search);

        const idCliente = parametrosURL.get('id');

        const cliente = await obtenerCliente(idCliente);
        mostrarCliente(cliente);

        // Submit al formulario
        const formulario = document.querySelector('#formulario');
        formulario.addEventListener('submit', validarCliente);

    });

    function mostrarCliente(cliente) {

        const { id, nombre, telefono, email, empresa } = cliente;
        
        nombreInput.value = nombre;
        telefonoInput.value = telefono;
        emailInput.value = email;
        empresaInput.value = empresa;
        idInput.value = id;

    }

    function validarCliente(evento) {

        evento.preventDefault();

        const cliente = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: idInput.value
        }

        if( validar(cliente) ) {

            // Mostrar mensaje
            mostrarAlertaNegativa('Todos los campos son obligatorios');
            return;

        }

        mostrarAlertaPositiva('Campos llenados correctamente');
        editarCliente(cliente);

    }

})();