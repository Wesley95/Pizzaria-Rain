using System.Collections.Generic;
using System.Data.SqlClient;
using BD;
using BibliotecaModel;
using ProjetoPizzaria.DTO;

namespace ProjetoPizzaria.DAO
{
    public class ProductTypeDAO : ObjectController<ProductType>
    {
        //Capturar todos os tipos de produtos
        public override List<ProductType> ListAll(string query = "SELECT * FROM tb_tipo_produto ORDER BY nm_tipo_produto")
        {
            Commands bd = new Commands();
            SqlDataReader datareader = bd.ExecuteCommandReader(query);
            var list = new List<ProductType>();

            while (datareader.Read())
            {
                var aux_type = new ProductType
                {
                    Id = datareader["cd_tipo_produto"].ToString(),
                    //TemIngrediente = datareader.GetBoolean(1),
                    Disponibilidade = datareader.GetBoolean(1),
                    Nome = datareader["nm_tipo_produto"].ToString()
                };

                list.Add(aux_type);
            }
            datareader.Close();

            return list;
        }
        //Capturo um único tipo de produto, por ID ou por outra query
        public static ProductType TypeById(string sqlQuery)
        {
            ProductType newtype = new ProductType();
            Commands bd = new Commands();
            SqlDataReader datareader = bd.ExecuteCommandReader(sqlQuery);

            while (datareader.Read())
            {
                newtype.Id = datareader["cd_tipo_produto"].ToString();
                //newtype.TemIngrediente = datareader.GetBoolean(1);
                newtype.Disponibilidade = datareader.GetBoolean(1);
                newtype.Nome = datareader["nm_tipo_produto"].ToString();
            }
            datareader.Close();

            newtype.subproduto = new SubProductDAO().ListAll("select * from tb_subtipo_produto where cd_tipo_produto = '" + newtype.Id + "' ORDER by nm_subtipo_produto");
            return newtype;
        }

        //Tipos de Produtos + subtipos de produtos
        public static List<ProductType> SubProductsTypeValues()
        {
            string selectQuery;

            var all_types = new ProductTypeDAO().ListAll();

            foreach (var typeProduct in all_types)
            {
                selectQuery = "SELECT* FROM tb_subtipo_produto " +
                "INNER JOIN tb_tipo_produto " +
                "ON tb_subtipo_produto.cd_tipo_produto = tb_tipo_produto.cd_tipo_produto " +
                "WHERE tb_tipo_produto.cd_tipo_produto = '" + typeProduct.Id + "' ORDER BY nm_subtipo_produto";

                typeProduct.subproduto = new SubProductDAO().ListAll(selectQuery);
            }

            return all_types;
        }

        public override bool Add(string query = "") => base.Add(query);

        public bool Add(ProductType product)
        {
            string query = "INSERT INTO tb_tipo_produto(nm_tipo_produto, ds_tipo_produto_disponivel) VALUES('" +
                            product.Nome + "','" + true + "')";

            return base.Add(query);
        }

        public override bool Delete(string query = "")
        {
            return base.Delete(query);
        }

        public override bool Update(string query = "")
        {
            return base.Update(query);
        }
    }
}
