using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BDTestes
{
    public class QueryReturn
    {
        public static List<Cliente> ClienteValues(string sqlQuery)
        {
            BD bd = new BD();
            SqlDataReader datareader = bd.ExecuteCommandReader(sqlQuery);

            List<Cliente> list = new List<Cliente>();

            while (datareader.Read())
            {
                var cliente = new Cliente
                {
                    Nome = datareader["nm_cliente"].ToString(),
                    CPF = datareader["cd_cpf_cliente"].ToString(),
                    Email = datareader["ds_email"].ToString()
                };

                list.Add(cliente);
            }
            datareader.Close();

            return list;
        }
                
        public static List<string> AllValues(string sqlQuery, string fieldname)
        {
            BD bd = new BD();
            SqlDataReader datareader = bd.ExecuteCommandReader(sqlQuery);
            List<string> list = new List<string>();
            string valueToList = string.Empty;

            while (datareader.Read())
            {
                valueToList = datareader[fieldname].ToString();

                list.Add(valueToList);
            }
            datareader.Close();

            return list;
        }

        /// <summary>
        /// MÉTODO RESPONSÁVEL POR RETORNAR OS PRODUTOS E SEUS RESPECTIVOS INGREDIENTES
        /// PARA UMA LISTA DO TIPO PRODUTO
        /// </summary>
        /// <returns></returns>
        public static List<Produto> ProductsIngredients()
        {
            /*CRIANDO LISTA DE PRODUTOS*/
            var Products = new List<Produto>();

            /*CRIANDO QUERY QUE TRÁS DO BANCO TODOS OS PRODUTOS QUE ESTÃO DISPONÍVEIS*/
            string selectProducts = "SELECT nm_produto AS 'Produto' FROM tb_produto WHERE ds_produto_disponivel = 1",
             selectQuery;/*CRIAÇÃO DE VARIÁVEL UTILIZADA NO LOOP PARA UNIR A QUERY + O ITEM/NOME DO PRODUTO*/

            /*LISTA RESPONSÁVEL POR ARMAZENAR TODOS OS PRODUTOS DISPONÍVEIS PELO SEU NOME*/
            var listProducts = QueryReturn.AllValues(selectProducts, "Produto");

            /*LOOP RESPONSÁVEL POR ITERAR COM TODOS OS NOMES DOS PRODUTOS DISPONÍVEIS*/
            foreach (var item in listProducts)
            {
                /*VARIÁVEL RESPONSÁVEL POR ARMAZENAR OS VALORES DOS INGREDIENTES E PRODUTO DO ITERADOR*/
                var product = new Produto();

                /*QUERY RESPONSÁVEL POR TRAZER OS INGREDIENTES DO PRODUTO DO BANCO DE DADOS*/
                selectQuery = "SELECT tb_ingrediente.nm_ingrediente AS 'Ingrediente' " +
                    "FROM tb_ingrediente " +
                    "INNER JOIN tb_produto_ingrediente ON tb_ingrediente.cd_ingrediente = tb_produto_ingrediente.cd_ingrediente " +
                    "INNER JOIN tb_produto ON tb_produto_ingrediente.cd_produto = tb_produto.cd_produto WHERE tb_produto.nm_produto = '" + item + "'";

                /*VARIÁVEL QUE ARMAZENA OS INGREDIENTES PEGOS DO BANCO BASEADO NO NOME DO PRODUTO*/
                var ingredients = QueryReturn.AllValues(selectQuery, "Ingrediente");

                /*PASSA O NOME DO PRODUTO PARA A PROPRIEDADE DA CLASSE INSTANCIADA PRODUCT*/
                product.NomeProduto = item;

                /*PARA CADA INGREDIENTE, O SALVAMOS NA LISTA DO PRODUCT*/
                foreach (var i in ingredients)
                {
                    product.Ingredientes.Add(i);
                }
                /*ADICIONAMOS O PRODUCT AO PRODUCTS*/
                Products.Add(product);
            }
            /*RETORNAMOS O PRODUCTS*/
            return Products;
        }
    }
}
