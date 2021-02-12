using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace ProjetoPizzaria.DTO
{
    public class UserControl
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O campo Nome é obrigatório"),
            StringLength(50)]//Campo necessário, com mensagem de erro
        public string Nome { get; set; }

        [Required(ErrorMessage = "O campo de CPF é obrigatório"),//De A à Z, de 5 a 15 caractéres...
        Remote("CPFValidate", "Cadastrar", ErrorMessage = "O CPF digitado é inválido"),
            StringLength(11, ErrorMessage = "O CPF deve conter no máximo 11 caractéres")]//De A à Z, de 5 a 15 caractéres...
        public string CPF { get; set; }

        [Required(ErrorMessage = "O campo de Senha é obrigatório")]
        [MaxLength(5, ErrorMessage = "A senha deve conter 5 caractéres"),
            MinLength(5, ErrorMessage = "A senha deve conter 5 caractéres")]//De A à Z, de 5 a 15 caractéres...
        public string Password { get; set; }


        [System.ComponentModel.DataAnnotations.Compare("Password", ErrorMessage = "As senhas não são iguais")]
        public string ConfirmPassword { get; set; }


        [Required(ErrorMessage = "O campo de Email é obrigatório"),
        RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$",
            ErrorMessage = "O Email digitado deve ser válido")]
        [Remote("EmailUnico", "Cadastrar", ErrorMessage = "Esse Email já existe")]
        public string Email { get; set; }

        [System.ComponentModel.DataAnnotations.Compare("Email", ErrorMessage = "Os Emails digitados não são iguais")]
        public string ConfirmEmail { get; set; }

        /*ENDEREÇO*/
        public string EnderecoId { get; set; }

        [Required(ErrorMessage = "O campo de CEP é obrigatório"),
            StringLength(9)]
        public string CEP { get; set; }

        [Required(ErrorMessage = "O campo de Logradouro é obrigatório"),
            StringLength(150)]
        public string Logradouro { get; set; }

        [Required(ErrorMessage = "O campo de Bairro é obrigatório"),
            StringLength(100)]
        public string Bairro { get; set; }

        [Required(ErrorMessage = "O campo de ErrorMessage é obrigatório"),
            StringLength(100)]
        public string Cidade { get; set; }

        [Required(ErrorMessage = "O campo de Estado é obrigatório"),
            StringLength(100)]
        public string Estado { get; set; }

        [Required(ErrorMessage = "O campo de Numero é obrigatório")]
        public string Numero { get; set; }

        public bool IsAdm { get; set; }
    }
}
