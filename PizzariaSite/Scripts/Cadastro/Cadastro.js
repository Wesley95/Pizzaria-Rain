//CEP----------
//-----------------------------
//-----------------------------
//-----------------------------
function limpa_formulário_cep() {
	//Limpa valores do formulário de cep.
	document.getElementById('Logradouro').value = ("");
	document.getElementById('Bairro').value = ("");
	document.getElementById('Cidade').value = ("");
	document.getElementById('Estado').value = ("");
}

function meu_callback(conteudo) {
	if (!("erro" in conteudo)) {
		//Atualiza os campos com os valores.
		document.getElementById('Logradouro').value = (conteudo.logradouro);
		document.getElementById('Bairro').value = (conteudo.bairro);
		document.getElementById('Cidade').value = (conteudo.localidade);
		document.getElementById('Estado').value = (conteudo.uf);
	} //end if.
	else {
		//CEP não Encontrado.
		limpa_formulário_cep();
	}
}

function pesquisacep(valor) {
	//Nova variável "cep" somente com dígitos.
	//alert(valor);
	var cep = valor.replace(/\D/g, '');
	//Verifica se campo cep possui valor informado.
	if (cep != "") {
		//Expressão regular para validar o CEP.
		var validacep = /^[0-9]{8}$/;
		//Valida o formato do CEP.
		if (validacep.test(cep)) {
			//Preenche os campos com "..." enquanto consulta webservice.
			document.getElementById('Logradouro').value = "...";
			document.getElementById('Bairro').value = "...";
			document.getElementById('Cidade').value = "...";
			document.getElementById('Estado').value = "...";
			//Cria um elemento javascript.
			var script = document.createElement('script');
			//Sincroniza com o callback.
			script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=meu_callback';
			//Insere script no documento e carrega o conteúdo.
			document.body.appendChild(script);
		} //end if.
		else {
			//cep é inválido.
			limpa_formulário_cep();
		}
	} //end if.
	else {
		//cep sem valor, limpa formulário.
		limpa_formulário_cep();
	}
};

//cep function
function controllCEP() {
	$('#CEP').focusout(function () {
		//var cep = $(this).id;
		pesquisacep($("#CEP").val());
	});
}
