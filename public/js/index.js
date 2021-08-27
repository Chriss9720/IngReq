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