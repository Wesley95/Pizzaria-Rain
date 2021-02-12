changeAfterChange(".checkProduct", "Produtos/AlterarDisponibilidade", ".product-item", "actived-product", "desactived-product");
changeAfterChange(".type-controller .container-type-product .type-product-check input[type='checkbox'].form-check-input", "Produtos/AlterarDisponibilidadeTipo",
    ".container-type-product", "actived-type", "desactived-type");
changeAfterChange(".checkSubProduct", "Produtos/ChangeStatusSubtype", ".subtype-name", "actived-subtype", "desactived-subtype");

function changeAfterChange(htmlelement, url, classtochange, active, desactive) {

    $(document).on("change", htmlelement, function () {
        var elementThis = this;
        var promise = objectchanged(elementThis, url);

        promise.then(function (data) {
            var classname = data ? desactive : active;
            $(elementThis).closest(classtochange).removeClass(classname).addClass(classname === active ? desactive : active);
        }, function () {
            alert("Falha na alteração dos Dados. A página será atualizada.");
            //window.location.reload(false);//Página refresca a partir do cache. True, refresca a partir do server.
        });
    });
}

function ProductsAll() {

    return Promise.resolve($.ajax({
        url: "Produtos/TypeProductsJson",
        method: "GET",
        dataType: "JSON",
        contentType: "application/json"
    }));
}

function TypeProductsById(id) {
    return Promise.resolve($.ajax({
        url: "TypeProductsJsonById",
        data: { id: id },
        method: "GET",
        dataType: "JSON",
        contentType: "application/json"
    }));
}

function objectchanged(obj, url) {
    const checkedOrNot = obj.checked ? true : false;
    const ID = $(obj).attr("data-id");

    return Promise.resolve($.ajax({
        url: url,
        method: "POST",
        data: { id: ID, checkOrNot: checkedOrNot }
    }));
}

/*-----------------------------------*/
/*LIMPAR FORMA COM DETERMINADA CLASS*/
function cleanform(formname) {
    $(formname).each(function () {
        this.reset();
    });
}


//-----------------------------------------
//-----------------------------------------
//----------------PRODUTOS-----------------
//-----------------------------------------
//-----------------------------------------

/*RESPONSÁVEL POR DELETAR UM PRODUTO DOS CADASTRADOS*/
$(document).on("click", ".product-item .product-item-controller .remove-product.remove-button", function () {
    var parent = $(this);
    var leaderID = parent.closest(".container-products").attr("data-id");

    let object =
    {
        products: []
    }

    let subtype_id = parent.closest(".subproduct-container").attr("data-id");

    object.products.push({ Id: parent.attr("data-id"), IdType: subtype_id });

    if (confirm("Deseja deletar este produto?")) {

        console.log(object);

        $.ajax({
            type: "POST",
            url: "Produtos/DeletarProduto",
            data: JSON.stringify(object),
            dataType: "JSON",
            contentType: "application/json",
            success: function () {
                //$(parent).closest("div.product-item").remove();
                ResetEspecificTab(leaderID);

            }, error: function () {
                alert("Ocorreu um erro ao tentar deletar o produto. A página será recarregada.");
                location.reload();
            }
        });
    }
});

/*CADASTRAR NOVO PRODUTO*/
$(document).on("submit", ".form-product-insert", function (e) {
    e.preventDefault();

    var name = $(".product-name#Nome").val(),
        price = $(".product-price#PrecoProduto").val(),
        type = $("select#selectProductType.combo-type-products").children("option:selected").attr("data-id") ||
            $("select#selectProductType.combo-type-products").children("option:selected").val(),
        subtype = $("select#selectSubType.combo-subtype-products").children("option:selected").attr("data-id") ||
            $("select#selectSubType.combo-subtype-products").children("option:selected").val(),
        form = this,
        btn,
        obj;

    if (name != "" && name != undefined) {
        //alert("Foi nome");
        if (price && price != "" && price != undefined) {
            //alert("Foi preço");
            if (subtype && subtype != undefined && subtype != "") {
                //alert("Foi sub");
                //if (confirm("Deseja adicionar o produto " + name + "?")) {
                    btn = $(form).find("input[type='submit']").attr("disabled", true);

                    obj = {
                        produto: {
                            Disponibilidade: true,
                            Nome: name,
                            PrecoProduto: price,
                            IdType: subtype
                        }
                    };

                    $.ajax({
                        url: "Produtos/CadastrarProduto",
                        data: { produto: obj.produto },
                        method: "POST",
                        success: function () {
                            ResetEspecificTab(type);
                            cleanform($(form));

                            TimeToUpdateComboSubtype();
                            btn.attr("disabled", false);
                        },
                        error: function () {
                            alert("Ocorreu um erro inesperado e a página será recarregada.");
                            location.reload();
                        }
                    });
                //}
            }
            else {
                alert("Selecione um Subtipo para realizar o Cadastro do Produto. Caso não tenha um subtipo no 'Tipo de Produto' cadastrado, cadastre um para prosseguir com o cadastro de Produto.");

            }
        }
        else {
            alert("Adicione o preço ao Produto.");

        }
    }
    else {
        alert("Adicione um nome ao Produto.");
    }
});

