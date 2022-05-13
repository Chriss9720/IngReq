$(document).ready(() => {

    let proveedores = [];
    let cat = [];
    let idP;
    let datos = [];

    const mostrarAlerta = (msg, tipo, id, show = true) => {
        $(`#${id}`).html((show) ? `
            <div class="alert alert-${tipo} alert-dismissible fade show text-center" role="alert">
                <strong>${msg}</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        ` : '');
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
                $("#modal").modal();
                mostrarAlerta('', '', 'alertaRegistro', false);
                mostrarAlerta('', '', 'alertaP', false);
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

    const leerProv = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/leer/proveedores',
                type: 'post',
                datatype: 'json',
                success: s => resolve(s),
                error: e => reject(e)
            });
        });
    };

    const cargarProveedores = () => {
        proveedores = [];
        leerProv()
            .then(pv => {
                let html = "";
                pv.forEach(l => {
                    let datos = l.idP;
                    proveedores.push(datos);
                    html += `<option value="${datos.id} - ${datos.nombre}">`;
                });
                $("#prov").html(html);
            })
            .catch(e => {
                console.log(e)
            });
    };

    cargarProveedores();

    const leerCategorias = () => {
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

    const cargarCategorias = () => {
        leerCategorias()
            .then(cat => {
                let html = "";
                cat.forEach(l => {
                    html += `<option value="${l.cat.nombre}">`;
                });
                $("#cat").html(html);
            })
            .catch(e => {
                console.log(e)
            });
    };

    cargarCategorias();

    const cargarDatosP = datos => {
        idP = datos.id;
        $("#datosP").html(`
            <div class="form-group row mt-3">
                <label id="idPS" class="col-4" >Id</label>
                <input class="col-8" type="text" disabled class="form-control" value="${datos.id}">
            </div>
            <div class="form-group row mt-3">
                <label class="col-4" >Correo</label>
                <input class="col-8" type="text" disabled class="form-control" value="${datos.correo}">
            </div>
            <div class="form-group row mt-3">
                <label class="col-4" >RFC</label>
                <input class="col-8" type="text" disabled class="form-control" value="${datos.RFC}">
            </div>
            <div class="form-group row mt-3">
                <label class="col-4" >Direccion</label>
                <input class="col-8" type="text" disabled class="form-control" value="${datos.direccion}">
            </div>
            <div class="form-group row mt-3">
                <label class="col-4" >Telefono</label>
                <input class="col-8" type="text" disabled class="form-control" value="${datos.telefono}">
            </div>
            <div class="form-group row mt-3">
                <label class="col-4" >Codigo postal</label>
                <input class="col-8" type="text" disabled class="form-control" value="${datos.cp}">
            </div>
        `);
    };

    $("#provSel").keypress(k => {
        if (k.which === 13) {
            let id = k.target.value.split(" - ")[0];
            let nombre = k.target.value.split(" - ")[1];
            let find = proveedores.find(f => id == f.id && f.nombre == nombre)
            if (find) {
                mostrarAlerta('', '', 'alertaProvedd', false);
                cargarDatosP(find);
            } else {
                cargarDatosP({
                    id: '',
                    correo: '',
                    RFC: '',
                    direccion: '',
                    telefono: '',
                    cp: ''
                });
                idP = undefined;
                mostrarAlerta('No se encontro el proverdor', 'danger', 'alertaProvedd');
            }
        }
    });

    const armarCat = () => {
        let activas = cat.filter(c => c.act);
        let html = "";
        activas.forEach(c => {
            html += `
                <label class="h4 mr-1 ml-1 mb-1 mt-1">
                    <span class="badge badge-secondary">${c.c}
                        <img src='../../img/tacha.png' style="height:25px;cursor:pointer;" name="quitarCat" id="cat_${c.pos}">
                    </span>
                </label>
            `;
        });
        $("#cats").html(html);
        $("[name='quitarCat']").click(evt => {
            let pos = evt.target.id.split("_")[1];
            cat[pos].act = false;
            armarCat();
        });
    };

    $("#catSel").keypress(k => {
        if (k.which === 13) {
            let find = cat.find(c => c.c == k.target.value);
            if (!find) {
                cat.push({ c: k.target.value, act: true, pos: cat.length });
                armarCat();
            }
            k.target.value = "";
        }
    });

    const validarDatos = data => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/validar/articulo',
                data: data,
                type: 'POST',
                datatype: 'json',
                success: s => resolve(s),
                error: e => reject(e)
            });
        });
    };

    const registrarArt = data => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/api/registro/articulo',
                data: data,
                type: 'POST',
                datatype: 'json',
                success: s => resolve(s),
                error: e => reject(e)
            });
        });
    };

    const subirImg = data => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/multimedia/subir/img',
                data: data,
                type: 'post',
                contentType: false,
                processData: false,
                success: s => resolve(s),
                error: e => reject(e)
            });
        });
    };

    $("#SalvarArt").click(async() => {
        let foto = $("#foto")[0].files[0];
        let formData = new FormData();
        if (foto) {
            formData.append('file', foto);
            await subirImg(formData)
                .then(t => {
                    foto = t.name;
                })
                .catch(c => {
                    console.log(c);
                    foto = 'none.jpg';
                });
        } else {
            foto = 'none.jpg';
        }
        let data = {
            img: foto,
            id: getValue('id'),
            diasC: getValue('diasC'),
            nombre: getValue('nombre'),
            cantidad: getValue('cantidad'),
            unidadesC: getValue('unidadesC'),
            unidadesV: getValue('unidadesV'),
            costo: getValue('costo'),
            costoP: getValue('costoP'),
            precioV: getValue('precioV'),
            precioM: getValue('precioM'),
            puntoR: getValue('puntoR'),
            prov: idP,
            cat: cat.filter(c => c.act)
        };
        validarDatos(data)
            .then(v => {
                let valid = true;
                console.log(v);
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
                    registrarArt(data)
                        .then(rg => {
                            mostrarAlerta('Registro exitoso', 'success', 'alertaRegistro');
                            reset();
                        })
                        .catch(e => {
                            mostrarAlerta(e.responseJSON.msg, 'danger', 'alertaRegistro');
                            console.log(e);
                        })
                }
            }).catch(e => {
                console.log(e);
            })
    });

    $("#calCost").click(() => {
        let cantidad = getValue('cantidad') || 0;
        let unidadesC = getValue('unidadesC') || 0;
        let costo = getValue('costo') || 0;
        let total = parseFloat(cantidad) + parseFloat(unidadesC);
        $("#costoP").val((total > 0 && costo > 0) ? (costo * total) / total : 0);
    });

    const getValue = id => $(`#${id}`).val();

    const reset = () => {
        [
            'id', 'diasC', 'nombre', 'cantidad', 'unidadesC',
            'unidadesV', 'costo', 'costoP', 'precioV', 'precioM',
            'puntoR', 'provSel'
        ].forEach(k => {
            let campo = $(`#${k}`)[0];
            if (campo.className.includes("is-valid")) {
                campo.className = campo.className.replace(" is-valid", "");
            } else if (campo.className.includes("is-invalid")) {
                campo.className = campo.className.replace(" is-invalid", "");
            }
            campo.value = "";
        });
        $("#nombreFoto").val("");
        $("#foto_pro")[0].src = "../img/none.jpg";
        cargarDatosP({
            id: '',
            correo: '',
            RFC: '',
            direccion: '',
            telefono: '',
            cp: ''
        });
        idP = undefined;
        cat = [];
        cargarCategorias();
    };

    const leer = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/leer/misProductos',
                type: 'POST',
                dataType: 'json',
                success: s => resolve(s),
                error: r => reject(e)
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
        let mostrar = 5;
        let max = Math.ceil(datos.length / mostrar);
        let total = mostrar * pagina;
        let inicio = (pagina - 1) * mostrar;
        contenido.innerHTML = "";
        for (let i = inicio; i < total && i < datos.length; i++) {
            try {
                let data = datos[i].idP;
                contenido.innerHTML += `
                    <nav class="navbar navbar-expand-sm ml-1 mr-1 nav">
                        <button class="navbar-toggler border-danger bg-dark mx-auto mb-2 mt-2 " type="button" data-toggle="collapse" data-target="#datoEjemplo" aria-controls="datoEjemplo" aria-expanded="datoEjemplo" aria-label="Toggle navigation">
                            <label for="#" class="text-white">CLICK ME <i class="fas fa-caret-down"></i></label>
                        </button>
                        <!-- Dato 1 -->
                        <div class="row data text-center collapse navbar-collapse bg-white" id="datoEjemplo">
                            <div class="col-sm-1 col-md-1 text-white bg-dark dato">
                                <label for="#" class="mt-2 mb-2">
                                    ${data.id}
                                </label>
                            </div>
                            <div class="col-sm-3 col-md-2 dato">
                                <label class="mt-2 mb-2">
                                    ${data.nombre}
                                </label>
                            </div>
                            <div class="col-sm-2 col-md-2 text-white bg-dark dato">
                                <label class="mt-2 mb-2">
                                    ${data.cantidad}
                                </label>
                            </div>
                            <div class="col-sm-2 col-md-2 dato">
                                <label class="mt-2 mb-2">
                                    ${data.precioV}
                                </label>
                            </div>
                            <div class="col-sm-2 col-md-2 text-white bg-dark dato">
                                <label class="mt-2 mb-2">
                                    ${data.precioM}
                                </label>
                            </div>
                            <div class="col-sm-4 col-md-3 text-white dato">
                                <label class="mt-2 mb-2">
                                    <div class="btn-group" role="group">
                                        <button type="button" class="btn btn-primary text-white mr-2"
                                            name="modificar_1" title="Ver">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                    </div>
                                </label>
                                <label class="mt-2 mb-2">
                                    <div class="btn-group" role="group">
                                        <button type="button" class="btn btn-success text-white mr-2"
                                            name="modificar_1" title="Editar">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </nav>
                `;
            } catch (e) {
                console.log(e)
            }
        }
        pie(pagina, max);
        $("[name='ver']").click(evt => {
            reset();
            let pos;
            if (evt.target.nodeName == 'BUTTON') {
                pos = evt.target.attributes.id.value.split("_")[1];
            } else {
                pos = evt.delegateTarget.attributes.id.value.split("_")[1];
            }
            verEditar(datos[pos].idP);
            mostrarAlerta('', '', false);
        });
        $("[name='editar']").click(evt => {
            reset();
            let pos;
            if (evt.target.nodeName == 'BUTTON') {
                pos = evt.target.attributes.id.value.split("_")[1];
            } else {
                pos = evt.delegateTarget.attributes.id.value.split("_")[1];
            }
            verEditar(datos[pos].idP, false);
            $("#accionAct").attr('hidden', false);
            $("#accionSalvar").attr('hidden', true);
            $("#accionDel").attr('hidden', true);
            mostrarAlerta('', '', false);
        });
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