//FINALIZAR PEDIDO
$(document).on("click", ".finish-request", function () {
    var id = $(this).attr("data-id");

    if (id != "" || id != undefined) {
        if (confirm("Deseja finalizar o pedido?")) {

        }
    }
});