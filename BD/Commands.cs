using System;
using System.Configuration;
using System.Data.SqlClient;

namespace BD
{
    public class Commands : IDisposable
    {
        private readonly SqlConnection connection;

        public Commands()
        {
            connection = Con();
            connection.Open();
        }

        public SqlConnection Con()
            => new SqlConnection(ConfigurationManager.ConnectionStrings["ConexaoBD"].ConnectionString);

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
