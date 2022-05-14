$(document).ready(() => {

    const pagar = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/actualizar/compra',
                type: 'POST',
                datatype: 'json',
                success: s => resolve(s),
                error: e => reject(e)
            });
        });
    };

    const validarDatos = data => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/validar/compra',
                data: data,
                type: 'POST',
                datatype: 'json',
                success: s => resolve(s),
                error: e => reject(e)
            });
        });
    };

    $("#pagar").click(() => {
        let data = {
            tarjeta_1: $("#tarjeta_1").val(),
            tarjeta_2: $("#tarjeta_2").val(),
            tarjeta_3: $("#tarjeta_3").val(),
            tarjeta_4: $("#tarjeta_4").val(),
            codigo: $("#codigo").val()
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
                    pagar()
                        .then(p => console.log(p))
                        .catch(e => console.log(e));
                }
            })
            .catch(e => console.log(e));
    });

    $("[name='comprar']").click(() => $("#irCarrito").submit());

});