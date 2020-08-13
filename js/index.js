//Arreglo de las cuatro sugerencias.
const sugerencias = ["HTML", "CSS", "Javascript", "Developer"];

//Funciones que se cargan al entrar a la página.
renderHashtagsSearched();
mostrarSugerencias();
mostrarTendencias();
armarSugerenciasHoy();

/**
 * Sugerencias del día de hoy.
 */
async function mostrarSugerencias() {
    let promesasSugerencias = Promise.all([
        getSearchResults(sugerencias[0]),
        getSearchResults(sugerencias[1]),
        getSearchResults(sugerencias[2]),
        getSearchResults(sugerencias[3])
    ]);
    promesasSugerencias.then(objects => {
        let sugerenciasElements = document.getElementsByClassName("sugerenciasGifs");
        for (let i = 0; i < objects.length; i++)
            sugerenciasElements[i].style.backgroundImage = "url(" + objects[i].data[0].images.downsized.url + ")";

    });
}

/**
 * Busca en la API los gifs de tendencias y los agrega al DOM.
 */
async function mostrarTendencias() {
    let trendingSearched = await getTrending().then(objectData => objectData.data);
    document.getElementById('cuadroPrincipal').innerHTML = "(tendencias)";
    agregarGifs(trendingSearched, 'busqueda');
}

/**
 * Busca en la API los gifs relacionados a la búsqueda y los agrega al DOM.
 * @param {*} search Búsqueda a realizar.
 * @param {*} id ID del elemento.
 */
async function getButton(search, id) {
    addHashtagLocalStorage(search);
    let dataSearched = await getSearchResults(search).then(objectData => objectData.data);
    let cuadroPrincipal = document.getElementById('cuadroPrincipal');
    cuadroPrincipal.innerHTML = search + " (resultados)";
    let busquedaSugerencia = document.getElementsByClassName('busquedasPadre')[0];
    busquedaSugerencia.style.display = "none";
    cuadroPrincipal.scrollIntoView();
    agregarGifs(dataSearched, id);
}

/**
 * Agrega al Local Storage el hashtag pasado por parámetro.
 * @param {*} hashtag búsqueda que se va a agregar.
 */

function addHashtagLocalStorage(hashtag) {
    let items = localStorage.getItem("hashtags");
    let arr = [hashtag];
    if (items) {
        arr = items.split(",");
        if (!items.includes(hashtag))
            arr.push(hashtag);
    }
    localStorage.setItem("hashtags", arr.toString());
    renderHashtagsSearched();
}

/**
 * Agrega los botones con los hashtag de la búsqueda.
 */
function renderHashtagsSearched() {
    let searchedElement = document.getElementsByClassName("searchedGifs")[0];
    const items = localStorage.getItem("hashtags");
    if (items) {
        const arr = items.split(',');
        searchedElement.innerHTML = "";
        for (hashtag of arr) {
            let newElement = document.createElement("button");
            newElement.classList.add("button-blue", "searched__button--margin");
            let hashtagCopy = hashtag;
            newElement.addEventListener("click", () => getButton(hashtagCopy, "busqueda"));
            newElement.innerHTML = "#" + hashtag;
            searchedElement.appendChild(newElement);
        }
    }
}

/**
 * Agrega cada gif del arreglo de gifs al elemento especificado por su ID.
 * @param {*} gifsObjects Objetos a agregar al elemento.
 * @param {*} idElemento ID del elemento.
 */
function agregarGifs(gifsObjects, idElemento) {
    let guifsElement = document.getElementById(idElemento);
    guifsElement.querySelectorAll('*').forEach(n => n.remove());
    for (let i = 0; i < gifsObjects.length; i++) {
        let createdElement = document.createElement("div");
        createdElement.classList.add("guif4");
        createdElement.style.backgroundImage = "url(" + gifsObjects[i].images.downsized.url + ")";
        //Se crea un Div y se le agrega las clases nombradas, para que aparezca arriba de los gif de las sugerencias y debajo de las tendencias.
        let createdTagTitle = document.createElement("div");
        createdTagTitle.classList.add("hashtag", "canNight", "hidden");
        createdTagTitle.style.margin = 0;
        createdTagTitle.innerHTML = "#" + gifsObjects[i].title;
        //Se le agrega un mouseleave al Div creado con la clase hidden.
        createdElement.addEventListener("mouseleave", () => createdTagTitle.classList.add("hidden"));
        createdElement.addEventListener("mouseenter", () => createdTagTitle.classList.remove("hidden"));
        createdElement.appendChild(createdTagTitle);
        guifsElement.appendChild(createdElement);
    }
}

/**
 * Realiza el dropdown para la selección de estilos de la página.
 */
function buttonDropDown() {
    let estilo = document.getElementById('dropdown-content').style;
    if (estilo.display == "block")
        estilo.display = "none";
    else
        estilo.display = "block";
}

