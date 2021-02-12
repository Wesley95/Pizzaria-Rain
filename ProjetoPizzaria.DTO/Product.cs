using System.ComponentModel.DataAnnotations;

namespace ProjetoPizzaria.DTO
{
    public class Product
    {
        public string Id { get; set; }

        [Required(ErrorMessage = "O campo Nome do Produto é obrigatório"),
            MaxLength(30, ErrorMessage = "Máximo de 15 caractéres"),
            MinLength(1, ErrorMessage = "Nome deve ser digitado")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O campo Preço é obrigatório")]
        public string PrecoProduto { get; set; }
        public bool Disponibilidade { get; set; }
        public string TotalProduto { get; set; }
        public int Quantidade { get; set; }
        public string Comentario { get; set; }

        public string IdType { get; set; }//Campo utilizado apenas para a verificação de entrada no cadastro.

        public Product() { }

        public Product(string nome, string preco, bool dispon)
        {
            Nome = nome;
            PrecoProduto = preco;
            Disponibilidade = dispon;
        }
    }
}
