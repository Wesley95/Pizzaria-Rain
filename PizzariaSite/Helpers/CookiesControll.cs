using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace PizzariaSite.Helpers
{
    public static class CookiesControll
    {
        const string _master = "PizzariaCookies";
        const string _user = "userid";

        public static string MasterCookie { get { return _master; } }
        public static string UserCookie { get { return _user; } }
        public static bool UserExistence { get { return CookieExistence(UserCookie); } }

        public static bool CookieExistence(string Value)
        {
            return (HttpContext.Current.Request.Cookies[MasterCookie] != null &&//Se for diferente de nulo
                !string.IsNullOrEmpty(HttpContext.Current.Request.Cookies[MasterCookie].Values[Value]));//Se existe valor para um dos seus Values
        }

        public static string UserIDCookie()
        {
            return HttpContext.Current.Request.Cookies[MasterCookie].Values[UserCookie];
        }

        public static FormsAuthenticationTicket UserAuthenticationInfo()
        {
            string cookiename = FormsAuthentication.FormsCookieName;
            HttpCookie cookie = HttpContext.Current.Request.Cookies[cookiename];

            FormsAuthenticationTicket Ticket = new FormsAuthenticationTicket
                (1, null, DateTime.Now, DateTime.Now, false, null);

            try
            {
                if (cookie == null)
                {
                    return Ticket;
                }

                return FormsAuthentication.Decrypt(cookie.Value);
            }
            catch { return Ticket; }
        }
    }

}