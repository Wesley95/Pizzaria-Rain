using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BDTestes
{
    public class BD : IDisposable
    {
        private readonly SqlConnection connection;

        public BD()
        {
            //connection = new SqlConnection(ConfigurationManager.ConnectionStrings["ConexaoBD"].ConnectionString);
            connection = new SqlConnection(@"Persist Security Info = False; User ID = sa; Password = 123; Initial Catalog = PizzariaDB; Server = WESLEY-PC\SQLEXPRESS");
            connection.Open();
        }

        public void ExecuteCommand(string strQuery)
        {
            var command = new SqlCommand
            {
                CommandText = strQuery,
                CommandType = System.Data.CommandType.Text,
                Connection = connection
            };
            command.ExecuteNonQuery();
        }

        public SqlDataReader ExecuteCommandReader(string strQuery)
        {
            SqlCommand cmdInsert = new SqlCommand(strQuery, connection);
            return cmdInsert.ExecuteReader();
        }


        public void Dispose()//Sempre que for chamada, por padrão ele executará este método
        {
            if (connection.State == System.Data.ConnectionState.Open)
                connection.Close();
        }
    }
}
