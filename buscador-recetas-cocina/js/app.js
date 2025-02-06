document.addEventListener('DOMContentLoaded', iniciarApp);


function iniciarApp() {

    const selectCategoria = document.querySelector('#categorias');
    const resultado = document.querySelector('#resultado');

    if(selectCategoria){
        selectCategoria.addEventListener('change', seleccionarCategoria);
        obtenerCategorias();
    }

    const favoritosDiv = document.querySelector('.favoritos');
    if(favoritosDiv){
        obtenerFavoritos();
    }

    const modal = new bootstrap.Modal('#modal', {});

    // Obtener las categorías de alimentos desde la API
    function obtenerCategorias() {
        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';

        fetch(url)
            .then( respuesta => respuesta.json())
            .then( resultado => mostrarCategorias(resultado.categories))
    }

    function mostrarCategorias(categorias = []) {

        categorias.forEach( categoria => {

            const { strCategory } = categoria
            const option = document.createElement('OPTION');
            option.value = strCategory;
            option.textContent = strCategory;
            selectCategoria.appendChild(option);

        })
    }

    function seleccionarCategoria(evento) {

        const categoria = evento.target.value;
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`
        
        fetch(url)
            .then( respuesta => respuesta.json())
            .then( resultado => mostrarRecetas(resultado.meals))
    }

    function mostrarRecetas(recetas = []){

        limpiarHTML(resultado);

        const heading = document.createElement('H2')
        heading.classList.add('text-center', 'text-black', 'my-5');
        heading.textContent = recetas.length ? 'Resultados' : 'No hay resultados';
        resultado.appendChild(heading);

        // Iterar sobre los resultados
        recetas.forEach( receta => {

            const { idMeal, strMeal, strMealThumb } = receta

            const recetaContenedor = document.createElement('DIV');
            recetaContenedor.classList.add('col-md-4');

            const recetaCard = document.createElement('DIV');
            recetaCard.classList.add('card', 'mb-4');

            const recetaImagen = document.createElement('IMG');
            recetaImagen.classList.add('card-img-top');
            recetaImagen.alt = `Imagen de la receta ${strMeal ?? receta.platillo}`;
            recetaImagen.src = strMealThumb ?? receta.imagen;

            const recetaCardBody = document.createElement('DIV');
            recetaCardBody.classList.add('card-body');

            const recetaHeading = document.createElement('H3');
            recetaHeading.classList.add('card-title', 'mb-3');
            recetaHeading.textContent = strMeal ?? receta.platillo;

            const recetaButton = document.createElement('BUTTON');
            recetaButton.classList.add('btn', 'btn-danger', 'w-100')
            recetaButton.textContent = 'Ver receta';

            recetaButton.onclick = function () {
                seleccionarReceta(idMeal ?? receta.id);
            }

            // Inyectar en HTML el scripting generado
            // card
            //      img
            //      body
            //          h3
            //          button

            recetaCardBody.appendChild(recetaHeading);
            recetaCardBody.appendChild(recetaButton);

            recetaCard.appendChild(recetaImagen);
            recetaCard.appendChild(recetaCardBody);

            recetaContenedor.appendChild(recetaCard);

            resultado.appendChild(recetaContenedor);
        })

    }

    function seleccionarReceta(id) {
        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
        fetch(url)
            .then( respuesta => respuesta.json())
            .then( resultado => mostrarRecetaModal(resultado.meals[0]))
    }

    function mostrarRecetaModal( receta ) {

        const { idMeal, strInstructions, strMeal, strMealThumb } = receta;

        // A;adir contenido al mdoal
        const modalTitle = document.querySelector('.modal .modal-title');
        const modalBody = document.querySelector('.modal .modal-body');
        
        modalTitle.textContent = strMeal;
        modalBody.innerHTML = `
            <img class="img=fluid" src="${strMealThumb}" alt="Receta ${strMeal}"></>
            <h3 class="my-3">Instrucciones</h3>
            <p>${strInstructions}</p>
            <h3 class="my-3">Ingredientes y Cantidades</h3>
        `;

        // Mostrar ingredientes y cantidades
        const listGroup = document.createElement('UL');
        listGroup.classList.add('list-group');

        for( let i = 1; i <= 20; i++ ) {

            if(receta[`strIngredient${i}`] !== "") {
                const ingredienteLi = document.createElement('LI');
                ingredienteLi.classList.add('list-group-item');

                const ingrediente = receta[`strIngredient${i}`];
                const cantidad = receta[`strMeasure${i}`];

                ingredienteLi.textContent = `${ingrediente} - ${cantidad}`;

                listGroup.appendChild(ingredienteLi);

            }
        }

        modalBody.appendChild(listGroup);

        // Botones de Cerrar y Guardar Favoritos
        const modalFooter = document.querySelector('.modal-footer');

        // Limpiar los botones del HTML
        limpiarHTML(modalFooter)

        const btnFavorito = document.createElement('BUTTON');
        btnFavorito.classList.add('btn', 'btn-danger', 'col');
        btnFavorito.textContent = existeStorage(idMeal) ? 'Eliminar Favorito' : 'Guardar Favorito';

        // LocalStorage para favoritos
        btnFavorito.onclick = function () {

            if(existeStorage(idMeal)) {
                eliminarFavorito(idMeal);
                btnFavorito.textContent = 'Guardar Favoritos';
                mostrarToast('Eliminado correctamente')
                return
            }

            agregarFavorito({
                id: idMeal,
                platillo: strMeal,
                imagen: strMealThumb
            })
            btnFavorito.textContent = 'Eliminar Favoritos';
            mostrarToast('Agregado correctamente');
        }


        const btnCerrar = document.createElement('BUTTON');
        btnCerrar.classList.add('btn', 'btn-secondary', 'col');
        btnCerrar.textContent = 'Cerrar';

        // Ocultar Modal
        btnCerrar.onclick = function () {
            modal.hide()
        }

        modalFooter.appendChild(btnFavorito);
        modalFooter.appendChild(btnCerrar);

        // Muestra el modal
        modal.show();

    }

    function agregarFavorito (receta) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        localStorage.setItem('favoritos', JSON.stringify([...favoritos, receta]))
    }

    function eliminarFavorito(id) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        const nuevosFavoritos = favoritos.filter( favorito => favorito.id !== id);
        localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
    }

    function existeStorage (id) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        return favoritos.some( favorito => favorito.id === id)
    }

    function mostrarToast(mensaje) {
        const toastDiv = document.querySelector('#toast');
        const toastBody = document.querySelector('.toast-body');
        const toast = new bootstrap.Toast(toastDiv);
        toastBody.textContent = mensaje;
        toast.show();
    }

    function obtenerFavoritos() {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        
        if(favoritos.length) {
            mostrarRecetas(favoritos);
            return
        }
        
        const noFavoritos = document.createElement('P');
        noFavoritos.classList.add('fs-4', 'text-center', 'font-bold', 'mt-5');
        noFavoritos.textContent = 'No hay favoritos aún';
        favoritosDiv.appendChild(noFavoritos);
    }

    function limpiarHTML(selector) {
        while(selector.firstChild){
            selector.removeChild(selector.firstChild);
        }
    }


}