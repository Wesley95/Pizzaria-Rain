using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace ProjetoPizzaria.DTO
{
    public class ProductType
    {
        public string Id { get; set; }

        [Required(ErrorMessage = "Digite o nome do Tipo do Produto")]
        [Remote("ProductTypeExistence", "Produtos", ErrorMessage = "Já existe um Tipo de Produto com esse nome")]
        public string Nome { get; set; }
        public bool Disponibilidade { get; set; }

        public List<SubProduct> subproduto;

        public ProductType()
        {
            subproduto = new List<SubProduct>();
        }
    }
}
