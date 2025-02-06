// COTIZADOR DE CRIPTOMONEDAS

const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');


const objBusqueda = {
    moneda: "",
    criptomoneda: ""
}



// Crear Promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
}) 


document.addEventListener('DOMContentLoaded', () => {

    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    monedaSelect.addEventListener('change', leerValor);
    criptomonedasSelect.addEventListener('change', leerValor);

});

async function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'
    
    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomonedas(resultado.Data);
        selectCriptomonedas(criptomonedas);
    } catch (error) {
        console.log(error);
    }
    
}


function selectCriptomonedas(criptomonedas) {

    criptomonedas.forEach( cripto => {

        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('OPTION');
        option.value = Name;
        option.textContent = FullName;

        criptomonedasSelect.appendChild(option)

    });
}


function leerValor(evento) {
    
    // nsole.log(evento.target.name)
    // console.log(evento.target.value)

    objBusqueda[evento.target.name] = evento.target.value;

}



function submitFormulario(evento) {

    evento.preventDefault();

    // Validar informacion
    const { moneda, criptomoneda } = objBusqueda;

    if( moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios')
    }

    // Consultar la API con los resultados

    consultarAPI();

}


function mostrarAlerta(mensaje) {

    const existeError = document.querySelector('.error');

    if(!existeError) {

        const divMensaje = document.createElement('DIV');

        divMensaje.classList.add('error');

        // Mensaje de error
        divMensaje.textContent = mensaje;

        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);

    }

}


async function consultarAPI() {

    mostrarSpinner();

    const { moneda, criptomoneda } = objBusqueda;
    
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    try {
        const respuesta = await fetch(url);
        const cotizacion = await respuesta.json();
        mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    } catch (error) {
        console.log(error)
    }
}


function mostrarSpinner() {

    limpiarHTML();

    const spinner = document.createElement('DIV');

    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(spinner);

}


function mostrarCotizacionHTML( cotizacion ) {

    limpiarHTML();
    
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion


    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`

    const precioAlto = document.createElement('P');
    precioAlto.innerHTML = `Precio más alto del día: <span>${HIGHDAY}</span>`
    
    const precioBajo = document.createElement('P');
    precioBajo.innerHTML = `Precio más bajo del día: <span>${LOWDAY}</span>`

    const precioCambio = document.createElement('P');
    precioCambio.innerHTML = `Porcentaje de cambio del día: <span>${CHANGEPCT24HOUR}%</span>`

    const precioActualizacion = document.createElement('P');
    precioActualizacion.innerHTML = `Última actualización: <span>${LASTUPDATE}</span>`


    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(precioCambio);
    resultado.appendChild(precioActualizacion);

}


function limpiarHTML() {

    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

}