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

    $('#modal').on('hidden.bs.modal', () => {
        let img = $("#foto_pro")[0];
        let nombre = $("#nombreFoto")[0];
        img.src = "../img/none.jpg";
        nombre.innerText = "Seleccione la foto";
    });

    CKEDITOR.replace("Editor1");

    $("#proveedores")[0].innerHTML = "";
    let cont = '<div class="scrollmenu p-1">'
    for (let i = 0; i < 10; i++) cont += `<input name="ps" type="button" class="btn btn-secondary ml-3" value="proveedor ${(i+1)}">`;
    cont += "</div>"
    $("#proveedores")[0].innerHTML = cont;

    $('input[name="ps"]').click(e => {
        if (e.target.className.includes('secondary'))
            e.target.className = 'btn btn-success ml-3';
        else
            e.target.className = 'btn btn-secondary ml-3';
    });



});