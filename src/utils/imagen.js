const TAMANIO_MAXIMO = 5 * 1024 * 1024; // 5 MB
const LADO_MAXIMO = 700;

function leerArchivo(archivo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onload = () => resolve(lector.result);
        lector.onerror = () => reject(new Error("No se pudo leer la imagen."));
        lector.readAsDataURL(archivo);
    });
}

function cargarImagen(dataUrl) {
    return new Promise((resolve, reject) => {
        const imagen = new Image();
        imagen.onload = () => resolve(imagen);
        imagen.onerror = () => reject(new Error("El archivo no es una imagen válida."));
        imagen.src = dataUrl;
    });
}

/**
 * Convierte una imagen a un data URL liviano para poder guardarla en localStorage.
 * Mantiene la proporción original y limita el lado mayor a 700px.
 */
export async function procesarImagen(archivo) {
    if (!archivo.type.startsWith("image/")) {
        throw new Error("Seleccioná un archivo de imagen (JPG, PNG o WebP).");
    }

    if (archivo.size > TAMANIO_MAXIMO) {
        throw new Error("La imagen no puede superar los 5 MB.");
    }

    const dataUrl = await leerArchivo(archivo);
    const imagen = await cargarImagen(dataUrl);

    const escala = Math.min(1, LADO_MAXIMO / Math.max(imagen.width, imagen.height));
    const ancho = Math.round(imagen.width * escala);
    const alto = Math.round(imagen.height * escala);

    const canvas = document.createElement("canvas");
    canvas.width = ancho;
    canvas.height = alto;

    const contexto = canvas.getContext("2d");
    contexto.fillStyle = "#111111";
    contexto.fillRect(0, 0, ancho, alto);
    contexto.drawImage(imagen, 0, 0, ancho, alto);

    return canvas.toDataURL("image/jpeg", 0.82);
}
