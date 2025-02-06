// IMPORTACIONES
import { Notificacion } from "./classes/Notificacion.js";
import { adminCitas } from "./classes/AdminCitas.js";
import { citaObj, editando } from "./variables.js";
import { formulario, formularioInput, nombreInput, propietarioInput, emailInput, fechaInput, sintomasInput } from "./selectores.js";


// INSTANCIAR
const citas = new adminCitas()

// FUNCIÓN PARA INYECTAR LOS VALORES INGRESADOS EN EL FORMULARIO EN EL OBJETO 'datosCita'
export function datosCita(evento){
    citaObj[evento.target.name] = evento.target.value;
}

// DEVUELVE LAS ALERTAS Y GUARDA LAS CITAS EN EL CONTENEDOR DE CITAS
export function submitCita(evento){
    evento.preventDefault();

    if(Object.values(citaObj).some(valor => valor.trim() === '')){
        new Notificacion({
            texto: 'Todos los campos son obligatorios',
            tipo: 'error'
        })
        return;
    }

    if(editando.value){
        citas.editar({...citaObj});
        new Notificacion({
            texto: 'Guardado correctamente',
            tipo: 'exito'
        })
    }else{
        citas.agregar({...citaObj});
        new Notificacion({
            texto: 'Paciente registrado correctamente',
            tipo: 'exito'
        })
    }

    formulario.reset();
    reiniciarCitaObj();
    formularioInput.value = 'Registrar Paciente';
    editando.value = false;
    
}


// FUNNCIÓN PARA REINICIAR LOS VALORES DEL OBJETO citaObj
export function reiniciarCitaObj(){
    
    // Se reinicia el objeto
    // citaObj.paciente = "";
    // citaObj.paciente = "";
    // citaObj.paciente = "";
    // citaObj.paciente = "";
    // citaObj.paciente = "";

    // DIFERENTE MANERA DE REINICIAR AL OBJ, PERO MISMO EFECTO
    Object.assign(citaObj, {
        id: generarID(),
        paciente: '',
        propietario: '',
        email: '',
        fecha: '',
        sintomas: '',
    })
}


// FUNCIÓN PARA LA CREACIÓN DE ID's UNICOS PARA LOS PACIENTES
export function generarID(){
    return Math.random().toString(36).substring(2) + Date.now()
}

// FUNCIÓN PARA AÑADIR FUNCIONALIDADES AL BOTOND DE EDITAR
export function cargarEdicion(cita){
    
    Object.assign(citaObj, cita); // Se asignan los valores de 'cita' a 'citaObj'

    nombreInput.value = cita.paciente;
    propietarioInput.value = cita.propietario;
    emailInput.value = cita.email;
    fechaInput.value = cita.fecha;
    sintomasInput.value = cita.sintomas;
    
    editando.value = true;
    formularioInput.value = 'Guardar cambios';
}