//-----------------------------------------
//-----------------------------------------
//-----------TIPO DE PRODUTOS--------------
//-----------------------------------------
//-----------------------------------------

/*VERIFICANDO EXISTENCIA DO TIPO*/
$(document).on("submit", ".form-type-product", function (e) {
    e.preventDefault();

    var type = $("#TipoProdutoCadastro").val();

    if (type.length >= 1 && type.length <= 15) {

        obj = {
            Nome: type
        };

        /*VERIFICAR SE O TIPO DE PRODUTO EXISTE*/
        $.ajax({
            url: "Produtos/ProductTypeExistence",
            data: { Nome: type },
            success: function (data) {
                console.log(data);
                if (!data) {
                    /*CADASTRANDO O TIPO*/
                    RegisterType(type);
                }
                else {
                    //JÁ EXISTE
                    $("#TipoProdutoMessage").html("O Tipo de Produto digitado já existe");
                }
            },
            error: function () {
                alert("Ocorreu um erro e a página será recarregada.");
                location.reload();
            }
        });
    }
    else {
        $("#TipoProdutoMessage").html("O Tipo de Produto deve conter de 1 a 15 caractéres");
    }
});

//CADASTRAR TIPO DE PRODUTO
function RegisterType(typename) {

    var produtotemp = {
        produto: {
            Disponibilidade: true,
            Nome: typename
        }
    };

    /*CADASTRAR TIPO DE PRODUTO*/
    $.ajax({
        url: "Produtos/CadastrarProdutoTipo",
        data: JSON.stringify(produtotemp),
        method: "POST",
        dataType: "JSON",
        contentType: "application/json",
        success: function () {
            $("#TipoProdutoMessage").html("");
            $("#TipoProdutoCadastro").val("");

            //ATUALIZAR TODOS OS CAMPOS NECESSÁRIOS COM O NOVO TIPO DE PRODUTO
            TypeProductsChange(true);
        },
        error: function () {
            alert("Houve um erro ao tentar salvar o tipo de produto. A página será recarregada.");
            location.reload();
        }
    });
}

/*DELETAR TIPOS DE PRODUTOS*/
$(document).on("click", ".type-controller .container-type-product .type-controller-button button.remove-type-product.remove-button", function () {

    if (confirm("Deseja deletar este Tipo de Produto?")) {
        $.ajax({
            url: "Produtos/DeleteTypeProducts",
            method: "POST",
            data: { id: $(this).attr("data-id") },
            success: function () {
                TypeProductsChange(true);

            }, error: function () {
                alert("Ocorreu um erro inesperado e a página será recarregada.");
                location.reload();
            }
        });
    }
});

//ATUALIZANDO COMBO DE SUBTIPO BASEADO NO TIPO SELECIONADO
$("select#selectProductType.combo-type-products").change(function () {
    TimeToUpdateComboSubtype();
});

const sleep = m => new Promise(r => setTimeout(r, m));

function TimeToUpdateComboSubtype() {
    let combo = $("select#selectSubType.combo-subtype-products");
    combo.prop("disabled", true);
    let combo_type = $("select#selectProductType.combo-type-products");
    combo_type.prop("disabled", true);

    (async () => {
        await sleep(2000);

        ComboSubtypeUpdate($("select#selectProductType.combo-type-products option:selected").attr("data-id"));
        combo.prop("disabled", false);
        combo_type.prop("disabled", false);

    })();
}

