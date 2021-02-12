using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ProjetoPizzaria.DAO;
using ProjetoPizzaria.DTO;

namespace ProjetoPizzaria.BLL
{
    public class UserControlBLL
    {
        public static UserControl UserValuesByEmail(string emailToLower)
            => UserControlDAO.UserValues("tb_usuario.ds_email = '" + emailToLower + "'");

        public static UserControl UserValuesById(string id)
            => UserControlDAO.UserValues("tb_usuario.cd_usuario = '" + id + "'");

        public static void AddUser(UserControl user)
            => UserControlDAO.Add(user);
    }
}
