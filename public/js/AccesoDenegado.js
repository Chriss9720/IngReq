let altura = () => {
    let c = document.getElementById('contenedor');
    let ps = c.getBoundingClientRect().y + c.getBoundingClientRect().height;
    let diff = window.innerHeight - ps;
    let g = diff + c.getBoundingClientRect().height;
    c.setAttribute('style', `height:${g}px;`);
}

altura();

window.addEventListener("resize", () => altura());