function BringSubtypeById(id) {
    return Promise.resolve($.ajax({
        url: "Produtos/SubType",
        method: "GET",
        data: { id: id },
        dataType: "JSON",
        contentType: "application/json"
    }));
}

function ComboSubtypeUpdate(id) {
    BringSubtypeById(id).then(function (data) {

        if (data.length > 0) {
            $("select#selectSubType.combo-subtype-products").removeClass("wrong-control").addClass("normal-control");
            RefreshComboType(data, "select#selectSubType.combo-subtype-products");
        }
        else {
            $("select#selectSubType.combo-subtype-products").html("").removeClass("normal-control").addClass("wrong-control");
        }
    }).catch(function () {
        alert("Ocorreu um erro inesperado e página será recarregada.");
        location.reload();
    });
}

/*ATUALIZANDO A SEÇÃO DOS TIPOS DE PRODUTOS*/
function RefreshTypeSection(data) {
    var parent = $(".right-field .type-controller.section-product-type").html("");

    for (var l = 0; l < data.length; l++) {
        var toAppend =
            "<div class='row-flex container-type-product " + (data[l].Disponibilidade ? "actived-type" : "desactived-type") + "'>" +
            "<div class='row-flex type-product-check'>" +

            "<input class='inp-cbx checkProduct form-check-input' type='checkbox' id='" + data[l].Id + "/" + data[l].Nome + "' data-id='" + data[l].Id + "' name='type' " + (data[l].Disponibilidade ? "checked" : "unchecked") + "/>" +
            "<label class='cbx inp-red-green' for='" + data[l].Id + "/" + data[l].Nome + "'>" +
            "<span>" +
            "<svg width='12px' height='10px'>" +
            "<use xlink:href='#checkitem'></use>" +
            "</svg>" +
            "</span>" +
            "<span>" + data[l].Nome + "</span>" +
            "</label>" +

            "</div>" +
            "<div class='type-controller-button'>" +
            "<a class='edit-link' href='/Administrador/Produtos/EditTypeProducts?type_product=" + data[l].Id + "'>Editar</a>" +
            "<button data-id='" + data[l].Id + "' class='remove-type-product remove-button'><i class='fa fa-times-circle-o'></i></button>" +
            "</div>" +
            "</div >";
        parent.append(toAppend);
    }
}

function TypeProductsChange(tab) {
    if (tab) ResetAllTab();

    let obj = [
        "select#selectProductType.combo-type-products",
        "select#select-type-to-subtype.type-product-to-subtype"
    ];

    obj.forEach(function (value) {
        ProductsAll().then(data => RefreshComboType(data, value))
            .then(data => RefreshTypeSection(data))
            .catch(function () {
                alert("Ocorreu um erro inesperado e página será recarregada.");
                location.reload();
            });
    });

    //alert($(obj[0] + " option:selected").attr("data-id"));
    TimeToUpdateComboSubtype();
}


//-----------------------------------------
//-----------------------------------------
//----------------SUBTIPO------------------
//-----------------------------------------
//-----------------------------------------

$(document).on("submit", ".form-subtype-insert", function (e) {
    e.preventDefault();

    var subtype_name = $("#subtype-register").val();
    var type_id = $("#select-type-to-subtype").children("option:selected").attr("data-id");

    if (subtype_name.length >= 1 && subtype_name.length <= 15 && type_id != undefined && type_id != "") {
        console.log("Nome:" + subtype_name + " / Id:" + type_id);
        /*VERIFICAR SE O SUBTIPO DE PRODUTO EXISTE*/
        $.ajax({
            url: "Produtos/SubProductExistence",
            data: { name: subtype_name, id: type_id },
            method: "GET",
            dataType: "JSON",
            contentType: "application/json",
            success: function (data) {
                console.log(data);
                if (!data) {
                    /*CADASTRANDO O SUBTIPO*/
                    $("#subtype-message").html("");
                    RegisterSubtype(subtype_name, type_id);
                }
                else {
                    //JÁ EXISTE
                    $("#subtype-message").html("O Subtipo digitado já existe");
                }
            },
            error: function () {
                alert("Ocorreu um erro e a página será recarregada.");
                location.reload();
            }
        });
    }
    else {
        $("#subtype-message").html("O Subtipo deve conter de 1 a 15 caractéres");
    }
});

