using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BDTestes
{
    public class Produto
    {
        public string NomeProduto { get; set; }
        public List<string> Ingredientes;

        public Produto()
        {
            Ingredientes = new List<string>();
        }
    }
}
