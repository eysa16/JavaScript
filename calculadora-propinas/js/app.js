// VARIABLES

let cliente = {
    mesa: "",
    hora: "",
    pedido: []
}

let categorias = {
    1: 'Comidas',
    2: 'Bebidas',
    3: 'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);


// FUNCIONES

function guardarCliente() {

    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;


    // Validar que los campos no esten vacios

    if(mesa === "" || hora === "") {
        mostrarAlerta("Ambos campos son obligatorios");
    }else{
        console.log("Los campos estan llenos")
    }

    // Asignando datos del formulario al cliente
    cliente.mesa = mesa;
    cliente.hora = hora;

    // Ocultar modal de boostrap
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap  = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide()

    // Mostrar secciones
    mostrarSecciones();

    // Obtener Platillos de la API de JSON-Server
    obtenerPlatillos();
}


function mostrarAlerta(mensaje) {

    // Verificar si ya existe una alerta

    const existeAlerta = document.querySelector('.invalid-feedback');

    if(!existeAlerta) {

        const alerta = document.createElement('DIV');
        alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
        alerta.textContent = mensaje;
        document.querySelector('.modal-body form').appendChild(alerta);  

        // Elimina la alerta despues de 3 segundos
        setTimeout(() => {
            alerta.remove();
        }, 3000);

    }

    return;

}

function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach( seccion => seccion.classList.remove('d-none'));
}

function obtenerPlatillos() {
    const url = 'http://localhost:4000/platillos';

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( resultado => mostrarPlatillos(resultado))
        .catch( error => console.log(error))
}

function mostrarPlatillos(platillos) {

    const contenido = document.querySelector('#platillos .contenido')

    platillos.forEach( platillo => {

        const {categoria, id, nombre, precio } = platillo;

        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top');

        const nombrePlatillo = document.createElement('DIV');
        nombrePlatillo.classList.add('col-md-4');
        nombrePlatillo.textContent = nombre;

        const precioPlatillo = document.createElement('DIV');
        precioPlatillo.classList.add('col-md-3', 'fw-bold');
        precioPlatillo.textContent = `$${precio}`;  
        
        const categoriaPlatillo = document.createElement('DIV');
        categoriaPlatillo.classList.add('col-md-3');
        categoriaPlatillo.textContent = categorias[categoria];

        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type = 'number'
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${id}`;
        inputCantidad.classList.add('form-control');

        // Función que detecta la cantidad y el platillo que se está agregando
        inputCantidad.onchange = function () {
            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo({...platillo, cantidad});
        }

        const inputPlatillo = document.createElement('DIV');
        inputPlatillo.classList.add('col-md-2');
        inputPlatillo.appendChild(inputCantidad)

        row.appendChild(nombrePlatillo);
        row.appendChild(precioPlatillo);
        row.appendChild(categoriaPlatillo);
        row.appendChild(inputPlatillo);
        contenido.appendChild(row);

        console.log(platillo)
    })
}

function agregarPlatillo(producto) {
    
    let { pedido } = cliente;

    if(producto.cantidad > 0) {

        if( pedido.some( articulo => articulo.id === producto.id) ) {
            
            const pedidoActualizado = pedido.map( articulo => {
                if(articulo.id === producto.id){
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            });

            cliente.pedido = [...pedidoActualizado];

        } else {
            cliente.pedido = [...pedido, producto];
        }

    } else {
        const resultado = pedido.filter( articulo => articulo.id !== producto.id);

        cliente.pedido = [...resultado];
    }

    console.log(cliente.pedido);

    // Limpia el contenido HTML previo
    limpiarHTML();

    if(cliente.pedido.length > 0) {
        // Mostrar el resumen
        actualizarResumen();
    } else {
        // Muestra un mensaje inicial
        mensajePedidoVacio();
    }

}

function actualizarResumen() {

    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

    // Informacion de la mesa
    const mesa = document.createElement('P');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('SPAN');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    // Informacion de la hora
    const hora = document.createElement('P');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('SPAN');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    // Agregar a los elementos padre
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    // Título de la sección
    const heading = document.createElement('H3');
    heading.textContent = 'Platillos Consumidos';
    heading.classList.add('my-4', 'text-center');

    // Iterar sobre el array de pedidos
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');

    const { pedido } = cliente;

    pedido.forEach( articulo => {

        const { nombre, precio, cantidad, id } = articulo;

        const lista = document.createElement('LI');
        lista.classList.add('list-group-item');

        // Nombre del articulo
        const nombreEl = document.createElement('H4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;

        // Cantidad del articulo
        const cantidadEl = document.createElement('P');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('SPAN');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;
        
        // Precio del articulo
        const precioEl = document.createElement('P');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: ';

        const precioValor = document.createElement('SPAN');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`;
        
        // Subtotal del articulo
        const subtotalEl = document.createElement('P');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal: ';

        const subtotalValor = document.createElement('SPAN');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal( precio, cantidad );

        // Boton para eliminar del pedido
        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar del pedido';

        btnEliminar.onclick = function() {
            eliminarProducto(id);
        }

        // Agregando los valores a sus contenedores
        cantidadEl.appendChild(cantidadValor);
        precioEl.appendChild(precioValor);
        subtotalEl.appendChild(subtotalValor);

        // Agregar elemento al Li
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar)

        // Agregar lista al grupo principal
        grupo.appendChild(lista);

    })

    // Agregar al contenido
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo)

    contenido.appendChild(resumen);

    // Mostrar formulario de propinas
    formularioPropinas();
}

