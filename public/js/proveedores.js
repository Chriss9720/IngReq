$(document).ready(() => {

    $('[name="adquirir"]').click(() => {
        $('#proveedor').modal();
    });

    const reset = v => {
        Object.keys(v).forEach(k => {
            let campo = $(`#${v[k].id}`)[0];
            if (campo.className.includes("is-valid")) {
                campo.className = campo.className.replace(" is-valid", "");
            } else if (campo.className.includes("is-invalid")) {
                campo.className = campo.className.replace(" is-invalid", "");
            }
        });
        $("#idP").val("");
        $("#nombreP").val("");
        $("#dirP").val("");
        $("#telP").val("");
        $("#rfcP").val("");
        $("#corP").val("");
        $("#codP").val("");
    };

    const validarDatos = data => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/validar/registroProveedores',
                dataType: 'json',
                data: data,
                type: 'POST',
                success: s => resolve(s),
                error: e => reject(e)
            });
        });
    };

    const registrarProveedor = data => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/api/registro/Proveedor',
                dataType: 'json',
                data: data,
                type: 'POST',
                success: s => resolve(s),
                error: e => reject(e)
            });
        });
    };

    const mostrarAlerta = (msg, tip, show = true) => {
        let campos = $("[name='errRP']");
        for (let i = 0; i < campos.length; i++) {
            campos[i].innerHTML = (show) ? `
                <div class="alert alert-${tip} alert-dismissible fade show text-center" role="alert">
                    <strong>${msg}</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            ` : '';
        }
    };

    $("#salvarProveedor").click(() => {
        mostrarAlerta('', '', false);
        let data = {
            idP: $("#idP").val(),
            nombreP: $("#nombreP").val(),
            dirP: $("#dirP").val(),
            telP: $("#telP").val(),
            rfcP: $("#rfcP").val(),
            corP: $("#corP").val(),
            codP: $("#codP").val()
        };
        validarDatos(data)
            .then(v => {
                let valid = true;
                Object.keys(v).forEach(k => {
                    let campo = $(`#${v[k].id}`)[0];
                    valid = valid && !v[k].s;
                    if (v[k].s) {
                        if (campo.className.includes("is-valid")) {
                            campo.className = campo.className.replace(" is-valid", " is-invalid");
                        } else if (!campo.className.includes("is-invalid")) {
                            campo.className += " is-invalid";
                        }
                        $(`#${k}`).html(v[k].msg);
                    } else {
                        if (campo.className.includes("is-invalid")) {
                            campo.className = campo.className.replace(" is-invalid", " is-valid");
                        } else if (!campo.className.includes("is-valid")) {
                            campo.className += " is-valid";
                        }
                    }
                });
                if (valid) {
                    registrarProveedor(data)
                        .then(rP => {
                            reset(v);
                            mostrarAlerta("registro exitoso", 'success');
                        })
                        .catch(c => {
                            console.log(c)
                            mostrarAlerta(c.responseJSON.msg, 'danger');
                        })
                }
            })
            .catch(e => {
                console.log(e);
            })
    });

});