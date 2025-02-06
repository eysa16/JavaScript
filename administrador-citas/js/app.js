// IMPORTACIÓN DE SELECTORES
import {nombreInput, propietarioInput, emailInput, fechaInput, sintomasInput, formulario} from './selectores.js'
// IMPORTACIÓN DE FUNCIÓN
import { datosCita, submitCita } from './funciones.js';


// DISPARADORES DE EVENTOS

nombreInput.addEventListener('change', datosCita);
propietarioInput.addEventListener('change', datosCita);
emailInput.addEventListener('change', datosCita);
fechaInput.addEventListener('change', datosCita);
sintomasInput.addEventListener('change', datosCita);
formulario.addEventListener('submit', submitCita);

