using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace ProjetoPizzaria.DTO
{
    public class SubProduct
    {
        public string Id { get; set; }

        [Required(ErrorMessage = "Digite o nome do SubProduto")]
        [Remote("ProductTypeExistence", "Produtos", ErrorMessage = "Já existe um SubProduto com esse nome")]
        public string Nome { get; set; }
        public bool Disponibilidade { get; set; }

        public List<Product> produto;

        public string TypeId { get; set; }

        public SubProduct()
        {
            produto = new List<Product>();
        }
    }
}
