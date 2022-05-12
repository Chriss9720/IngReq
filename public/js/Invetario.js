$(document).ready(() => {

    $('[name="modificar_1"]').click(() => {
        $("#modal").modal();
    });

    $("#foto").change(() => {
        let archivo = $("#foto")[0].files[0];
        let reader = new FileReader();
        let img = $("#foto_pro")[0];
        let nombre = $("#nombreFoto")[0];
        if (archivo) {
            nombre.innerText = archivo.name;
            reader.readAsDataURL(archivo);
            reader.onloadend = () => img.src = reader.result;
        }
    });

    const ayuda = text => $("#ayuda").html(text);

    $("li[name='menu']").mousemove(evt => {
        let text = evt.target.childNodes[1];
        if (text) {
            text = text.innerText;
            ayuda(`Cambio a la vista de <b>${text}</b>`);
        }
    });

    $("#tabla").mousemove(evt => {
        if (evt.target.nodeName == 'DIV')
            ayuda(`Tabla de <b>articulos</b>`)
    });

    $("#articuloNombre").mousemove(evt => ayuda(`Filtro por el <b>Nombre</b> del <b>articulo</b>`));

    $("#ver").mousemove(evt => ayuda(`Ver detalles del <b>articulo</b>`));

    $("#editar").mousemove(evt => ayuda(`Editar el <b>articulo</b>`));

});