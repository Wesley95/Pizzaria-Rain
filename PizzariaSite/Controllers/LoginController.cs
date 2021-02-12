using System;
using System.Web;
using System.Web.Mvc;
using PizzariaSite.Helpers;
using System.Web.Security;
using ProjetoPizzaria.BLL;

namespace PizzariaSite.Controllers
{
    public class LoginController : Controller
    {
        public ActionResult Login()
        {
            var cookie = CookiesControll.UserAuthenticationInfo();

            if (cookie.Name != null)
            {
                return RedirectToAction("Index", "Home", new { area = "" });
            }

            return View();
        }

        public ActionResult Sair()
        {
            var cookie = new HttpCookie(CookiesControll.MasterCookie)
            {
                Expires = DateTime.Now.AddDays(-1)
            };
            Response.Cookies.Add(cookie);

            FormsAuthentication.SignOut();

            return RedirectToAction("Login", "Login", new { area = "" });
        }

        public JsonResult UserInfoEmail(string Email)
        {
            return Json(UserControlBLL.UserValuesByEmail(Email.ToLower()).Email != "null" ? true : false,
                JsonRequestBehavior.AllowGet);
        }

        public JsonResult UserInfoPass(string Password, string Email)
        {
            try
            {
                var user = UserControlBLL.UserValuesByEmail(Email.ToLower());
                var passcorrect = user.Password == Password ? true : false;

                if (passcorrect)
                {
                    //HttpCookie UserCookie = Request.Cookies["PizzariaCookies"];

                    //if (UserCookie == null)
                    //{
                    //    UserCookie = new HttpCookie("PizzariaCookies");
                    //}

                    //UserCookie.Values["userid"] = user.Id.ToString();

                    //UserCookie.Expires.AddDays(10);
                    //Response.SetCookie(UserCookie);

                    var authTicket = new FormsAuthenticationTicket(
                        1,
                        user.Id.ToString(),
                        DateTime.Now,
                        DateTime.Now.AddDays(10),
                        true,
                        user.IsAdm ? "Admin" : "Client"
                        );

                    string encryptedTicket = FormsAuthentication.Encrypt(authTicket);


                    var authCookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedTicket);
                    
                    if(authTicket.IsPersistent)
                    {
                        authCookie.Expires = authTicket.Expiration;
                    }
                    
                    System.Web.HttpContext.Current.Response.Cookies.Add(authCookie);
                }
                return Json(passcorrect,
              JsonRequestBehavior.AllowGet);
            }
            catch            {
                return Json(false,
              JsonRequestBehavior.AllowGet);
            }
        }
    }
}