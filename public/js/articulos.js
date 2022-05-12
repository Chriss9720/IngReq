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
        img.src = "../../img/none.jpg";
        nombre.innerText = "Seleccione la foto";
    });


});