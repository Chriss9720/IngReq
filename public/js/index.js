let normal;

const visible = (clave, ojo) => {
    var clave = document.getElementById(clave);
    var ojo = document.getElementById(ojo);
    if (clave.type.includes("password")) {
        clave.type = "text";
        ojo.className = "fas fa-eye-slash";
    } else {
        clave.type = "password";
        ojo.className = "fas fa-eye";
    }
};

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

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('AccesoCompradores').addEventListener('submit', entrarComprador);
});

async function entrarComprador(ev) {
    ev.preventDefault();
    let login = {
        email: getValue('email'),
        clave: getValue('claveComprador')
    };
    let msj = document.getElementById('ErrorMensaje');
    let entro;
    await $.ajax({
        url: "/auth/Comprador",
        type: "post",
        data: login,
        datatype: "json",
        success: (s) => {
            entro = true;
            document.cookie = `token=${s};max-age=${(24 * 60 * 60)};path=/;`;
        },
        error: (e) => {
            model();
            if (e.responseJSON) {
                msj.innerText = e.responseJSON.error;
            }
        }
    });
    if (entro)
        this.submit();
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('formVendedor').addEventListener('submit', entrarVendedor);
});

async function entrarVendedor(ev) {
    ev.preventDefault();
    let login = {
        email: getValue('emailVendedor'),
        clave: getValue('claveVendedor')
    };
    let msj = document.getElementById('ErrorMensaje');
    let entro;
    await $.ajax({
        url: "/auth/Vendor",
        type: "post",
        data: login,
        datatype: "json",
        success: (s) => {
            entro = true;
            document.cookie = `token=${s};max-age=${(24 * 60 * 60)};path=/;`;
        },
        error: (e) => {
            model();
            if (e.responseJSON) {
                msj.innerText = e.responseJSON.error;
            }
        }
    });
    if (entro)
        this.submit();
}

const getValue = (id) => document.getElementById(id).value

const model = () => $('#msj').modal({ show: true })