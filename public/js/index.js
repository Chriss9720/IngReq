$(document).ready(() => {
    let normal;

    const ajustar = () => {
        let f = document.getElementById('mainfooter');
        let total = f.getBoundingClientRect().y + f.getBoundingClientRect().height;
        let cComp = document.getElementById('cComp');
        let cVend = document.getElementById('cVend');
        if (!normal) {
            normal = cVend.getBoundingClientRect().height;
        }
        if (window.innerHeight > f.getBoundingClientRect().y) {
            let aumento = window.innerHeight - total;
            let aux = cComp.getBoundingClientRect().height + aumento;
            cComp.setAttribute("style", "height:" + aux + "px;");
            cVend.setAttribute("style", "height:" + aux + "px;");
        } else {
            cComp.setAttribute("style", "height:" + normal + "px;");
            cVend.setAttribute("style", "height:" + normal + "px;");
        }
    };

    window.addEventListener("resize", () => ajustar());

    ajustar();

    $("#ojoComprador").click(evt => {
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

    const login = data => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/auth/login",
                type: "post",
                data: data,
                datatype: "json",
                success: (s) => resolve(s),
                error: (e) => reject(e)
            });
        });
    };

    const validar = data => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/validar/login',
                type: 'post',
                data: data,
                success: s => resolve(s),
                error: e => reject(e)
            });
        });
    };

    const alerta = msg => {
        $("#alerta").html(`
            <div class="alert alert-danger alert-dismissible fade show text-center" role="alert">
                <strong>${msg}</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `);
    };

    $("#acceso").submit(form => {
        form.preventDefault();
        let data = {
            email: $("#email").val(),
            clave: $("#clave").val()
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
                    login(data)
                        .then(log => {
                            document.cookie = `token=${log};max-age=${(24 * 60 * 60)};path=/;`;
                            $("#acceso")[0].submit();
                        })
                        .catch(e => {
                            alerta(e.responseJSON.msg);
                        })
                }
            })
            .catch(e => {
                console.log(e);
            })
    });

});