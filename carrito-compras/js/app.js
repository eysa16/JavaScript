// VARIABLES

const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");
let articulosCarrito = [];

cargarEvenListeners();
function cargarEvenListeners(){
    // Cuando agregas un curso presionando "Agregar al carrito"
    listaCursos.addEventListener("click", agregarCurso);

    // Eliminar curso del carrito
    carrito.addEventListener('click', eliminarCurso);

    // Eliminar todo el carrito
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

    // Muestra los cursos de LocalStorage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('cursos')) || [];

        carritoHTML();
    })
}



// FUNCIONES

function agregarCurso(evt){
    evt.preventDefault();

    if(evt.target.classList.contains('agregar-carrito')){
        const cursoSeleccionado = evt.target.parentElement.parentElement; // Llendo a la clase "card" (se estaba en la clase agregar-carrito)
        //console.log(cursoSeleccionado);
        leerDatosCurso(cursoSeleccionado); 
    }
}

function eliminarCurso(evt){

    //console.log(evt.target.classList);  // Me permite conocer las clases de aquello a lo que le de click

    if(evt.target.classList.contains('borrar-curso')){

        const cursoId = evt.target.getAttribute('data-id');

        console.log(articulosCarrito);

        articulosCarrito.forEach( (cursoCarrito, index) => {
            if(cursoCarrito.id === cursoId){
                const cursoPrueba = cursoCarrito;
                if(cursoPrueba.cantidad === 1){
                    // Si queremos borrar un curso cuya cantidad es 1, se elimina completamente del carrito
                    articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId); // Solo guarda aquellos con 'id' diferente
                    return; 
               }else{
                    // Si la cantidad del curso que queremos eliminar es mayor a 1, esta disminuye de uno en uno, dependiendo de cuantos clic demos en boton rojo 
                    cursoPrueba.cantidad--;
                    articulosCarrito[index] = cursoPrueba;
                    // Alternativa al 'index' del forEach: const indice = articulosCarrito.indexOf(cursoPrueba);
                    // articulosCarrito[indice] = cursoPrueba;
                    return;
                }
            }
        });

        carritoHTML();

        console.log(articulosCarrito);
        
    }


}

function vaciarCarrito(evt){
    console.log(evt.target.classList);

    if(evt.target.classList.contains("button")){

        // Vaciamos al carrito
        articulosCarrito = [];
    }

    carritoHTML();
}

// Lee el contenido del HTML al que le dimos click y extrae la información del curso
function leerDatosCurso(cursoSeleccionado){
    // Crear un obejto con el contenido el curso actual
    const infoCurso = {
        imagen: cursoSeleccionado.querySelector("img").src,
        titulo: cursoSeleccionado.querySelector("h4").textContent,  // Tambien se podía mediante (".info-card h4")
        precio: cursoSeleccionado.querySelector(".precio span").textContent,
        id: cursoSeleccionado.querySelector("a").getAttribute("data-id"),
        cantidad: 1
    }

    //Revisa si un elemento existe dentro del carrito
    const existeCurso = articulosCarrito.some( cursoEnCarrito => cursoEnCarrito.id === infoCurso.id); // Iteramos los elementos del arreglo "articulosCarrito"

    if(existeCurso){
        // Actualizamos la cantidad
        const cursos = articulosCarrito.map( cursoEnCarrito => {  // map crea un nuevo arreglo
            if(cursoEnCarrito.id === infoCurso.id){
                cursoEnCarrito.cantidad++;
                return cursoEnCarrito; // Retorna el objeto actualizado
            }else{
                return cursoEnCarrito; // Retorna los objetos que no son los duplicados
            }
        })
        articulosCarrito = [...cursos];
    }else{
        // Agregamos el curso al carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    console.log(articulosCarrito);

    carritoHTML();
}


// Muestra el carrito de compras en el HTML
function carritoHTML(){

    // Limpiar el HTML
    limpiarHTML();

    // Recorrer el carrito y genera el HTML
    articulosCarrito.forEach( curso => {
        const {imagen,titulo,precio,cantidad,id} = curso;  // Aplicando destructuring para reducir código
        const row = document.createElement("tr");
        row.innerHTML =`
            <td> ${id} </td>
            <td>
                <img src = "${imagen}" width="100">
            </td>
            <td> ${titulo} </td>
            <td> ${precio} </td>
            <td> ${cantidad} </td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}"> X </a>
            </td>
        `
        // Agregar el HTML del carrito al tbody
        contenedorCarrito.appendChild(row);
    });

    // Guardado los articulos del carrito en localStorage
    localStorage.setItem('cursos', JSON.stringify(articulosCarrito));
}

// Elimina los cursos del tbody
function limpiarHTML(){
    // Forma lenta
    /* contenedorCarrito.innerHTML = ''; */

    // Forma rápida
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}


