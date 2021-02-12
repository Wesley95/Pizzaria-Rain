$("#form-login").submit(function (event) {
    event.preventDefault();

    var email = $("#InputEmailLogin").val(),
        password = $("#InputSenhaLogin").val();

    if (email) {

        $("#InputEmailLogin").removeClass("wrong-control").addClass("normal-control");
        $("#span-wrong-email").html("");

        if (password) {

            $("#InputSenhaLogin").removeClass("wrong-control").addClass("normal-control");
            $("#span-wrong-pass").html("");

            $.ajax({
                url: "UserInfoEmail",
                type: "GET",
                dataType: "JSON",
                data: { Email: email },
                success: function (data) {                    

                    //SE EMAIL ESTIVER CORRETO, ENTRA.
                    if (data == true) {
                        $("#InputEmailLogin").removeClass("wrong-control").addClass("normal-control");

                        $("#span-wrong-email").html("");

                        $.ajax({
                            url: "UserInfoPass",
                            type: "GET",
                            dataType: "JSON",
                            data: { Email: email, Password: password },
                            success: function (passcorrect) {
                                if (passcorrect != true) {

                                    $("#InputSenhaLogin").removeClass("normal-control").addClass("wrong-control");

                                    $("#span-wrong-pass").html("A senha está incorreta.");
                                }
                                else {
                                    $("#InputSenhaLogin").removeClass("wrong-control").addClass("normal-control");

                                    $("#span-wrong-pass").html("");
                                    location.reload();
                                }

                            }, error: function () {
                                alert("Ocorreu um erro ao verificar a Senha. Tente novamente ao recarregar da página.");
                                location.reload();
                            }
                        });

                    }
                    else {
                        $("#InputEmailLogin").removeClass("normal-control").addClass("wrong-control");

                        $("#span-wrong-email").html("O email não está cadastrado no sistema");
                    }
                }, error: function () {
                    alert("Ocorreu um erro ao verificar o Login. Tente novamente ao recarregar da página.");
                    location.reload();
                }
            });
        }
        else {
            $("#InputSenhaLogin").removeClass("normal-control").addClass("wrong-control");
            $("#span-wrong-pass").html("Digite a senha.");
        }
    }
    else {
        $("#InputEmailLogin").removeClass("normal-control").addClass("wrong-control");
        $("#span-wrong-email").html("Digite o Email");

        $("#InputSenhaLogin").removeClass("wrong-control").addClass("normal-control").val("");
        $("#span-wrong-pass").html("");

    }
});