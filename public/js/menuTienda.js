$(document).ready(() => {

    $("#menu").html(`
        <div class="menu">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <form action="/inicio" method="post">
                        <input class="nav-link sin" type="submit" value="Inicio">
                    </form>
                </li>
                <li class="nav-item click">
                    <form action="/carrito" method="post" id="irCarrito">
                        <a class="nav-link click" name="comprar">Carrito </a>
                    </form>
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