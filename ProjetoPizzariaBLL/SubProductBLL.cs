using System.Collections.Generic;
using ProjetoPizzaria.DTO;
using ProjetoPizzaria.DAO;

namespace ProjetoPizzaria.BLL
{
    public class SubProductBLL
    {
        public static List<SubProduct> ListAllByTypeId(string id)
            => new SubProductDAO().ListAll("select * from tb_subtipo_produto where cd_tipo_produto = '" + id + "' ORDER BY nm_subtipo_produto");

        public static List<SubProduct> ListAll()
            => new SubProductDAO().ListAll();

        public static bool UpdateStateById(string id, bool status)
            => new SubProductDAO().Update($"update tb_subtipo_produto set ds_subtipo_produto_disponivel ='{(status ? "1":"0")}' where cd_subtipo_produto = '{id}'");

        public static bool Add(SubProduct product)
            => new SubProductDAO().Add(product);
    }
}
