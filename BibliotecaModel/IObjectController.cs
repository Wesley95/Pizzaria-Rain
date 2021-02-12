using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BibliotecaModel
{
    public interface IObjectController<T>
    {
        List<T> ListAll(string query);
    }

    public interface IObjectController
    {
        bool Add(string query);
        bool Delete(string query);
        bool Update(string query);
    }
}
