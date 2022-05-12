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

    const validarCat = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/validar/existeCategorias',
                type: 'POST',
                datatype: 'json',
                success: s => resolve(s),
                error: e => reject(e)
            })
        });
    }

    $("#crearCupon").click(() => {
        validarCat()
            .then(cat => {
                console.log(cat);
                $("#ModalCat").modal();
            })
            .catch(c => {
                console.log(c);
                mostrarAlerta(c.responseJSON.msg, 'danger', 'crearC');
            })
    });

})