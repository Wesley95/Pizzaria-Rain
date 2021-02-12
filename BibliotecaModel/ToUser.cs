using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BibliotecaModel
{
    public abstract class ToUser<T> : ObjectController<T>, IAdress
    {
        public abstract string CEP { get; set; }
        public abstract string Estado { get; set; }
        public abstract string Cidade { get; set; }
        public abstract string Bairro { get; set; }
        public abstract string Logradouro { get; set; }
        public abstract string Numero { get; set; }

    }
}
