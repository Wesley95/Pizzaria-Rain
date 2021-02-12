using System.Collections.Generic;
using ProjetoPizzaria.DTO;
using ProjetoPizzaria.DAO;

namespace ProjetoPizzaria.BLL
{
    public class ProductTypeBLL
    {
        public static List<ProductType> ProductTypeValues()
            => ProductTypeDAO.SubProductsTypeValues();

        public static ProductType TypeById(string id) 
            => ProductTypeDAO.TypeById("select * from tb_tipo_produto where cd_tipo_produto ='" + id + "'");

        public static List<ProductType> ListAll() 
            => new ProductTypeDAO().ListAll();

        public static bool UpdateStateById(string id, bool status) 
            => new ProductTypeDAO().Update("UPDATE tb_tipo_produto SET ds_tipo_produto_disponivel = '" + (status ? "1" : "0") + "' WHERE cd_tipo_produto = '" + id + "'");

        public static bool Add(ProductType type) 
            => new ProductTypeDAO().Add(type);
    }
}

