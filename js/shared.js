/**
 * Obtiene los gifs que se crearon del Local Storage y los muestra.
 */
function initMyGifs() {
    let myGifsElement = document.getElementsByClassName("searchedGifs")[0];
    myGifsElement.innerHTML = "";
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.startsWith('gif')) {
            let newElementGif = document.createElement("div");
            newElementGif.classList.add("guif4");
            newElementGif.style.backgroundImage = "url(" + localStorage.getItem(key) + ")";
            myGifsElement.appendChild(newElementGif);
        }
    }
}