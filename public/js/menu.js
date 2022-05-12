$(document).ready(() => {

    $("#menu").html(`
        <ul class="list-group">
            <li name="menu" class="list-group-item list-group-item-secondary d-flex justify-content-between align-items-center hover" title="80">
                <a href="Reportes.html" class="text-dark">Reportes</a>
                <span class="badge badge-primary badge-pill">80</span>
            </li>
            <li class="list-group-item list-group-item-secondary d-flex justify-content-between align-items-center hover">
                <a href="proveedor.html" class="text-dark">Proveedores</a>
            </li>
            <li class="list-group-item list-group-item-secondary d-flex justify-content-between align-items-center hover">
                <a href="cupones.html" class="text-dark">Cupones</a>
            </li>
            <li class="list-group-item list-group-item-secondary d-flex justify-content-between align-items-center hover">
                <a href="Articulos.html" class="text-dark">Articulos</a>
            </li>
        </ul>
    `);

});