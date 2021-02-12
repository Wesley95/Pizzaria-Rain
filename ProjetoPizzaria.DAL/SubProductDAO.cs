using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BD;
using BibliotecaModel;
using ProjetoPizzaria.DTO;

namespace ProjetoPizzaria.DAO
{
    public class SubProductDAO : ObjectController<SubProduct>
    {
        public override List<SubProduct> ListAll(string query = "SELECT * FROM tb_subtipo_produto ORDER BY nm_subtipo_produto")
        {
            Commands bd = new Commands();
            SqlDataReader datareader = bd.ExecuteCommandReader(query);
            var list = new List<SubProduct>();

            while (datareader.Read())
            {
                var aux_type = new SubProduct
                {
                    Id = datareader["cd_subtipo_produto"].ToString(),
                    //TemIngrediente = datareader.GetBoolean(1),
                    Disponibilidade = datareader.GetBoolean(2),
                    Nome = datareader["nm_subtipo_produto"].ToString()
                };

                list.Add(aux_type);
            }
            datareader.Close();

            foreach (var sub in list)
            {
                sub.produto = new ProductsDAO().ListAll("select * from tb_produto where cd_subtipo_produto = '" + sub.Id + "' order by nm_produto;");
            }

            return list;
        }

        public static SubProduct TypeById(string sqlQuery)
        {
            SubProduct newtype = new SubProduct();
            Commands bd = new Commands();
            SqlDataReader datareader = bd.ExecuteCommandReader(sqlQuery);

            while (datareader.Read())
            {
                newtype.Id = datareader["cd_subtipo_produto"].ToString();
                //newtype.TemIngrediente = datareader.GetBoolean(1);
                newtype.Disponibilidade = datareader.GetBoolean(2);
                newtype.Nome = datareader["nm_subtipo_produto"].ToString();
            }
            datareader.Close();

            newtype.produto = new ProductsDAO().ListAll("select * from tb_produto where cd_subtipo_produto = '" + newtype.Id + "' ORDER by nm_produto");
            return newtype;
        }

        public static List<SubProduct> ProductsTypeValues()
        {
            string selectQuery;

            var all_types = new SubProductDAO().ListAll();

            foreach (var subtypeProduct in all_types)
            {
                selectQuery = "SELECT* FROM tb_produto " +
                "INNER JOIN tb_subtipo_produto " +
                "ON tb_produto.cd_subtipo_produto = tb_subtipo_produto.cd_subtipo_produto " +
                "WHERE tb_subtipo_produto.cd_subtipo_produto = '" + subtypeProduct.Id + "' ORDER BY nm_produto";

                subtypeProduct.produto = new ProductsDAO().ListAll(selectQuery);
            }

            return all_types;
        }

        public override bool Add(string query = "") => base.Add(query);

        public bool Add(SubProduct product) 
            => base.Add("insert into tb_subtipo_produto(nm_subtipo_produto,ds_subtipo_produto_disponivel,cd_tipo_produto) VALUES " +
                $"('{product.Nome}','1','{product.TypeId}')");
    }
}
