// VARIABLES Y SELECTORES

const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

// EVENTOS

eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}

// CLASES

class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total,gasto) => total + gasto.cantidadGasto, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
        this.calcularRestante();
    }

}

class UI {
    insertarPresupuesto(cantidad){
        
        // Extraer los valores
        const {presupuesto, restante} = cantidad;

        // Insertar en el HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert')  // 'alert' es una clase de bootstrap

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }

        // Agregando el mensaje de error
        divMensaje.textContent = mensaje;

        // Instertar el div en el HTML
        const primario = document.querySelector('.primario');
        primario.insertBefore(divMensaje,formulario);

        // Quitar alerta
        setTimeout(() => {
            divMensaje.remove()
        }, 3000);
    }

    mostrarGastos(gastos){

        // Elimina el HTML previo
        this.limpiarHTML();

        // Se itera sobre loa gastos
        gastos.forEach(gasto => {
            const {cantidadGasto, nombreGasto, id} = gasto;

            // Crear un li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            // Agrega el HTML al gasto
            nuevoGasto.innerHTML = `${nombreGasto} <span class="badge badge-primary badge-pill"> $ ${cantidadGasto} </span>`;

            // Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;'
            btnBorrar.onclick = () => {
                eliminarGasto(id)
            }
            nuevoGasto.appendChild(btnBorrar);

            // Agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        });
    }

    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestObj){
        const {presupuesto, restante} = presupuestObj;
        const restanteDiv = document.querySelector('.restante');

        // Comprobar si se ha gastado el 25% del presupuesto
        if(restante <= (presupuesto*25)/100){
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        }else if(restante <= (presupuesto*50)/100){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // Si el restante es 0 o menor
        if(restante <= 0){
            ui.imprimirAlerta('Tu presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }else{
            formulario.querySelector('button[type="submit"]').disabled = false;
        }
    }

}

// INSTANCIAR
const ui = new UI();
let presupuesto;


// FUNCIONES

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?'); 

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }
    
    // Presupuesto válido
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);
    ui.insertarPresupuesto(presupuesto);

}

// Añade los gastos

function agregarGasto(evento){
    evento.preventDefault();

    // Leer los datos del formulario
    const nombreGasto = document.querySelector('#gasto').value;
    const cantidadGasto = Number(document.querySelector('#cantidad').value);

    if(nombreGasto === '' || cantidadGasto === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if(cantidadGasto <= 0 || isNaN(cantidadGasto)){
        ui.imprimirAlerta('Ingresa una cantidad valida', 'error');
        return;
    }

    // Generar un objeto con el gasto
    const gasto = {
        nombreGasto: nombreGasto,
        cantidadGasto: cantidadGasto,
        id: Date.now()
    }

    // Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    // Alerta de agregado correctamente
    ui.imprimirAlerta('Gasto agregado correctamente', 'correcto');

    // Imprimir los gastos
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

    // Reinicia el formulario
    formulario.reset();

}


// Elimina el gasto indicado de la lista de gastos

function eliminarGasto(id){

    // Los elimina del objeto
    presupuesto.eliminarGasto(id);

    // Elimina los gastos del HTML
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

}