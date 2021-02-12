loadModal(".adm-request", "request-info");

$(document).on("click", ".insert-request", function () {
    const parent = $(this).parents("tr.tr-products-to-buy");
    const id = $(parent).attr("data-id");

    if (!$("div.request-client-item[data-id='" + id + "']").length) {

        let input = $(parent).find("div.total-request > input");//Item
        var toAppend;

        var total = $(input).val(),
            table = $(this).parents("table");

        $(this).prop("disabled", true);

        $.ajax({
            url: "ProductById",
            type: "GET",
            dataType: "JSON",
            data: { ID: id },
            success: function (data) {

                if (data.length) {

                    var price_edited = data[0]["PrecoProduto"];
                    price_edited = price_edited.replace(",", ".");

                    toAppend = "<div class='request-client-item' data-id='" + id + "'>" +
                        "<div class='request-client-line'>" +
                        "<div class='request-client-total-area'>" +
                        "<div class='count-value-request'>" +
                        "</div>" +
                        "</div>" +
                        "<button class='remove-request'><i class='fa fa-times-circle-o'></i></button>" +
                        "</div>" +
                        "<div class='request-client-line'>" +
                        "<strong id='name-item'>" + data[0]["Nome"] + "</strong>" +
                        "<strong id='price-item'>R$" + data[0]["PrecoProduto"] + "</strong>" +
                        "</div>" +
                        "</div>";

                    $(toAppend).insertBefore("#container-request-add .all-requests button.confirm-request");
                    $(parent).hide();

                    $("div.request-client-item[data-id='" + id + "']").find(".count-value-request").dpNumberPicker({

                        min: 1,// Minimum value.
                        max: 30,// Maximum value.
                        value: parseInt(total),// Initial value
                        step: 1,// Incremental/decremental step on up/down change.
                        format: false,
                        editable: false,
                        addText: "+",
                        subText: "-",
                        formatter: function (val) { return val; },
                        beforeIncrease: function () { },
                        afterIncrease: function () { },
                        beforeDecrease: function () { },
                        afterDecrease: function () { },
                        beforeChange: function () { },
                        afterChange: function () { },
                        onMin: function () { },
                        onMax: function () { }
                    });

                    EnableDisableButton();
                    tableorganize(table, "#FFFFFF", "#e5e5e5");
                }
                else {
                    alert("Houve um erro ao tentar adicionar o produto à lista. A página será recarregada.");
                    location.reload();
                }


            }, error: function () {
                alert("Houve um erro ao tentar adicionar o produto à lista. A página será recarregada.");
                location.reload();
            }

        });
    }
    else {
        alert("Ocorreu um erro ao tentar adicionar o produto à lista, sendo que o mesmo já está adicionado. A página será recarregada.");
        location.reload();
    }
});

$(document).on("click", ".remove-request", function () {
    const id = $(this).parents("div.request-client-item").attr("data-id");
    var table = $("tr.tr-products-to-buy[data-id='" + id + "']");

    if (!$(table).length || id === undefined) {
        alert("Ocorreu um erro ao remover o produto da lista. A página será recarregada.");
        location.reload();
    }
    else {
        $(table).show().find("button.insert-request").prop("disabled", false);
        $("div.request-client-item[data-id='" + id + "']").remove();

        tableorganize($(table).parents("table.table"), "#FFFFFF", "#e5e5e5");
        EnableDisableButton();
    }
});

$(document).on("click", "button.confirm-request", function () {
    let all = { ObjRequest: [] };

    $('div.request-client-item').each(function () {

        let input = $(this).find("div.count-value-request input[type='text']");

        var newvalue = {
            IdProduto: $(this).attr("data-id"),
            QuantidadeProduto: $(input).val()
        };

        all["ObjRequest"].push(newvalue);
    });

    var jsonConverted = JSON.stringify(all);

    //AUTENTICAÇÃO DOS PEDIDOS PARA A SEGURANÇA DO CADASTRO DO MESMO
    $.ajax({
        type: "POST",
        url: "VerificarAutenticidadeProdutos",
        data: jsonConverted,
        dataType: "JSON",
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            //CASO SEJA TRUE, SIGNIFICA QUE OS PRODUTOS ESTÃO CORRETAMENTE CADASTRADOS
            if (data == true) {

                $.ajax({
                    type: "POST",
                    url: "CadastrarPedido",
                    data: jsonConverted,
                    dataType: "JSON",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        alert(data.Message);
                        window.location.href = data.Redirect;

                    }, error: function (data) {

                        alert(data.Message);
                        location.reload();
                    }
                });

            }
            //CASO CONTRÁRIO, RECARREGAMOS A TELA PARA EVITAR PROBLEMAS COM OS DADOS
            else {
                alert("Ocorreu um erro ao tentar cadastrar. Tente novamente ao carregar da página.");
                location.reload();
            }
        },
        error: function () {
            alert("Ocorreu um erro ao tentar cadastrar. Tente novamente ao carregar da página.");
            location.reload();
        }
    });



});

function EnableDisableButton() {

    let button = $("button.confirm-request");

    //alert($(button).html());

    if ($("div.request-client-item").length > 0) {
        $(button).prop("disabled", false).css("display", "block");
    }
    else {
        $(button).prop("disabled", true).css("display", "none");
    }
}

/*PEDIDOSREALIZADOSCLIENTE */
$(document).on("click", "button.cancel-request", function () {
    let id = $(this).attr("data-id");

    $.ajax({
        type: "POST",
        url: "CancelarPedido",
        dataType: "JSON",
        data: { ID: id },
        success: function () {
            let item = $(".request-client-container#" + id);

            $(".back-modal").modal("hide");

            alert("O pedido foi cancelado com sucesso.");

            setTimeout(function () {
                $(".back-modal").remove();
            }, 600, function () {
                queue: false
            });

            item.addClass("activeheight");

            setTimeout(function () {
                item.animate({
                    height: "0px"
                }, 300, function () {
                    queue: false
                    item.remove();
                });
            }, 1000);

        }, error: function () {
            alert("Ocorreu um erro ao tentar cancelar o pedido. A página será recarregada.");
            location.reload();
        }
    });
});

$(document).on("click", "[data-dismiss='modal']", function () {
    setTimeout(function () {
        $(".back-modal").remove();
    }, 600);
});



