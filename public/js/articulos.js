$(document).ready(() => {

    let proveedores = [];
    let cat = [];
    let idP;

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

    $('#modal').on('hidden.bs.modal', () => {
        let img = $("#foto_pro")[0];
        let nombre = $("#nombreFoto")[0];
        img.src = "../../img/none.jpg";
        nombre.innerText = "Seleccione la foto";
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
                console.log(cat);
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
        mostrarAlerta('', '', 'alertaRegistro', false);
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
                            cargarCategorias();
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

});