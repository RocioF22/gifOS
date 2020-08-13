//Variables globales.
let recording = false;
let recorder;
let video = document.getElementById("recording"); //elemento video para ver lo que se esta grabando.
let preview = document.getElementById("uploadedGIF");
let recordButton = document.getElementById("recordButton");
let detener = document.getElementsByClassName('detener')[0];
var inicio = 0;
var timeout = 0;
let containerGlobe = document.getElementsByClassName('containerGlobe')[0];
let text = document.getElementsByClassName('text')[0];
let repetirCaptura = document.getElementById('repetirCaptura');
let reloj = document.getElementById('reloj');
let botonSubir = document.getElementById('botonSubir');
let botonCancelar = document.getElementById('botonCancelar');
let capturaFoto = document.getElementById('capturaFoto');
let barraProgreso = document.getElementsByClassName('barraProgreso')[0];
let repetirSubir = document.getElementsByClassName('repetirSubir')[0];
let primerCuadro = document.getElementById('primerCuadro');
let segundoCuadro = document.getElementById('nuevoGif');
let ultimoCuadro = document.getElementById('ultimoCuadro');
let gifCreadoContainer = document.getElementById('gifCreadoContainer');
let controller;
let signal;
let resultGif;
let resultURL;
let foto = document.getElementsByClassName('foto')[0];
let tiempo = document.getElementsByClassName('cronoWrapper')[0];
let botones = document.getElementsByClassName('fotoCaptura')[0];

//Llama a dicha función para que se muestre la sección de los gifs creados. 
initMyGifs();

/**
 * Comienza y termina la grabación del gif.
 */
async function captureGIF() {
    if (recording) {// si se esta grabando se detiene la grabación.
        resultGif = await stopRecording();
        clearTimeout(timeout);
        timeout = 0;
        //Utilizando estilos de CSS esconde elementos que no se deben mostrar y agrega otros.
        barraProgreso.style.display = "flex";
        repetirCaptura.style.display = "block";
        botonSubir.style.display = "block";
        repetirSubir.style.display = "flex"
        video.style.display = 'none';
        preview.style.display = 'block';
        preview.src = URL.createObjectURL(resultGif);
    }
    else { // si no se esta grabando se inicia la grabación.
        startRecord();
    }
}

/**
 * Realiza la grabación del gif.
 */
async function startRecord() {
    var stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });

    video.style.display = 'block';
    preview.style.display = 'none';
    recorder = new RecordRTCPromisesHandler(stream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        onGifRecordingStarted: function () {
            inicio = new Date().getTime();
            funcionando();
        },
    });
    recorder.startRecording();

    recording = true; //se cambia a true para indicar que se esta grabando.  
    recordButton.classList.add('recording');
    recordButton.innerHTML = "Listo";
    video.srcObject = stream;
    video.play();

    //Se hacen modificaciones para cambiar los estilos del cuadro que se debe ver.
    text.innerHTML = "Capturando Tu Guifo";
    foto.style.display = "none";
    detener.style.display = "block"
    recordButton.style.backgroundColor = "#FF6161";
    recordButton.style.color = "white";
    recordButton.style.boxShadow = "inset -1px -1px 0 0 #997D97, inset 1px 1px 0 0 #FFFFFF";
    tiempo.style.display = "flex";
    botones.style.justifyContent = "space-between";
}

/**
 * Finaliza la grabación y espera obtener el archivo blob para luego retornarlo.
 */
async function stopRecording() {
    detener.style.display = "none";
    recordButton.style.display = "none";
    recorder.stopRecording();
    recording = false;
    video.pause();
    text.innerHTML = "Vista Previa";

    let blob = await recorder.getBlob();

    recorder.destroy();
    return blob;
}

/**
 * Funcionalidad del cronómetro.
 */
function funcionando() {

    let actual = new Date().getTime();
    let diff = new Date(actual - inicio);
    let result = LeadingZero(diff.getUTCHours()) + ":" + LeadingZero(diff.getUTCMinutes()) + ":" + LeadingZero(diff.getUTCSeconds());

    document.getElementById('crono').innerHTML = result;
    timeout = setTimeout("funcionando()", 1000);
}

function LeadingZero(Time) {
    return (Time < 10) ? "0" + Time : + Time;
}

/**
 * Sube los gifs y los guarda en la sección de "Mis Guifos".
 */
async function subirGuifo() {
    text.innerHTML = "Subiendo Guifo";
    preview.style.display = "none";
    containerGlobe.style.display = "flex";
    repetirCaptura.style.display = "none";
    reloj.style.display = "none";
    botonSubir.style.display = "none";
    botonCancelar.style.display = "flex";
    botonCancelar.style.justifyContent = "center";
    capturaFoto.style.justifyContent = "flex-end";
    barraProgreso.style.display = "none";
    ultimoCuadro.style.display = "none";

    //Genera un nuevo controlador para un posible aborto del gif que se está grabando.
    controller = new AbortController();
    signal = controller.signal;
    
    let idResult = await uploadGIF(resultGif, signal); // se carga el GIF grabado.

    if (idResult) {
        let uploadedGIFData = await getGifForId(idResult);
        resultURL = uploadedGIFData.data.images.downsized.url;
        gifCreadoContainer.style.backgroundImage = "url(" + resultURL + ")";
        gifCreadoContainer.style.backgroundSize = "365px 191px";
        localStorage.setItem("gif " + idResult, resultURL);
        segundoCuadro.style.display = "none";
        ultimoCuadro.style.display = "block";

        initMyGifs();
    } else {
        console.log("hubo un error al grabar");
    }
}

/**
 * Función para el botón del primer cuadro, que lo lleva al segundo, ocultando los demás.
 */
function comenzar() {
    primerCuadro.style.display = "none";
    segundoCuadro.style.display = "block";
    reset();
}

/**
 * Realiza cambios para la funcion comenzar().
 */
function reset() {
    text.innerHTML = "Un Chequeo Antes de Empezar";
    preview.style.display = "none";
    containerGlobe.style.display = "none";
    repetirCaptura.style.display = "none";
    reloj.style.display = "none";
    botonSubir.style.display = "none";
    botonCancelar.style.display = "none";
    barraProgreso.style.display = "none";
    recordButton.style.display = "block";
    recordButton.innerHTML = "Capturar";
    recordButton.style.backgroundColor = "#F7C9F3";
    recordButton.style.color = "black";
    recordButton.classList.remove('recording');
    foto.style.display = "block";
}

/**
 * Función para los botones de 'Cancelar' y las imagenes de las 'x'.
 */
function cancelar() {
    primerCuadro.style.display = "block";
    segundoCuadro.style.display = "none";
    ultimoCuadro.style.display = "none";
}

/**
 * Copia el link del gif creado.
 */
function getlink() {
    let css = document.getElementById('aviso');

    css.style.display = "block";

    var aux = document.createElement("input");

    aux.setAttribute("value", resultURL.split("?")[0].split("#")[0]);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);


    var contenido = document.createTextNode("URL copiada");

    css.appendChild(contenido);
    document.body.appendChild(css);
    window.load = setTimeout("document.body.removeChild(aviso)", 2000);
}

/**
 * Descarga el gif creado.
 */
function descargar() {
    invokeSaveAsDialog(resultGif);
}

/**
 * Detiene y cancela la carga del gif creado.
 */
function abortUpload() {
    cancelar();
    controller.abort();
}

/**
 * Función para el botón de repetir captura, esconde los cuadros que no deben verse.
 */
function repetirCapturaBoton() {
    segundoCuadro.style.display = "none";
    primerCuadro.style.display = "block";
}