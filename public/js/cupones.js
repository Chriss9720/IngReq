$(document).ready(() => {

    let cat = [];
    let datos = [];

    const mostrarAlerta = (msg, tipo, id, show = true) => {
        $(`#${id}`).html((show) ? `
            <div class="alert alert-${tipo} alert-dismissible fade show text-center" role="alert">
                <strong>${msg}</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        ` : "");
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
    };

    $("#crearCupon").click(() => {
        validarCat()
            .then(cat => {
                reset();
                $("#ModalCat").modal();
            })
            .catch(c => {
                console.log(c);
                mostrarAlerta(c.responseJSON.msg, 'danger', 'crearC');
            })
    });

    const leerCat = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/leer/categorias',
                type: 'post',
                datatype: 'json',
                success: s => resolve(s),
                error: e => reject(e)
            });
        });
    };

    const cargarCats = () => {
        let html = "";
        cat.forEach(c => {
            html += `<option value="${c.cat}">`;
        });
        $("#cat").html(html);
    };

    const armarCats = () => {
        let sel = cat.filter(f => f.act);
        let html = "";
        sel.forEach(s => {
            html += `
                <label class="h4 mr-1 ml-1 mb-1 mt-1">
                    <span class="badge badge-secondary">${s.cat}
                        <img src='../../img/tacha.png' style="height:25px;cursor:pointer;" name="quitarCat" id="mat_${s.pos}">
                    </span>
                </label>
            `;
        });
        $("#catLista").html(html);
        $("[name='quitarCat']").click(evt => {
            let pos = evt.target.id.split('_')[1];
            cat[pos].act = false;
            armarCats();
        });
    };

    $("#catSel").keypress(k => {
        if (k.which === 13) {
            mostrarAlerta('', '', 'alertaCupon', false);
            let nombre = k.target.value;
            let find = cat.find(f => f.cat == nombre);
            if (find) {
                cat[find.pos].act = true;
                armarCats();
            } else {
                mostrarAlerta('Categoria no encotrada', 'danger', 'alertaCupon')
            }
            k.target.value = "";
        }
    });

    const leerCupones = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/leer/cupones',
                type: 'POST',
                datatype: 'json',
                success: s => resolve(s),
                error: e => reject(e)
            })
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

    const getCat = cats => {
        let html = "";
        cats.forEach(c => {
            html += `
                <label class="h4 mr-1 ml-1 mb-1 mt-1">
                    <span class="badge badge-secondary">
                        ${c.cat.nombre}
                    </span>
                </label>
            `;
        });
        return html;
    }

    const cargar = (pagina) => {
        let contenido = $("#datos")[0];
        let mostrar = 5;
        let max = Math.ceil(datos.length / mostrar);
        let total = mostrar * pagina;
        let inicio = (pagina - 1) * mostrar;
        contenido.innerHTML = "";
        for (let i = inicio; i < total && i < datos.length; i++) {
            try {
                let data = datos[i].idC;
                contenido.innerHTML += `
                    <nav class="navbar navbar-expand-sm ml-1 mr-1 nav">
                        <button class="navbar-toggler border-danger bg-dark mx-auto mb-2 mt-2 " type="button" data-toggle="collapse" data-target="#datoEjemplo" aria-controls="datoEjemplo" aria-expanded="datoEjemplo" aria-label="Toggle navigation">
                            <label for="#" class="text-white">CLICK ME <i class="fas fa-caret-down"></i></label>
                        </button>
                        <!-- Dato 1 -->
                        <div class="row data text-center collapse navbar-collapse bg-white" id="datoEjemplo">
                            <div class="col-md-1 col-xl-1 text-white bg-dark dato1">
                                <div for="#" class="mt-2 mb-2">
                                    ${data.id}
                                </div>
                            </div>
                            <div class="col-md-3 col-xl-2 dato">
                                <div class="mt-2 mb-2">
                                    ${data.porcentaje}
                                </div>
                            </div>
                            <div class="col-md-6 col-xl-7 text-white bg-dark dato1">
                                <div class="mt-2 mb-2">
                                    ${getCat(data.categorias)}
                                </div>
                            </div>
                            <div class="col-md-1 col-xl-1 dato">
                                <div class="mt-2 mb-2">
                                    ${data.usados}
                                </div>
                            </div>
                            <div class="col-md-1 col-xl-1 text-white bg-dark dato1">
                                <div class="mt-2 mb-2">
                                    ${data.disponibles}
                                </div>
                            </div>
                        </div>
                    </nav>
                `;
            } catch (e) {
                console.log(e)
            }
        }
        pie(pagina, max);
    };

    const load = () => {
        cat = [];
        datos = [];
        leerCat()
            .then(cats => {
                cats.forEach(c => {
                    cat.push({
                        cat: c.cat.nombre,
                        act: false,
                        pos: cat.length
                    });
                });
                cargarCats();
            })
            .catch(e => {
                console.log(e);
            });
        leerCupones()
            .then(cup => {
                datos = cup;
                cargar(1);
            })
            .catch(e => {
                console.log(e);
            });

    };

    load();

    const validar = data => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/validar/cupon',
                data: data,
                type: 'POST',
                datatype: 'json',
                success: s => resolve(s),
                error: e => reject(e)
            });
        });
    };

    const reset = () => {
        ['id', 'desc', 'catSel', 'cant'].forEach(k => {
            let campo = $(`#${k}`)[0];
            if (campo.className.includes("is-valid")) {
                campo.className = campo.className.replace(" is-valid", "");
            } else if (campo.className.includes("is-invalid")) {
                campo.className = campo.className.replace(" is-invalid", "");
            }
            campo.value = "";
        });
        cat.forEach(c => c.act = false);
        armarCats();
    };

    const salvarCupon = data => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/api/registro/cupon',
                type: 'POST',
                data: data,
                success: s => resolve(s),
                error: e => reject(e)
            });
        });
    };

    $("#salvarCat").click(() => {
        let data = {
            id: $("#id").val(),
            desc: $("#desc").val(),
            cat: cat.filter(f => f.act),
            cant: $("#cant").val()
        };
        validar(data)
            .then(v => {
                let valid = true;
                console.log(v)
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
                    salvarCupon(data)
                        .then(r => {
                            mostrarAlerta(r.msg, 'success', 'alertaCupon');
                            reset();
                            load();
                        })
                        .catch(c => {
                            mostrarAlerta(c.responseJSON.msg, 'danger', 'alertaCupon');
                        });
                }
            })
            .catch(c => {
                mostrarAlerta(c.responseJSON.msg, 'danger', 'alertaCupon');
            })
    });

});