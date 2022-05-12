$(document).ready(() => {

    const armarMenu = () => {
        $("#menu").html(`
            <form method="post" id="cambio">
                <ul class="list-group">
                    <li name="menu" class="list-group-item list-group-item-secondary d-flex justify-content-between align-items-center hover" title="80">
                        <input type="submit" class="text-dark link" value="Reportes">
                    </li>
                    <li class="list-group-item list-group-item-secondary d-flex justify-content-between align-items-center hover">
                        <input type="submit" class="text-dark link" value="Proveedores">
                    </li>
                    <li class="list-group-item list-group-item-secondary d-flex justify-content-between align-items-center hover">
                        <input type="submit" class="text-dark link" value="Cupones">
                    </li>
                    <li class="list-group-item list-group-item-secondary d-flex justify-content-between align-items-center hover">
                        <input type="submit" class="text-dark link" value="Articulos">
                    </li>
                </ul>
            </form>
        `);
        $("#cambio").submit(s => $("#cambio").attr("action", `/Administrar/${s.originalEvent.submitter.value}`));
    };

    armarMenu();

    $("#salir").click(() => document.cookie = `token="";max-age=0;path=/;`);

});