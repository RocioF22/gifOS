//API KEY.
const apiKey = '9WDjm4BvVgeuCLcJN9p1zybiMk3vBDSC';

/**
 * Retorna los gifs trendings.
 */
function getTrending() {
    const found = fetch('http://api.giphy.com/v1/gifs/trending?api_key=' + apiKey)
        .then(response => response.json())
        .then(data => data)
        .catch(error => error)
    return found;
}

/**
 * Retorna los gifs relacionados a la búsqueda.
 * @param {*} search búsqueda.
 */
function getSearchResults(search) {
    const found = fetch('http://api.giphy.com/v1/gifs/search?q=' + search + '&api_key=' + apiKey)
        .then(response => response.json())
        .then(data => data)
        .catch(error => error)
    return found;
}

/**
 * Retorna en un arreglo con los tags relacionados a la cadena que se ingresa por parámetro.
 * @param {*} cadenaActual cadena que se está escribiendo.
 */
function getSuggestions(cadenaActual) {
    const found = fetch('http://api.giphy.com/v1/tags/related/' + cadenaActual + "?api_key=" + apiKey)
        .then(response => response.json())
        .then(obj => obj)
        .catch(error => error)
    return found;
}

async function uploadGIF(recordedGIF, signal) {
    let form = new FormData();
    form.append("file", recordedGIF, 'example.gif');
    const objectToPost = { method: 'POST', body: form };
    if (signal) {
        objectToPost.signal = signal;
    }
    let result = await fetch('https://upload.giphy.com/v1/gifs?api_key=' + apiKey, objectToPost);
    if (result.status == 200) {
        let parsedResult = await result.json();
        let gifId = parsedResult.data.id;
        return gifId;
    }
    else {
        return false;
    }
}

/**
 * Retorna el gif correspondiente al id proporcionado en el parámetro.
 * @param {*} gifId El id del gif que se está buscando.
 */
function getGifForId(gifId) {
    const found = fetch('http://api.giphy.com/v1/gifs/' + gifId + '?api_key=' + apiKey)
        .then(response => response.json())
        .then(data => data)
        .catch(error => error)
    return found;
}
