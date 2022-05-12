$(document).ready(() => {

    const mostrarAlerta = (msg, tipo, id) => {
        $(`#${id}`).html(`
            <div class="alert alert-${tipo} alert-dismissible fade show text-center" role="alert">
                <strong>${msg}</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `);
    };

    const validarProveedores = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/validar/existeProveedores',
                type: 'POST',
                datatype: 'json',
                success: s => resolve(s),
                error: e => reject(e)
            })
        });
    };

    $("#registrarArt").click(() => {
        validarProveedores()
            .then(v => {
                console.log(v);
                $("#modal").modal();
            })
            .catch(e => {
                mostrarAlerta(e.responseJSON.msg, 'danger', 'alertaP');
            });
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