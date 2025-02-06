// CREANDO SELECTORES DE LOS ELEMENTOS DEL DOM

const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {  // Similar a DOMContentLoaded
    formulario.addEventListener('submit', buscarClima);
})


function buscarClima (evento) {
    evento.preventDefault();

    // Validar información que se le enviará a la API
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais === '') {

        // Hubo error
        mostrarError('Ambos campos son obligatorios');

        return;
    }

    // Consultar la API
    consultarAPI(ciudad, pais);

}


function mostrarError(mensaje){

    const alerta = document.querySelector('.bg-red-100');

    if(!alerta) {

        // Crear alerta
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 
            'max-w-md', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML = `
            <strong class='font-bold'>Error!</strong>
            <span class="block">${mensaje}</span>
        `;

        container.appendChild(alerta)
        
        // Se elimina la alerta despues de 5 segundos

        setTimeout(() => {
            alerta.remove()
        }, 5000);
    }
}


function consultarAPI(ciudad, pais) {
     
    const appID = "912eec04318a1973dffe820a77acfb3a";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;

    // Muestra un spinner de carga
    Spinner();

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( datos => {
            console.log(datos);
            
            // Limpiar el HTML previo
            limpiarHTML();

            if(datos.cod === "404"){
                mostrarError('Ciudad no encontrada');
                return;
            }
            
            
            
            // Imprime la respuesta en el HTML
            mostrarClima(datos)

        })

}


function mostrarClima(datos) {

    const { name, main: { temp, temp_max, temp_min } } = datos;

    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('text-2xl');

    const temperaturaActual = document.createElement('p');
    temperaturaActual.innerHTML = `${centigrados} &#8451`; // &#8451 -> Entidad de JS para grados centigrados
    temperaturaActual.classList.add('font-bold', 'text-6xl');

    const temperaturaMaxima = document.createElement('p');
    temperaturaMaxima.innerHTML = `Máxima: ${max} &#8451`;
    temperaturaMaxima.classList.add('text-xl');

    const temperaturaMinima = document.createElement('p');
    temperaturaMinima.innerHTML = `Mínima: ${min} &#8451`;
    temperaturaMinima.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(temperaturaActual);
    resultadoDiv.appendChild(temperaturaMaxima);
    resultadoDiv.appendChild(temperaturaMinima);

    resultado.appendChild(resultadoDiv);
}


const kelvinACentigrados = grados => parseInt(grados - 273.15)


function limpiarHTML(){
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}


function Spinner() {

    limpiarHTML();

    const spinnerDiv = document.createElement('div');
    spinnerDiv.classList.add('sk-fading-circle');
    spinnerDiv.innerHTML = `
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    `;

    resultado.appendChild(spinnerDiv);
}