using System.Collections.Generic;
using BibliotecaModel;
using ProjetoPizzaria.DTO;
using BD;
using System.Data.SqlClient;

namespace ProjetoPizzaria.DAO
{
    public class UserControlDAO: ObjectController<UserControl>
    {
        public override List<UserControl> ListAll(string query = "")
        {
            string fullQuery = "select* from tb_usuario INNER JOIN tb_endereco ON tb_endereco.cd_endereco = tb_usuario.cd_endereco";

            Commands bd = new Commands();
            SqlDataReader datareader = bd.ExecuteCommandReader(fullQuery);

            var allclient = new List<UserControl>();

            while (datareader.Read())
            {
                allclient.Add(new UserControl
                {
                    Id = int.Parse(datareader["cd_usuario"].ToString()),
                    Nome = datareader["nm_usuario"].ToString(),
                    CPF = datareader["cd_cpf_usuario"].ToString(),
                    Password = datareader["ds_password"].ToString(),
                    Email = datareader["ds_email"].ToString(),
                    IsAdm = datareader.GetBoolean(5),
                    Bairro = datareader["nm_bairro"].ToString(),
                    Logradouro = datareader["nm_logradouro"].ToString(),
                    Cidade = datareader["nm_cidade"].ToString(),
                    Estado = datareader["nm_estado"].ToString(),
                    Numero = datareader["cd_numero"].ToString(),
                    EnderecoId = datareader["cd_endereco"].ToString()
                });
            }
            datareader.Close();

            return allclient;
        }

        public static UserControl UserValues(string sqlQuery)
        {
            string fullQuery = "select * from tb_usuario INNER JOIN tb_endereco ON tb_endereco.cd_endereco = tb_usuario.cd_endereco where " + sqlQuery;

            Commands bd = new Commands();
            SqlDataReader datareader = bd.ExecuteCommandReader(fullQuery);

            UserControl client = new UserControl
            {
                Id = -30,
                Nome = "null",
                CPF = "null",
                Password = "null",
                Email = "null",
                IsAdm = false,
                Bairro = "null",
                Logradouro = "null",
                CEP = "null",
                Cidade = "null",
                Estado = "null",
                Numero = "null"
            };

            while (datareader.Read())
            {
                client.Id = int.Parse(datareader["cd_usuario"].ToString());
                client.Nome = datareader["nm_usuario"].ToString();
                client.CPF = datareader["cd_cpf_usuario"].ToString();
                client.Password = datareader["ds_password"].ToString();
                client.Email = datareader["ds_email"].ToString();
                client.IsAdm = datareader.GetBoolean(5);
                client.Bairro = datareader["nm_bairro"].ToString();
                client.Cidade = datareader["nm_cidade"].ToString();
                client.Estado = datareader["nm_estado"].ToString();
                client.Logradouro = datareader["nm_logradouro"].ToString();
                client.Numero = datareader["cd_numero"].ToString();
                client.EnderecoId = datareader["cd_endereco"].ToString();
            }
            datareader.Close();

            return client;
        }

        public bool IsAdmin(UserControl control)
        {
            return UserValues("tb_usuario.cd_usuario='" + control.Id + "'").IsAdm;
        }

        public override bool Add(string query = "")
        {
            return base.Add(query);
        }

        public static void Add(UserControl user)
        {
            string code = GenericReturnDAO.CodeValue("INSERT INTO tb_endereco(cd_cep, nm_logradouro, nm_bairro, nm_cidade, nm_estado, cd_numero) OUTPUT Inserted.cd_endereco VALUES " +
                                "('" + user.CEP + "','" + user.Logradouro + "','" + user.Bairro + "','" + user.Cidade + "','" + user.Estado + "','" + user.Numero + "')", "cd_endereco");

            string query = "INSERT INTO tb_usuario(nm_usuario, cd_cpf_usuario, ds_password, ds_email, ds_adm, cd_endereco) " +
                "VALUES ('" + user.Nome + "','" + user.CPF + "','" + user.Password + "','" + user.Email.ToLower() + "'," + "0" + "," + code + ")";

            new BD.Commands().ExecuteCommand(query);            
        }


    }

    public class Login
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}