//CADASTRAR SUBTIPO DE PRODUTO
function RegisterSubtype(subtype_name, type_id) {

    var subtype_temp = {
        subtipo: {
            Disponibilidade: true,
            Nome: subtype_name,
            TypeId: type_id
        }
    };

    /*CADASTRAR SUBTIPO DE PRODUTO*/
    $.ajax({
        url: "Produtos/RegisterSubtype",
        data: JSON.stringify(subtype_temp),
        method: "POST",
        dataType: "JSON",
        contentType: "application/json",
        success: function () {
            $("#subtype-message").html("");
            $("#subtype-register").val("");

            //ATUALIZAR TODOS OS CAMPOS NECESSÁRIOS COM O NOVO SUBTIPO DE PRODUTO
            TypeProductsChange(true);
        },
        error: function () {
            alert("Houve um erro ao tentar cadastrar o Subtipo. A página será recarregada.");
            location.reload();
        }
    });
}

$(document).on("click", "button.remove-subtype-product", function () {

    if (confirm("Deseja deletar o subtipo selecionado? \nOBS: Todos os produtos referentes a este subtipo serão deletados ao confirmar.")) {

        let id = $(this).attr("data-id"),
            t = $(this);

        $.ajax({
            url: "Produtos/DeleteSubTypeProducts",
            method: "POST",
            data: { id: id },
            success: function () {
                id = $(t).closest("div.container-products").attr("data-id");
                ResetEspecificTab(id);
                TypeProductsChange(false);

            }, error: function () {
                alert("Ocorreu um erro e a página será recarregada");
                window.reload();
            }
        });
    }
});


//-----------------------------------------
//-----------------------------------------
//-----------------RESETS------------------
//-----------------------------------------
//-----------------------------------------


/*ATUALIZANDO O COMBOBOX*/
function RefreshComboType(data, idcombo) {
    var type = $(idcombo).html("");
    type.prop("disabled", true);

    for (var l = 0; l < data.length; l++) {
        type.append("<option value='" + data[l]["Id"] + "' data-id='" + data[l]["Id"] + "'>" + data[l]["Nome"] + "</option>");
    }
    type.prop("disabled", false);
    return data;
}

/*CONTROLAR AS ABAS*/
function ResetAllTab() {

    ProductsAll()
        .then(data => ResetTabType(data))
        .then(data => ResetTabProducts(data))
        .catch(function () {
            alert("Ocorreu um erro inesperado e página será recarregada.");
            location.reload();
        });
}

/*RESETANDO ABAS*/
function ResetTabType(data) {

    if (data.length > 0) {
        var toAppend = "<li><a class='active tab-item-button' data-id='" + data[0]["Id"] + "' id='" + data[0]["Nome"] + "'>" + data[0]["Nome"] + "</a></li>";
        var ul_leader = $(".ul-tab").html("");

        $(ul_leader).append(toAppend);

        for (var l = 1; l < data.length; l++) {
            toAppend = "<li><a class='tab-item-button ' data-id='" + data[l]["Id"] + "' id='" + data[l]["Nome"] + "'>" + data[l]["Nome"] + "</a></li>";
            $(ul_leader).append(toAppend);
        }
    }

    return data;
}

/*RESETANDO OS CONTEUDOS DAS ABAS*/
function ResetTabProducts(data) {

    var parent = $(".tab-content-products.type-products-container").html("");
    var tab;

    for (var l = 0; l < data.length; l++) {//PARA CADA TIPO DE PRODUTO
        parent.append("<div class='container-products flex-row' data-id='" + data[l]["Id"] + "' id='" + data[l]["Nome"] + "' style='display: " + (l == 0 ? "flex" : "none") + ";'></div>");
        tab = $(".container-products#" + data[l]["Nome"]);
        CreateDivProducts(tab, data[l]);
    }
    return data;
}

//RESETANDO O CONTEUDO DE UMA ABA ESPECÍFICA
function ResetEspecificTab(id) {
    var products = ProductsAll();
    var tab = $(".container-products[data-id='" + id + "']").html("");

    products.then(function (data) {
        for (var l = 0; l < data.length; l++) {//PARA CADA TIPO DE PRODUTO

            if (data[l].Id === id) {
                CreateDivProducts(tab, data[l]);
                break;
            }
        }
    }, function () {
        alert("Ocorreu um erro inesperado e a página será recarregada");
        location.reload();
    });

    $("a.tab-item-button[data-id='" + id + "']").click();
}

