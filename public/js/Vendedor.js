$(document).ready(function() {
    $('#salir').click(
        function() {
            document.cookie = `token=bay;max-age=0;path=/;`;
            window.location.href = "/";
        }
    );
});