function calcularSubtotal( precio, cantidad ) {
    return `$${precio * cantidad}`
}

function eliminarProducto(id) {

    const { pedido } = cliente;
    const inputCantidad =  document.querySelectorAll('.form-control');

    // Se filtra el pedido por id
    const pedidoActualizado = pedido.filter( articulo => articulo.id !== id)
    cliente.pedido = [...pedidoActualizado];

    // Se resetea el valor a cero del input en cuestión
    inputCantidad[parseInt(id) - 1].value = 0;

    console.log(cliente.pedido)

    // Limpia el contenido HTML previo
    limpiarHTML();

    if(cliente.pedido.length > 0) {
        // Mostrar el resumen
        actualizarResumen();
    } else {
        // Muestra un mensaje inicial
        mensajePedidoVacio();
    }

}

function mensajePedidoVacio() {

    const contenido = document.querySelector('#resumen .contenido');
    
    const texto = document.createElement('P');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos del pedido';

    contenido.appendChild(texto)

}

function formularioPropinas() {
    
    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('DIV');
    formulario.classList.add('col-md-6', 'formulario');

    const divFormulario = document.createElement('DIV');
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow');

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';


    // Radio Button 10%
    const radio10 = document.createElement('INPUT');
    radio10.type = 'radio';
    radio10.name = 'propina',
    radio10.value = '10';
    radio10.classList.add('form-check-input');

    const radio10Label = document.createElement('LABEL');
    radio10Label.textContent = '10%';
    radio10Label.classList.add('form-check-label');

    const radio10Div = document.createElement('DIV');
    radio10Div.classList.add('form-check');

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    radio10.onclick = function() {
        calcularPropina();
    };


    // Radio Button 25%
    const radio25 = document.createElement('INPUT');
    radio25.type = 'radio';
    radio25.name = 'propina',
    radio25.value = '25';
    radio25.classList.add('form-check-input');

    const radio25Label = document.createElement('LABEL');
    radio25Label.textContent = '25%';
    radio25Label.classList.add('form-check-label');

    const radio25Div = document.createElement('DIV');
    radio25Div.classList.add('form-check');

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);

    radio25.onclick = function() {
        calcularPropina();
    };

    // Radio Button 50%
    const radio50 = document.createElement('INPUT');
    radio50.type = 'radio';
    radio50.name = 'propina',
    radio50.value = '50';
    radio50.classList.add('form-check-input');

    const radio50Label = document.createElement('LABEL');
    radio50Label.textContent = '50%';
    radio50Label.classList.add('form-check-label');

    const radio50Div = document.createElement('DIV');
    radio50Div.classList.add('form-check');

    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label);

    radio50.onclick = function() {
        calcularPropina();
    };

    // Agregar al Div Principal
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);

    // Agregar al formulario
    formulario.appendChild(divFormulario);
    contenido.appendChild(formulario);

}

function calcularPropina() {

    const { pedido } = cliente;
    let subtotal = 0;

    // Calcular el subtotal a pagar
    pedido.forEach( articulo => {
        subtotal += articulo.cantidad * articulo.precio;
    });

    // Selecciona el procentaje de propina que se seleccione
    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;

    // Calcular la propina correspondiente
    const propina = ((parseInt(propinaSeleccionada) * subtotal) / 100)

    // Calcular el total de la cuenta
    const total = subtotal + propina;

    mostrarTotalHTML( total, subtotal, propina );

}

function mostrarTotalHTML( total, subtotal, propina ) {

    // Selecciona el procentaje de propina que se seleccione
    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;
        
    const divTotales = document.createElement('DIV');
    divTotales.classList.add('total-pagar', 'my-5');

    // Subtotal
    const subtotalParrafo = document.createElement('P');
    subtotalParrafo.classList.add('fs-3', 'fw-bold', 'mt-5');
    subtotalParrafo.textContent = 'Subtotal consumo: ';

    const subtotalSpan = document.createElement('SPAN');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${subtotal}`;

    subtotalParrafo.appendChild(subtotalSpan);


    // Propina
    const propinaParrafo = document.createElement('P');
    propinaParrafo.classList.add('fs-3', 'fw-bold', 'mt-5');
    propinaParrafo.textContent = `Propina del ${propinaSeleccionada}%: `;

    const propinaSpan = document.createElement('SPAN');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `$${propina}`;

    propinaParrafo.appendChild(propinaSpan);


    // Total
    const totalParrafo = document.createElement('P');
    totalParrafo.classList.add('fs-3', 'fw-bold', 'mt-5');
    totalParrafo.textContent = 'Total de cuenta: ';
 
    const totalSpan = document.createElement('SPAN');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$${total}`;
 
    totalParrafo.appendChild(totalSpan);   

    // Eliminar resultado anterior al cambiar el monto de propina
    const divTotalPagar = document.querySelector('.total-pagar');

    if(divTotalPagar) {
        divTotalPagar.remove();
    }

    // Inyectando los valores en el div
    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);
    
    const formulario = document.querySelector('.formulario > div'); // Primer div del formulario
    formulario.appendChild(divTotales)

}

function limpiarHTML() {

    const contenido = document.querySelector('#resumen .contenido');

    while(contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
}


