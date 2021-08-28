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
    let cVend = document.getElementById('cVend');
    if (!normal) {
        normal = cVend.getBoundingClientRect().height;
    }
    if (window.innerHeight > f.getBoundingClientRect().y) {
        let aumento = window.innerHeight - total;
        let aux = cVend.getBoundingClientRect().height + aumento;
        cVend.setAttribute("style", "height:" + aux + "px;");
        let area = document.getElementById('LoginVendedor').getBoundingClientRect();
        let dif = (area.y + area.height) - f.getBoundingClientRect().y;
        if (dif > 0) {
            let altura = cVend.style.height + dif;
            cVend.setAttribute("style", "height:" + altura + "px;");
        }
    } else {
        cVend.setAttribute("style", "height:" + normal + "px;");
    }
};

window.addEventListener("resize", () => ajustar());

ajustar();

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('formVendedor').addEventListener('submit', registrar)
});

async function registrar(ev) {
    ev.preventDefault();
}

const getValue = (id) => document.getElementById(id).value