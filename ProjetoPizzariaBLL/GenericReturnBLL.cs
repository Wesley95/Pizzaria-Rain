using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ProjetoPizzaria.DAO;

namespace ProjetoPizzaria.BLL
{
    public static class GenericReturnBLL
    {
        public static string FieldValue(string sqlQuery, string fieldName)
            => GenericReturnDAO.CodeValue(sqlQuery, fieldName);

        public static List<string> AllValues(string sqlQuery, string fieldName)
            => GenericReturnDAO.AllValues(sqlQuery, fieldName);
    }
}