//Se fija si el botón que apretaste el es Enter y realiza la función.
document.getElementById('campoBusqueda').addEventListener('keyup', event => {
    if (event.keyCode == 13)
        getButton(document.getElementById('campoBusqueda').value, 'busqueda');
});

//Elimina y agrega diseño de CSS con respecto a las clases en el HTML.
document.getElementById('campoBusqueda').addEventListener('input', event => {
    let elementoLupa = document.getElementById('lupa');
    let elementoPalabra = document.getElementById('buscarLupa');
    let elementoBuscar = document.getElementById('botonBuscar');
    let sugerenciasPadre = document.getElementsByClassName('busquedasPadre')[0];
    if (event.target.value !== "") {
        elementoLupa.classList.add("lupaHabilitada");
        elementoLupa.classList.remove("lupaDeshabilitada");
        elementoPalabra.classList.add("buscarLupaHabilitada");
        elementoPalabra.classList.remove("buscarLupaDeshabilitada");
        elementoBuscar.classList.add("buscarHabilitado");
        elementoBuscar.classList.remove("buscarDeshabilitado");
        elementoBuscar.disabled = false;
        sugerenciasPadre.style.display = "block";
        completarSugerencias(event.target.value);
    } else {
        elementoLupa.classList.add("lupaDeshabilitada");
        elementoLupa.classList.remove("lupaHabilitada");
        elementoPalabra.classList.add("buscarLupaDeshabilitada");
        elementoPalabra.classList.remove("buscarLupaHabilitada");
        elementoBuscar.classList.add("buscarDeshabilitado");
        elementoBuscar.classList.remove("buscarHabilitado");
        elementoBuscar.disabled = true;
        sugerenciasPadre.style.display = "none"
    }
});

/**
 * Arma las palabras de las sugerencias y después les asigna el listener a cada botón de "ver más".
 */
function armarSugerenciasHoy() {
    const sugerenciasGifsDOM = document.getElementsByClassName("sugerenciasGifs");
    const sugerenciasHashtag = document.getElementsByClassName("hashtag");

    for (let i = 0; i < sugerenciasHashtag.length; i++) {
        if (sugerencias[i]) {
            sugerenciasHashtag[i].innerHTML = "#" + sugerencias[i] + sugerenciasHashtag[i].innerHTML;
        }
    }
    for (let i = 0; i < sugerenciasGifsDOM.length; i++) {
        if (sugerencias[i]) {
            const elementVerMas = sugerenciasGifsDOM[i].getElementsByClassName("verMas")[0];
            elementVerMas.addEventListener("click", () => getButton(sugerencias[i], "busqueda"));
        }
    }
}

/**
 * Muestra las suguerencias de la búsqueda que se está haciendo.
 * @param {*} palabraActual palabra que se está buscando.
 */
async function completarSugerencias(palabraActual) {
    //Obtengo todos los botones que tienen la clase informacion.
    let sugerenciasTag = document.getElementsByClassName("informacion");
    //Obtengo todas las sugerencias de la palabra actual que estoy buscando.
    let sugerenciasApi = await getSuggestions(palabraActual).then(obj => obj.data);

    //Voy a recorrer el arrelgo de botones con el forof para asignarle cada sugerencia de la API.
    let sugerenciasApiIndex = 0;
    for (sugerencia of sugerenciasTag) {
        if (sugerenciasApi[sugerenciasApiIndex])
            sugerencia.innerHTML = sugerenciasApi[sugerenciasApiIndex].name;
        sugerenciasApiIndex++;
    }
}

/**
 * Cambia el estilo de la página.
 * @param {*} night si es verdadero entonces el estilo es night, de lo contrario es el estilo por default.
 */
function colorFondo(night) {
    buttonDropDown();
    let elementsToModify = document.getElementsByClassName('canNight');
    for (actualElement of elementsToModify) {
        if (night)
            actualElement.classList.add('night');
        else
            actualElement.classList.remove('night');
    }
}

/**
 * Oculta los cuadros que ya no se deben mostrar e inicializa los gifs que se encuentran en el Local Storage.
 */
function misGuifos() {
    let searchBox = document.getElementsByClassName('buscar1')[0];
    let allSuggestions = document.getElementsByClassName('sugerenciasGifs');
    let trendChart = document.getElementById('cuadroPrincipal');
    let suggestionsGifs = document.getElementsByClassName('guif4');
    let myGifs = document.getElementById('misGifs');
    let hoySugerimos = document.getElementById('hoySugerimos');
    let i;
    let n;

    searchBox.style.display = "none";
    trendChart.style.display = "none";
    hoySugerimos.style.display = "none";
    myGifs.style.display = "block";

    for (i = 0; i < allSuggestions.length; i++) {
        allSuggestions[i].style.display = "none";
    }

    for (n = 0; n < suggestionsGifs.length; n++) {
        suggestionsGifs[n].style.display = "none";
    }
    initMyGifs();
}