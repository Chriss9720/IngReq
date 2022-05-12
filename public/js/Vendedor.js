$(document).ready(() => {

    $('#salir').click(() => {
        document.cookie = `token=bay;max-age=0;path=/;`;
        window.location.href = "/";
    });

    const ayuda = text => $("#ayuda").html(text);

    $("li[name='menu']").mousemove(evt => {
        let text = evt.target.childNodes[1];
        if (text) {
            text = text.innerText;
            ayuda(`Cambio a la vista de <b>${text}</b>`);
        }
    });

    $("div[name='menu']").mousemove(evt => {
        let text = evt.target.childNodes[3];
        if (text) {
            text = text.innerText;
            ayuda(`Muesta la vista de <b>${text}</b>`);
        }
    });

    $("#tabla").mousemove(evt => ayuda('Ultimos productos vendidos'));

});