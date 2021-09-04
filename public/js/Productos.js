$('#agregar').click(() => {
    modal();
    document.getElementById('Titulo-modal').innerText = "Agregar producto";
});

$('#modificar_1').click(() => {
    modal();
    document.getElementById('Titulo-modal').innerText = "Modificar producto";
});

const CargarFoto = () => {
    let archivo = document.getElementById("foto").files[0];
    let reader = new FileReader();
    let img = document.getElementById("foto_pro");
    let nombre = document.getElementById('nombreFoto');
    if (archivo) {
        nombre.innerText = archivo.name;
        reader.readAsDataURL(archivo);
        reader.onloadend = () => {
            img.src = reader.result;
        }
    }
};

$('#modal').on('hidden.bs.modal', () => {
    let img = document.getElementById("foto_pro");
    let nombre = document.getElementById('nombreFoto');
    img.src = "../img/none.jpg";
    nombre.innerText = "Seleccione la foto";
});

const modal = () => $('#modal').modal({ show: true });