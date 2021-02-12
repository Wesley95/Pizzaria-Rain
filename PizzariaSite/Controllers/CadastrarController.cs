using System.Web.Mvc;
using PizzariaSite.Models;
using ProjetoPizzaria.DTO;
using ProjetoPizzaria.BLL;

namespace PizzariaSite.Controllers
{
    public class CadastrarController : Controller
    {
        public ActionResult Cadastrar()
        {
            //if (CookiesControll.UserExistence)
            //{
            //    return RedirectToAction("Pedidos", "Pedido", new { area = "Usuario" });
            //}

            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [NoDirectAccess]
        public ActionResult CadastrarCliente(UserControl user)
        {
            string mensagem = string.Empty;
            if (Request.HttpMethod == "POST")
            {
                if (ModelState.IsValid)
                {
                    if (!string.IsNullOrEmpty(user.Nome))
                    {
                        try
                        {
                            UserControlBLL.AddUser(user);

                            mensagem = "Parabéns. O cadastro foi realizado com sucesso.";
                            //Response.StatusCode = 201;//Created


                            return RedirectToAction("CadastroMessage", "Cadastrar", new { Message = mensagem });
                        }
                        catch
                        {
                            Response.StatusCode = 500;//Internal Error
                            return PartialView("Error");
                        }
                    }
                    else
                    {
                        Response.StatusCode = 500;//Internal Error
                        return PartialView("Error");
                    }
                }
            }
            Response.StatusCode = 404;//Not Found
            //Unauthorized 401
            return PartialView("Error");
        }

        [NoDirectAccess]
        public ActionResult CadastroMessage(string Message)
        {
            ViewBag.Message = Message;
            return View();
        }

        [NoDirectAccess]
        public JsonResult EmailUnico(string Email)
        {
            UserControl usuario = UserControlBLL.UserValuesByEmail(Email.ToLower());

            return Json((usuario.Email == "null"),//Se retornar true, não tem email como esse cadastrado.
               JsonRequestBehavior.AllowGet);
        }

        [NoDirectAccess]
        public JsonResult CPFValidate(string CPF)
        {
            return Json(Models.Validates.Cpf.Validar(CPF),
                JsonRequestBehavior.AllowGet);
        }

    }
}