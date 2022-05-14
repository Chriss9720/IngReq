$(document).ready(() => {

    let idProd = location.pathname.split('/')[2];

    const leer = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `/leer/articulo/${idProd}`,
                type: 'POST',
                datatype: 'json',
                success: s => resolve(s),
                error: e => reject(e)
            });
        });
    };

    leer()
        .then(info => {
            Object.keys(info).forEach(k => {
                if (k != '_id' && k != 'img') {
                    $(`#${k}`).html(info[k]);
                } else if (k == 'img') {
                    $(`#${k}`)[0].src = `../img/${info[k]}`;
                }
            })
        })
        .catch(e => console.log(e));

    const validar = data => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/validar/cantidad',
                data: data,
                type: 'post',
                datatype: 'json',
                success: s => resolve(s),
                error: e => reject(e)
            });
        });
    };

    const addCarrito = data => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/api/registro/carrito',
                data: data,
                type: 'post',
                datatype: 'json',
                success: s => resolve(s),
                error: e => reject(e)
            });
        });
    };

    $("#addCar").click(() => {
        let data = {
            cantidad: $("#cantidadIng").val(),
            idP: idProd
        };
        validar(data)
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
                    addCarrito(data)
                        .then(add => {
                            console.log(add)
                        })
                        .catch(e => console.log(e));
                }
            })
            .catch(e => console.log(e));
    });

});