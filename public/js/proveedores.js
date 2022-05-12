$(document).ready(() => {

    let datos = [];

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

    const leer = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/leer/proveedores',
                type: 'POST',
                datatype: 'json',
                success: s => resolve(s),
                error: e => reject(e)
            });
        });
    };

    const evento = (evt, max) => {
        if (evt.target.nodeName == 'A' && !evt.target.children[0]) {
            return parseInt(evt.target.innerHTML);
        } else {
            let name = (evt.target.nodeName == 'A') ? evt.target.children[0].attributes.name.value : evt.target.attributes.name.value;
            return (name == 'Final') ? parseInt(max) : 1;
        }
    };

    const contenido = (pagina, i) => `
        <li class="page-item ${pagina == i ? 'active' : ''}">
            <a name="pagina" class="page-link click bg-input text-input ml-2 form-control text-center">${i}</a>
        </li>`;

    const pie = (pagina, max) => {
        let cuerpo = `
        <ul class="pagination justify-content-center">
            <li class="page-item ${pagina == 1 ? "disabled" : "click"}">
                <a name="pagina" class="page-link" aria-label="Previous">
                    <span name='Inicio' aria-hidden="true">&laquo;</span>
                </a>
            </li>`;
        let entro = max > 0;
        if (max <= 5) {
            for (let i = 1; i <= max; i++) cuerpo += contenido(pagina, i);
        } else {
            if (pagina == max) {
                for (let i = max - 4; i <= max; i++) cuerpo += contenido(pagina, i);
            } else if ((pagina + 4) <= max) {
                if ((pagina - 2) <= 1) {
                    for (let i = 1; i <= 5; i++) cuerpo += contenido(pagina, i);
                } else if ((pagina + 2) == max) {
                    for (let i = pagina; i <= (pagina + 4); i++) cuerpo += contenido(pagina, i);
                } else {
                    for (let i = pagina - 3; i < (pagina + 2); i++) cuerpo += contenido(pagina, i);
                }
            } else {
                for (let i = pagina - 3; i < (pagina + 2); i++) cuerpo += contenido(pagina, i);
            }
        }
        cuerpo += `
            <li class="page-item ${pagina == max ? "disabled" : "click"} ml-3">
                <a name="pagina" class="page-link" aria-label="Next">
                    <span name='Final' aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>`;

        if (entro) $("#pie")[0].innerHTML = cuerpo;

        $(`a[name="pagina"]`).click(evt => cargar(evento(evt, max)));

    };

    const cargar = (pagina) => {
        let contenido = $("#datos")[0];
        let max = Math.ceil(datos.length / 3);
        let total = 3 * pagina;
        let inicio = (pagina - 1) * 3;
        contenido.innerHTML = "";
        for (let i = inicio; i < total && i < datos.length; i++) {
            contenido.innerHTML += `
                <nav class="navbar navbar-expand-sm ml-1 mr-1 nav">
                    <button class="navbar-toggler border-danger bg-dark mx-auto mb-2 mt-2 " type="button" data-toggle="collapse" data-target="#datoEjemplo" aria-controls="datoEjemplo" aria-expanded="datoEjemplo" aria-label="Toggle navigation">
                        <label for="#" class="text-white">Pulse para ver ${datos[i].idP.id}<i class="fas fa-caret-down"></i></label>
                    </button>
                    <!-- Dato 1 -->
                    <div class="row data text-center collapse navbar-collapse bg-white" id="datoEjemplo">
                        <div class="col-md-1 col-xl-1 text-white bg-dark dato1">
                            <div for="#" class="mt-2 mb-2">
                                ${datos[i].idP.id}
                            </div>
                        </div>
                        <div class="col-md-3 col-xl-2 dato">
                            <div class="mt-2 mb-2">
                                ${datos[i].idP.nombre}
                            </div>
                        </div>
                        <div class="col-md-2 col-xl-2 text-white bg-dark dato1">
                            <div class="mt-2 mb-2">
                                ${datos[i].idP.telefono}
                            </div>
                        </div>
                        <div class="col-md-2 col-xl-3 dato">
                            <div class="mt-2 mb-2">
                                ${datos[i].idP.direccion}
                            </div>
                        </div>
                        <div class="col-md-2 col-xl-3 text-white bg-dark dato1">
                            <div class="mt-2 mb-2">
                                ${datos[i].idP.correo}
                            </div>
                        </div>
                        <div class="col-md-2 col-xl-1 text-white dato1">
                            <label class="mt-2 mb-2">
                                <div class="btn-group" role="group">
                                    <button type="button" class="btn btn-primary text-white mr-2"
                                        name="adquirir" title="Ver">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </label>
                            <label class="mt-2 mb-2">
                                <div class="btn-group" role="group">
                                    <button type="button" class="btn btn-success text-white mr-2"
                                        name="adquirir" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                            </label>
                        </div>
                    </div>
                </nav>
            `;
        }
        pie(pagina, max);
    };

    const load = () => {
        leer()
            .then(lect => {
                datos = lect;
                cargar(1);
            })
            .catch(e => {
                console.log(e);
            })
    };

    load();

});