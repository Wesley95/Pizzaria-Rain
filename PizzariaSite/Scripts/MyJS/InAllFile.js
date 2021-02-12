/*-------------------------------------------
 *-------------------------------------------
 * MASKS-------------------------------------
 * ------------------------------------------
 * ------------------------------------------
 * ------------------------------------------
 * */

function applypricemask() {

    $(".pricemask").maskMoney({
        prefix: "R$",
        decimal: ",",
        thousands: "."
    });
}

$(document).ready(function () {
    applypricemask();
});
applylettermask();

function applylettermask() {

    $(document).on('keypress', '.spcltr', function (event) {
        var regex = new RegExp("^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ0-9 -]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });

    $(document).on('keyup', '.spcltr', function (event) {
        var val = $(this).val();
        if (val.length > 0) {
            val = FirstLetterToUpper(val);
            $(this).val(LockSpaceRepeatedly(val));
        }
    });
}

function applySpecialCharClean() {
    $(document).on("keyup", ".cleanchar", function (event) {
        let val = $(this).val();
        if (val.length > 0) {
            $(this).val(CleanSpecialChar(val));
        }
    });
}


/* ------------------------------------------
 * ------------------------------------------
 * STRINGS-----------------------------------
 * ------------------------------------------
 * ------------------------------------------
 * ------------------------------------------
 * */
function replaceAt(string, index, replace) {
    return string.substring(0, index) + replace + string.substring(index + 1);
}

function IsWhiteSpace(char) {
    return /\s/g.test(char);
}

function IsLetter(char) {
    return char.toLowerCase() != char.toUpperCase();
}

function FirstLetterToUpper(text) {

    var auxtext = text;
    for (var l = 1; l < text.length; l++) {

        var currentValue = text[l - 1];

        if (IsWhiteSpace(currentValue)) {
            if (IsLetter(text[l])) {
                auxtext = replaceAt(auxtext, l, auxtext[l].toUpperCase());
            }
        }
    }

    if (IsLetter(auxtext[0])) auxtext = replaceAt(auxtext, 0, auxtext[0].toUpperCase());
    return auxtext;
}

function CleanSpecialChar(text) {
    text = text.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_');
    return text;
}


/**
 *MÉTODO RESPONSÁVEL POR EVITAR REPETIÇÃO DO CARACTERE SPACE = " "
 */
function LockSpaceRepeatedly(text) {
    var auxText = text,/*Criamos uma variável responsável por armazenar o texto e outra para ser um contador*/
        count = 0;

    /*Loop pelo texto, iniciando do segundo caractere para que possamos analisar o primeiro*/
    for (var l = 1; l < text.length; l++) {
        if (IsWhiteSpace(auxText[l])) {/*Verificamos se o caractere do iterador é espaço em branco, caso seja, criamos uma 
         contante com o nome de startPosition, que serve para armazenar a posição inicial do caractere cujo valor é espaço em branco.*/
            const startPosition = l;

            count++;/*Incrementamos o contador em +1*/

            /*Enquanto houver espaço em branco após o caractere atual do iterador + o contador, incrementa um no contador*/
            while (IsWhiteSpace(auxText[l + count])) count++;

            if (count > 1) {
                for (var c = 0; c < count - 1; c++) {
                    auxText = replaceAt(auxText, startPosition, "");
                }
                l = 1;
            }

            count = 0;
        }
    }
    while (IsWhiteSpace(auxText[0])) auxText = replaceAt(auxText, 0, "");

    return auxText;
}


/*
 *ORGANIZAR CORES DAS TABELAS
 */
function tableorganize(table, color1, color2) {
    let color = color1;

    $(table).find("tbody tr").each(function () {
        if ($(this).css("display") != "none") {
            $(this).css("background-color", color);
            color = color == color1 ? color2 : color1;
        }
    });
}


/*MODAL*/
function loadModal(btnclass, modalclassid) {

    $(document).on("click", btnclass, function () {

        $("#modal-container").remove();//Remove se existe, para evitar duplicar

        var modaltomove = "#modal-container[data-modid='" + modalclassid + "'] .modal-leader";
        const appendModal = "<div class='back-modal fade' id='modal-container' role='dialog' data-modid='" + modalclassid + "' data-backdrop='static'></div>";
        $("body").prepend(appendModal);

        var url = $(this).data("url");

        $.get(url, function (data) {
            var item = $("#modal-container[data-modid='" + modalclassid + "']");

            $(data).appendTo(item).html();
            $(item).modal("show");

            setTimeout(function () {

                $(modaltomove).animate({
                    top: $(item).outerHeight() / 2
                }, 500);
            }, 200);
        });
    });
}

//-------------------------------

$(document).mouseup(function (e) {
    var check = $(".check-outclick");

    if (!check.is(e.target) && check.has(e.target).length === 0) check.prop("checked", false);
});

//--------------------------------
//--------------------------------
//--------EXPAND-RETRACT----------
//--------------------------------
//--------------------------------
//$(document).on("click", ".expand-retract .expand-retract-header", function () {
//    $(".expand-retract").css({ "overflow": "hidden"});
//    let content = $(this).parent().children(".expand-retract-content");
//    if ($(content).innerHeight() == 0) {
//        $(content).innerHeight($(content).prop("scrollHeight"));
//    }
//    else {
//        $(content).innerHeight(0);
//    }
//});

(function (e) {
    e.fn.ExpandRetract = function (v) {

        var settings = {
            animate_velocity: 300
        };

        if (arguments.length > 0 && isNaN(arguments[0]) && typeof arguments[0] === "object")
            this.each(function () { this.options = e.extend(settings, v); })
        else
            this.each(function () { this.options = settings; })

        var $this = $(this),
            f = function () {
                $this.each(function () {
                    var t = this,
                        header = $(t).children(".expand-retract-header"),
                        content = $(t).children(".expand-retract-content"),
                        content_scrollheight = 0,
                        to_size = 0;

                    $(t).css("overflow", "hidden");

                    if ($(t).hasClass("start_expanded")) {
                        $(content).css({ "height": $(content).prop("scrollHeight") + "px", "display": "block" });
                    }
                    else {
                        $(content).css({ "height": "0px", "display": "none" });
                    }

                    $(header).on("click", function () {
                        $(content).css({ "display": "block" });
                        content_scrollheight = $(content).prop("scrollHeight");

                        to_size = $(content).height() == 0 ? content_scrollheight : 0;

                        $(content).animate({
                            height: to_size + "px"
                        }, t.options.animate_velocity, function () {
                            if ($(content).height() == 0) {
                                $(content.css("display", "none"));
                            }
                            else {
                                $(content).css({ "height": "auto", "overflow": "auto" });
                            }
                        });
                    });

                })
            };
        f();
    }
}(jQuery));

$(".expand-retract").ExpandRetract({
    animate_velocity: 100
});