//FUNÇÃO PARA ALOCAR OS PRODUTOS NAS ABAS DOS SEUS RESPECTIVOS TIPOS
function CreateDivProducts(tab, data) {
    let tab_name = "left";
    let toAppend;

    if (data.subproduto.length > 0) {
        for (let l = 0; l < data.subproduto.length; l++) {
            let subproduto = data.subproduto[l];
            tab.append("<div class='subproduct-container flex-row' id ='subproduct-" + subproduto.Id + "' data-id='" + subproduto.Id + "'></div>");

            toAppend = "<div class='row-flex border-trans subtype-name " + (subproduto.Disponibilidade ? 'actived-subtype' : 'desactived-subtype') + "'>" +
                "<div class='subproduct-item-controller flex-align'>" +
                "<input class='inp-cbx checkSubProduct' data-id='" + subproduto.Id + "' id='" + subproduto.Id + " / " + subproduto.Nome + "' type='checkbox' " + (subproduto.Disponibilidade ? 'checked' : 'unchecked') + "/>" +
                "<label class='cbx inp-red-green' for='" + subproduto.Id + " / " + subproduto.Nome + "'>" +
                "<span>" +
                "<svg width='12px' height='10px'>" +
                "<use xlink:href='#checkitem'></use>" +
                "</svg>" +
                "</span>" +
                "</label>" +
                "<div class=''>" + subproduto.Nome + "</div>" +
                "</div>" +
                "<div class='type-controller-button'>" +
                "<button data-id='" + subproduto.Id + "' class='remove-subtype-product remove-button'><i class='fa fa-times-circle-o'></i></button>" +
                "</div>" +
                "</div>";

            let tab_children = $(tab).children("div.subproduct-container#subproduct-" + subproduto.Id);

            tab_children.append(toAppend);

            if (subproduto.produto.length > 0) {

                for (let c = 0; c < 2; c++) {

                    tab_children.append("<div class='divider-tab divider-tab-" + tab_name + "'></div>");

                    for (let c1 = c; c1 < subproduto.produto.length; c1 += 2) {

                        toAppend = "<div class='product-item border-trans " + (subproduto.produto[c1].Disponibilidade ? "actived-product" : "desactived-product") + "' data-id='" + subproduto.produto[c1].Id + "'>" +
                            "<div class='row-flex product-item-controller' >" +

                            "<input type='checkbox' class='inp-cbx checkProduct' data-id='" + subproduto.produto[c1].Id + "' id='" + subproduto.produto[c1].Id + "/" + subproduto.produto[c1].Nome + "' " + (subproduto.produto[c1].Disponibilidade ? "checked" : "unchecked") + "/>" +
                            "<label class='cbx inp-red-green' for='" + subproduto.produto[c1].Id + "/" + subproduto.produto[c1].Nome + "'>" +
                            "<span>" +
                            "<svg width='12px' height='10px'>" +
                            "<use xlink:href='#checkitem'></use>" +
                            "</svg>" +
                            "</span>" +
                            "</label>" +

                            "<button data-id='" + subproduto.produto[c1].Id + "' class='remove-product remove-button' > <i class='fa fa-times-circle-o'></i></button>" +
                            "</div>" +
                            "<div class='row-flex'>" +
                            "<div>" + subproduto.produto[c1].Nome + "</div>" +
                            "<div>R$" + subproduto.produto[c1].PrecoProduto + "</div>" +
                            "</div>" +
                            "</div>";

                        $(tab_children).children(" div.divider-tab.divider-tab-" + tab_name).append(toAppend);
                        //$(toAppend).appendTo(".container-products#" + data["Nome"] + " div.divider-tab.divider-tab-" + tab_name);
                    }

                    tab_name = "right";
                }
                tab_name = "left";

            }
            else {
                tab.append("<div>Não há produtos adicionados.</div>");
            }

            $(".container-products#" + data["Nome"]).append("<div class='hr-tab'></div >");
        }
    }
    else {
        tab.append("<div>Não há subprodutos adicionados.</div>");
        $(".container-products#" + data["Nome"]).append("<div class='hr-tab'></div >");
    }

}

/*-----------------------------*/
/*EDIÇÃO DE PRODUTOS*/

