using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using BD;
using BibliotecaModel;
using ProjetoPizzaria.DTO;

namespace ProjetoPizzaria.DAO
{
    public class ProductsDAO : ObjectController<Product>
    {
        public override List<Product> ListAll(string query = "SELECT * FROM tb_produto ORDER BY nm_produto")
        {
            Commands bd = new Commands();

            var Products = new List<Product>();

            string selectProducts = query;

            SqlDataReader datareader = bd.ExecuteCommandReader(selectProducts);

            while (datareader.Read())
            {
                var it_product = new Product
                {
                    Id = datareader["cd_produto"].ToString(),
                    Nome = datareader["nm_produto"].ToString(),
                    PrecoProduto = Convert.ToDecimal(String.Format("{0:0.00}",
                        Convert.ToDecimal(datareader["vl_produto"].ToString()))).ToString(),/*float.Parse(datareader["vl_produto"].ToString())*/
                    Disponibilidade = datareader.GetBoolean(3),
                    Comentario = datareader["ds_comentario_produto"].ToString()
                };

                Products.Add(it_product);
            }
            datareader.Close();

            return Products;
        }

        public override bool Delete(string query = "") => base.Delete(query);

        public bool DeleteAll(Product[] products)
        {
            var dt = new DataTable();
            dt.Columns.Add("ProductID");
            dt.Columns.Add("SubTypeId");

            foreach (var product in products)
            {
                dt.Rows.Add(product.Id, product.IdType);
            }

            var con = new Commands().Con();
            var cmd = new SqlCommand("DeleteAllSelectedProducts", con)
            {
                CommandType = CommandType.StoredProcedure
            };

            var par = cmd.Parameters.AddWithValue("@ArrayProduct", dt);
            par.Direction = ParameterDirection.Input;

            try
            {
                con.Open();
                SqlDataReader read = cmd.ExecuteReader();
                read.Close();
                con.Close();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool UpdateAll(Product[] products)
        {
            var dt = new DataTable();
            dt.Columns.Add("ProductID");//ProductID
            dt.Columns.Add("ProductPrice");
            dt.Columns.Add("ProductCommentary");
            dt.Columns.Add("SubTypeId");

            foreach (var product in products)
            {
                dt.Rows.Add(product.Id, product.PrecoProduto, product.Comentario, product.IdType);
            }

            var con = new Commands().Con();
            var cmd = new SqlCommand("UpdateAllSelectedProducts", con)
            {
                CommandType = CommandType.StoredProcedure
            };

            var par = cmd.Parameters.AddWithValue("@ArrayProduct", dt);
            par.Direction = ParameterDirection.Input;

            try
            {
                con.Open();
                SqlDataReader read = cmd.ExecuteReader();
                read.Close();
                con.Close();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public override bool Update(string query = "") => base.Update(query);

        public override bool Add(string query = "") => base.Add(query);

        public bool Add(Product product)
        {
            string query = "INSERT INTO tb_produto(nm_produto, vl_produto, ds_produto_disponivel, cd_subtipo_produto)" +
                            " VALUES('" + product.Nome + "','" +
                                product.PrecoProduto.ToString().Replace("R$", "").Replace(",", ".") + "','" +
                                    (product.Disponibilidade ? "1" : "0") + "','" +
                                        product.IdType + "')";
            return base.Add(query);
        }
    }
}
