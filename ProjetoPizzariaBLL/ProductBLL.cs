using ProjetoPizzaria.DAO;
using ProjetoPizzaria.DTO;

namespace ProjetoPizzaria.BLL
{
    public class ProductBLL
    {
        public static bool ProductDelete(Product[] product)
            => new ProductsDAO().DeleteAll(product);

        public static bool UpdateProductStateById(bool status, string id) 
            => new ProductsDAO().Update("UPDATE tb_produto SET ds_produto_disponivel = '" + (status ? "1" : "0") + "' WHERE cd_produto = '" + id + "'");

        public static bool ProductAdd(Product product)
            => new ProductsDAO().Add(product);

        public static bool UpdateAllProducts(Product[] products)
            => new ProductsDAO().UpdateAll(products);
    }
}