SelectOrUnselect("button.select-all-by-subtype", true);
SelectOrUnselect("button.unselect-all-by-subtype", false);

//FUNÇÃO PARA MARCAR OU DESMARCAR AS CHECKBOXES DOS PRODUTOS
function SelectOrUnselect(button_id, check) {
    $(document).on("click", button_id, function () {
        $(".check-subtype-change:checked").each(function (value, index) {
            let sub_id = $(this).attr("data-id");

            $(".product-item-container-edit[data-id='" + sub_id + "']").each(function () {
                $(this).find(".ckb-edit-product").each(function () {
                    $(this).prop("checked", check);
                })
            });
        })
        ChangeIfHasSelected();
    });
}


//DELETAR PRODUTOS SELECIONADOS
$(document).on("click", ".delete-all-by-subtype", function () {
    DeleteAllSelected();
    //UpdateProductsSectionEdit();
});

//SALVAR ALTERAÇÕES DOS PRODUTOS SELECIONADOS
$(document).on("click", ".save-all-by-subtype-selected", function () {
    SaveChanges();
});

//SALVAR ALTERAÇÕES DOS PRODUTOS NÃO SELECIONADOS
$(document).on("click", ".quit-save-btn", function () {
    //SaveChanges();
    returnToProductList();
    //UpdateProductsSectionEdit();
});

//ALTERAR OS PREÇOS DOS PRODUTOS SELECIONADOS
$(document).on("click", ".btn-change-price", function () {
    ChangePrices();
});

function returnToProductList() {
    let url = "Produtos";

    SaveChanges();

    window.location.href = url;
}

function ListSubtypeById(id) {
    return Promise.resolve($.ajax({
        url: "SubType",
        method: "GET",
        dataType: "JSON",
        data: { id: id },
        contentType: "application/json"
    }));
}

function SaveChanges() {

    let all_selected = $(".ckb-edit-product:checkbox");

    if (all_selected.length > 0) {

        if (confirm("Deseja salvar todas as mudanças?")) {

            let object =
            {
                products: []
            };
            let price;
            let id;
            let commentary;
            let subtype_id;

            $(all_selected).each(function () {
                price = $(this).parents(".product-edit-info").find(".product-price-edit").html().replace(/[^0-9.,]/g, "").replace(",", ".");
                id = $(this).attr("data-id");
                subtype_id = $(this).parents(".product-item-container-edit").attr("data-id");
                commentary = $(this).parents(".product-item-container-edit").find("textarea#" + id).val();

                if (isNaN(price) || price === undefined || price === "" ||
                    isNaN(id) || id === undefined || id === "" ||
                    isNaN(subtype_id) || subtype_id === undefined || subtype_id === "" ||
                    commentary === undefined) {
                    alert("Ocorreu um erro e a página será recarregada.");
                    location.reload();
                }

                object.products.push({ Id: id, PrecoProduto: price, Comentario: commentary, IdType: subtype_id });
            });

            $.ajax({
                url: "UpdateAllSelected",
                dataType: "JSON",
                method: "POST",
                data: JSON.stringify(object),
                contentType: "application/json",
                success: function () {
                    UpdateProductsSectionEdit();
                },
                error: function () {
                    alert("Ocorreu um erro e a página será recarregada.");
                    location.reload();
                }
            });
        }
    }
}

function ChangePrices() {
    let all_selected = $(".ckb-edit-product:checkbox").filter(":checked");

    if (all_selected.length > 0) {
        let price_field = $(".subtype-change-price").val() || $("#subtype-change-price").val();
        price_field = price_field.replace("R$", "").replace(",", ".");

        alert(price_field);

        if (price_field != undefined && price_field != "" && price_field && !isNaN(price_field)) {

            $(all_selected).each(function () {
                $(this).parents(".product-edit-info").find(".product-price-edit").html("R$" + price_field.toString().replace(".", ","));
            });

        }
    }
}


