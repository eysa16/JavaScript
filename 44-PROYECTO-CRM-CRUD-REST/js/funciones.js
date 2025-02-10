export function mostrarAlertaNegativa(mensaje) {

    const alerta = document.querySelector('.bg-red-100');

    if(!alerta) {

        const alerta = document.createElement('P');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;

        const formulario = document.querySelector('#formulario');
        formulario.appendChild(alerta)

        setTimeout(() => {
            alerta.remove();
        }, 3000);

    }
}

export function mostrarAlertaPositiva(mensaje) {

    const alerta = document.querySelector('.bg-green-100');

    if(!alerta) {

        const alerta = document.createElement('P');
        alerta.classList.add('bg-green-100', 'border-green-400', 'text-green-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
            <strong class="font-bold">Correcto!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;

        const formulario = document.querySelector('#formulario');
        formulario.appendChild(alerta)

        setTimeout(() => {
            alerta.remove();
        }, 3000);

    }
}

export function validar(objeto) {
    return !Object.values(objeto).every( input => input !== '');
}