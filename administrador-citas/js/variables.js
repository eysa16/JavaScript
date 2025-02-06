// IMPORTACIÓN
import { generarID } from "./funciones.js";

// CREACIÓN DE OBJETO 'CITA'

const citaObj = {
    id: generarID(),
    paciente: '',
    propietario: '',
    email: '',
    fecha: '',
    sintomas: '',
}

let editando = {
    value: false
}

export{
    citaObj,
    editando
}