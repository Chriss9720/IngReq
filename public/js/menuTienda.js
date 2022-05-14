$(document).ready(() => {

    $("#menu").html(`
        <div class="menu">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <form action="/inicio" method="post">
                        <input class="nav-link sin" type="submit" value="Inicio">
                    </form>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="servicios.html">Carrito </a>
                </li>
                <li class="nav-item">
                    <form action="/Administrar" method="post">
                        <input class="nav-link sin" type="submit" value="Administrar ventas">
                    </form>
                </li>
            </ul>
        </div>
    `);

});