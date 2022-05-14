$(document).ready(() => {

    let data = [];

    const leerCarrito = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/leer/carrito',
                type: 'POST',
                datatype: 'json',
                success: s => resolve(s),
                error: e => reject(e)
            });
        });
    };

    const cargar = () => {
        let html = "";
        let subTotal = 0;
        for (let i = 0; i < data.length; i++) {
            let d = data[i];
            html += `
                <div class="row border">
                    <div class="col-2">
                        <img src="../../img/${d.idA.img}" class="img-fluid m-1">
                    </div>
                    <div class="col-10 p-2">
                        <p class="text-justify h1 font-weight-bold">
                            ${d.idA.nombre}
                        </p>
                        <p class="h5 font-weight-bold">
                            $${d.idA.precioV}
                        </p>
                        <p class="h5 font-weight-bold">
                            Comprando <span>${d.cantidad}</span>
                        </p>
                        <div class="d-flex justify-content-end">
                            <input name="del" id="eli_${i}" type="button" class="btn btn-dark click" value="Eliminar del carrito">
                        </div>
                    </div>
                </div>
            `;
            subTotal += parseFloat(d.idA.precioV) * parseFloat(d.cantidad);
        };
        let iva = parseFloat(subTotal) * .16;
        iva = iva.toFixed(2);
        let total = parseFloat(iva) + parseFloat(subTotal);
        $("#subT").val(subTotal);
        $("#iva").val(iva);
        $("#total").val(total);
        $("#datos").html(html);
        $("[name='del']").click(evt => {
            let pos = evt.target.id.split("_")[1];
            eliminar({ id: data[pos]._id })
                .then(del => load())
                .catch(e => console.log(e))
        })
    };

    const eliminar = data => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/eliminar/Articulo',
                data: data,
                type: 'delete',
                datatype: 'json',
                success: s => resolve(s),
                error: e => reject(e)
            });
        });
    };

    const load = () => {
        leerCarrito()
            .then(car => {
                data = car;
                cargar();
            })
            .catch(e => {
                console.log(e)
            });
    };

    load();

});