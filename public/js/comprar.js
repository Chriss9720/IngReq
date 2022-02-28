$(document).ready(() => {

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

    $('button[name="comprar_1"]').click(() => {
        $("#modal_comprar").modal();
    });

    $('button[name="ver_1"]').click(() => {
        $("#modal_ver").modal();
    })

});