function DeleteAllSelected() {

    let all_selected = $(".ckb-edit-product:checkbox").filter(":checked");

    if (all_selected.length > 0) {

        if (confirm("Deseja deletar os produtos selecionados?")) {

            let object =
            {
                products: []
            };
            let id;
            let subtype_id;

            $(all_selected).each(function () {
                id = $(this).attr("data-id");
                subtype_id = $(this).parents(".product-item-container-edit").attr("data-id");

                if (isNaN(id) || id === undefined || id === "" ||
                    isNaN(subtype_id) || subtype_id === undefined || subtype_id === "") {
                    alert("Ocorreu um erro e a página será recarregada.");
                    location.reload();
                }

                object.products.push({ Id: id, PrecoProduto: "", Comentario: "", IdType: subtype_id });
            });

            $.ajax({
                url: "DeletarProduto",
                dataType: "JSON",
                method: "POST",
                data: JSON.stringify(object),
                contentType: "application/json",
                success: function () {
                    //alert("Produtos Deletados");
                    UpdateProductsSectionEdit();
                },
                error: function () {
                    alert("Ocorreu um erro e a página será recarregada.");
                    location.reload();
                }
            });
        }
    }
}


//ATUALIZAR ÁREA DOS PRODUTOS PARA EDIÇÃO
function UpdateProductsSectionEdit() {

    let keep_height = $(".container-general.fields").height();
    let container = $(".container-general.fields").html("").height(keep_height);
    let type_id = $("input[type='hidden']#id-type").attr("data-id");

    TypeProductsById(type_id).then(function (data) {

        let toAppend;
        let aux = 0;

        toAppend = "<div>" +
            "<button class='select-all-by-subtype btn-default-edit btn-red-edit' disabled>Marcar Todos</button> " +
            "<button class='unselect-all-by-subtype btn-default-edit btn-green-edit' disabled >Dermarcar Todos</button> " +
            "<button class='delete-all-by-subtype btn-default-edit btn-yellow-edit' disabled>Deletar</button> " +
            "<button class='save-all-by-subtype-selected btn-default-edit btn-brown-edit'>Salvar</button> " +
            "<button class='quit-save-btn btn-default-edit' >Fechar</button> " +
            "<div>" +
            "<div class='form-group input-btn'>" +
            "<label for='subtype-change-price' class='label-form default-form-label'>Preço</label>" +
            "<input type='text' class='control-properties normal-control pricemask subtype-change-price' id='subtype-change-price' placeholder='R$0,00' /> " +
            "<span class='text-danger' id='subtype-price-change-error'></span>" +
            "<button class='btn-change-price btn-default-edit btn-yellow-edit'>Alterar</button>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<hr class='bigger-hr'/>";

        container.append(toAppend);

        for (let l = 0; l < data.subproduto.length; l++) {
            let subproduto = data.subproduto[l];

            container.append("<div class='subproduct-container flex-row' id='subproduct-" + subproduto.Id + "' data-id='" + subproduto.Id + "'></div>");

            toAppend = "<div class='row-flex subtype-name'>" +
                "<div class='subproduct-item-controller flex-align'>" +
                "<input type='checkbox' class='inp-cbx check-subtype-change' data-id='" + subproduto.Id + "' id='" + subproduto.Id + "/" + subproduto.Nome + "' unchecked />" +
                "<label class='cbx inp-yellow-gray' for='" + subproduto.Id + "/" + subproduto.Nome + "'>" +
                "<span>" +
                "<svg width='12px' height='10px'>" +
                "<use xlink: href='#checkitem'></use>" +
                "</svg>" +
                "</span>" +
                "</label>" +
                "<div class=''>" + subproduto.Nome + "</div>" +
                "</div>" +
                "</div>";

            let tab_children = $(container).children("div.subproduct-container#subproduct-" + subproduto.Id);

            tab_children.append(toAppend);

            toAppend = "<div class='products-container subproducts-products width-max' data-id='" + subproduto.Id + "'></div>";

            tab_children.append(toAppend);

            while (aux < subproduto.produto.length) {

                let container_three = $(tab_children).children("div.products-container.subproducts-products[data-id='" + subproduto.Id + "']").
                    append("<div class='inside-three' data-id=''></div>");
                container_three = $(container_three).children(".inside-three").last();

                let calc = subproduto.produto.length - aux,
                    count = calc >= 3 ? 3 : calc;

                if (calc >= 0) {

                    for (let c1 = aux; c1 < (aux + count); c1++) {
                        let produto = subproduto.produto;
                        $(container_three).append("<div class='inside-three-item'></div>");

                        toAppend = "<div class='product-item-container-edit' data-id='" + subproduto.Id + "'>" +
                            "<div class='product-edit-info row-flex' id='" + produto[c1].Id + "'>" +
                            "<div>" +
                            "<input class='inp-cbx ckb-edit-product' type='checkbox' id='" + produto[c1].Id + "/" + produto[c1].Nome + "' data-id='" + produto[c1].Id + "' name='product-edit' unchecked />" +
                            "<label class='cbx inp-yellow-gray' for='" + produto[c1].Id + "/" + produto[c1].Nome + "'>" +
                            "<span>" +
                            "<svg width='12px' height='10px'>" +
                            "<use xlink: href='#checkitem'></use>" +
                            "</svg>" +
                            "</span>" +
                            "<span>" + produto[c1].Nome + "</span>" +
                            "</label>" +
                            "</div>" +
                            "<div class='product-price-edit' data-id='price'>" +
                            "R$" + produto[c1].PrecoProduto +
                            "</div>" +
                            "</div>" +
                            "<textarea class='product-info-text control-properties normal-control text-adapter' id='" + produto[c1].Id + "'>" + produto[c1].Comentario + "</textarea>" +
                            "</div>";

                        $(container_three).children(".inside-three-item").last().append(toAppend);

                    }
                    aux += 3;
                }
            }
            aux = 0;

            $(container).append("<hr class='bigger-hr'/>");
        }

        applypricemask();
        //
        //$(container).height($(container).innerHeight());


    }).catch(function () {
        alert("Ocorreu um erro e a página será recarregada.");
    });
}

