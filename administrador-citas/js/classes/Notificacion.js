// IMPORTACIÓN DE SELECTORES
import {formulario} from '../selectores.js'

export class Notificacion{
    constructor({texto, tipo}){
        this.texto = texto;
        this.tipo = tipo;

        this.mostrar();
    }

    mostrar(){

        // SE CREA LA NOTIFICACION
        const alerta = document.createElement('DIV');
        alerta.classList.add('text-center', 'w-full', 'p-3', 'text-white', 'my-5', 'alert', 'uppercase', 'font-bold', 'text-sm');

        // ELIMINAR ALERTAS DUPLICADAS
        const alertaPrevia = document.querySelector('.alert')
        alertaPrevia?.remove(); // Encadenamiento opcional

        // VERIFICAR EL TIPO DE ALERTA (ERROR O EXITO)
        this.tipo === 'error' ? alerta.classList.add('bg-red-500') : alerta.classList.add('bg-green-500')

        // MOSTRANDO EL TEXTO
        alerta.textContent = this.texto;

        // AÑADIENDO LA ALERTA AL HTML
        formulario.parentElement.insertBefore(alerta, formulario);

        // QUITAR DESPUES DE 5 SEGUNDOS
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}