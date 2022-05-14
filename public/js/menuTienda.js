$(document).ready(() => {

    $("#menu").html(`
        <div class="menu d-flex w-100">
            <ul class="navbar-nav w-50">
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
            <ul class="navbar-nav w-50 d-flex justify-content-end container">
                <li class="nav-item dropdown mr-3">
                    <a class="nav-link dropdown-toggle click" data-toggle="dropdown">${localStorage.getItem('nombre')} <i class="fas fa-user"></i></a>
                    <div class="dropdown-menu">
                        <a id="salir" href="/#" class="dropdown-item hover"><i class="fas fa-user-times"></i> Salir</a>
                    </div>
                </li>
            </ul>
        </div>
    `);

    $("#salir").click(() => {
        document.cookie = `token="";max-age=0;path=/;`;
        location.reload();
    });

});