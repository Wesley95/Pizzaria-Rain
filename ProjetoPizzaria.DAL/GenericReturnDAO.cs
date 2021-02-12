using System.Collections.Generic;
using System.Data.SqlClient;
using BD;

namespace ProjetoPizzaria.DAO
{
    public static class GenericReturnDAO
    {
        public static string CodeValue(string sqlQuery, string fieldname)
        {
            string returned = string.Empty;
            SqlDataReader dr = new Commands().ExecuteCommandReader(sqlQuery);

            while (dr.Read())
                returned = dr[fieldname].ToString();

            dr.Close();

            return returned;
        }

        public static List<string> AllValues(string sqlQuery, string fieldname)
        {
            Commands bd = new Commands();
            SqlDataReader datareader = bd.ExecuteCommandReader(sqlQuery);
            List<string> list = new List<string>();
            string valueToList;

            while (datareader.Read())
            {
                valueToList = datareader[fieldname].ToString();

                list.Add(valueToList);
            }
            datareader.Close();

            return list;
        }
    }
}
