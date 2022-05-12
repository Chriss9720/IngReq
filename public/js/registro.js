$(document).ready(() => {

    const valida = datos => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/validar/registro',
                type: 'post',
                data: datos,
                success: s => resolve(s),
                error: e => reject(e)
            });
        });
    };

    const registra = datos => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/api/registro/Usuario',
                type: 'POST',
                data: datos,
                success: s => resolve(s),
                error: e => reject(e)
            })
        })
    }

    $("#ojoVendedor").click(evt => {
        let ojo = evt.target;
        let clave = $("#clave")[0];
        if (clave.type.includes("password")) {
            clave.type = "text";
            ojo.className = "fas fa-eye-slash";
        } else {
            clave.type = "password";
            ojo.className = "fas fa-eye";
        }
    });

    const mostrarAlerta = (msg, tip) => {
        let campos = $("[name='alerta']");
        for (let i = 0; i < campos.length; i++) {
            campos[i].innerHTML = `
                <div class="alert alert-${tip} alert-dismissible fade show text-center" role="alert">
                    <strong>${msg}</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `;
        }
    };

    const ocultarAlerta = () => {
        let campos = $("[name='alerta']");
        for (let i = 0; i < campos.length; i++) {
            campos[i].innerHTML = ``;
        }
    };

    $("#registroFormulario").submit(sub => {
        sub.preventDefault();
        ocultarAlerta();
        let data = {
            nombre: $("#nombre").val(),
            email: $("#email").val(),
            clave: $("#clave").val(),
            telefono: $("#telefono").val(),
            curp: $("#curp").val(),
            direccion: $("#direccion").val()
        };
        valida(data)
            .then(s => {
                let valid = true;
                Object.keys(s).forEach(k => {
                    let campo = $(`#${s[k].id}`)[0];
                    valid = valid && !s[k].s;
                    if (s[k].s) {
                        if (campo.className.includes("is-valid")) {
                            campo.className = campo.className.replace(" is-valid", " is-invalid");
                        } else if (!campo.className.includes("is-invalid")) {
                            campo.className += " is-invalid";
                        }
                        $(`#${k}`).html(s[k].msg);
                    } else {
                        if (campo.className.includes("is-invalid")) {
                            campo.className = campo.className.replace(" is-invalid", " is-valid");
                        } else if (!campo.className.includes("is-valid")) {
                            campo.className += " is-valid";
                        }
                    }
                });
                if (valid) {
                    registra(data)
                        .then(r => {
                            mostrarAlerta(r.msj, "success");
                            $("#registroFormulario")[0].reset();
                            Object.keys(s).forEach(k => {
                                let campo = $(`#${s[k].id}`)[0];
                                if (campo.className.includes("is-valid")) {
                                    campo.className = campo.className.replace(" is-valid", "");
                                } else if (campo.className.includes("is-invalid")) {
                                    campo.className = campo.className.replace(" is-invalid", "");
                                }
                            });
                        })
                        .catch(e => {
                            mostrarAlerta(e.responseJSON.error, "danger");
                        })
                }
            })
            .catch(e => {
                console.log(e)
            })
    });

});