$(document).on("change", ".check-subtype-change", function () {
    let check = $(".check-subtype-change:checkbox").filter(":checked");

    if (check != undefined && check.length > 0) {
        $("button.select-all-by-subtype").prop("disabled", false);
        $("button.unselect-all-by-subtype").prop("disabled", false);
    }
    else {
        $("button.select-all-by-subtype").prop("disabled", true);
        $("button.unselect-all-by-subtype").prop("disabled", true);
    }
});

$(document).on("change", ".ckb-edit-product", function () {
    ChangeIfHasSelected();
});

function SomeProductSelected() {

    let checked_itens = $(".ckb-edit-product:checkbox").filter(":checked");

    if (checked_itens.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

function ChangeIfHasSelected() {
    if (SomeProductSelected()) {
        $("button.delete-all-by-subtype").prop("disabled", false);
    }
    else {
        $("button.delete-all-by-subtype").prop("disabled", true);
    }
}

//$(".product-item-container-edit").MasonryEffect({
//    masonryParentClass: ".ul-masonry-container",
//    movementVelocity: 600,
//    resizable:true
//});


//TEXTAREA ADAPTAVEL
(function (e) {
    e.fn.textAreaResize = function (v) {

        var settings = {
            padding_top: 3,
            padding_right: 3,
            padding_bottom: 3,
            padding_left: 3,
            LineCount: function () { }
        };

        if (arguments.length > 0)
            this.each(function () { this.options = e.extend(settings, v) })
        else
            this.each(function () { this.options = settings })

        var $this = $(this),
            f = function () {
                $this.each(function () {

                    let t = this;
                    let size = $(this).height();

                    if ($(t).prop("tagName") === "TEXTAREA") {

                        $(t).css({
                            "resize": "none",
                            "padding-top": t.options.padding_top + "px",
                            "padding-right": t.options.padding_right + "px",
                            "padding-bottom": t.options.padding_bottom + "px",
                            "padding-left": t.options.padding_left + "px",
                            "-ms-overflow-style": "none",
                            "scrollbar-width": "none"
                        });

                        t.LineCount = function () {
                            size = $(t).height();
                            let lineHeight = parseInt($(t).css("lineHeight"));
                            $(t).height(lineHeight);

                            let divHeight = $(t).prop("scrollHeight") - parseInt($(t).css("padding-top")) - parseInt($(t).css("padding-bottom")),
                                lines = parseInt(divHeight / lineHeight);

                            $(t).height((lineHeight * lines));
                            if ($(t).height() != size) {
                                $(".product-item-container-edit").each(function () {
                                    //let plugin = $(this).MasonryEffect();
                                    //plugin.move();
                                })
                            }
                        }

                        t.LineCount();

                        $(t).on("input paste", function () {
                            t.LineCount();
                        });
                    }
                    else return;
                });
            }
        f();
    }
}(jQuery));

//$(".text-adapter").textAreaResize();

/*MASKS ACTIVE*/