$(document).ready(() => {

    $('#salir').click(() => {
        document.cookie = `token=bay;max-age=0;path=/;`;
        window.location.href = "/";
    });

});