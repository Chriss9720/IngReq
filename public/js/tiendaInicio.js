$(document).ready(() => {

    let datos = [];
    let cat = [];

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
                let data = datos[i];
                contenido.innerHTML += `
                    <div class="col-4 row p-2 mt-3">
                        <div class="col-12 mt-1 mb-1">
                            <img src="../img/${data.img}" class="img-fluid click" name="ver" id="img_${i}">
                        </div>
                        <div class="col-12">
                            <div class="d-flex flex-column text-center">
                                <h1 class="click" name="ver" id="name_${i}">${data.nombre}</h1>
                                <h2 class="click" name="ver" id="pre_${i}">$${data.precioV}</h2>
                            </div>
                        </div>
                    </div>
                `;
            } catch (e) {
                console.log(e)
            }
        }
        pie(pagina, max);
        $("[name='ver']").click(evt => {
            let pos = evt.target.id.split('_')[1];
            $("#datos").attr('action', `/articulo/${datos[pos]._id}`);
            $("#datos").submit();
        })
    };

    const leerArt = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/leer/articulos',
                type: 'POST',
                datatype: 'json',
                success: s => resolve(s),
                error: e => reject(e)
            });
        });
    };

    const leerCats = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/leer/categorias/arts',
                type: 'POST',
                datatype: 'json',
                success: s => resolve(s),
                error: e => reject(e)
            })
        });
    };

    const activo = cat => (cat.act) ? 'success' : 'secondary';

    const armarCats = () => {
        let html = "";
        cat.forEach(c => {
            html += `
                <label class="h4 mr-1 ml-1 mb-1 mt-1 click">
                    <span class="badge badge-${activo(c)}">${c.nombre}</span>
                </label>
            `;
        });
        $("#categorias").html(html);
    };

    const load = () => {
        leerArt()
            .then(arts => {
                datos = arts;
                cargar(1);
            })
            .catch(e => console.log(e));
        leerCats()
            .then(cats => {
                cats.forEach(c => {
                    cat.push({
                        nombre: c.nombre,
                        pos: cat.length,
                        act: true
                    });
                })
                armarCats();
            })
            .catch(e => console.log(e));
    };

    load();

    $("[name='comprar']").click(() => $("#irCarrito").submit());

});