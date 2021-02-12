using System.Web;
using System.Web.Optimization;

namespace PizzariaSite
{
    public class BundleConfig
    {
        // Para obter mais informações sobre o agrupamento, visite https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/myjs").IncludeDirectory(
                "~/Scripts/MyJS", "*.js", true));

            bundles.Add(new ScriptBundle("~/Cadastro").IncludeDirectory(
                "~/Scripts/Cadastro", "*.js", true));

            bundles.Add(new ScriptBundle("~/Masonry").Include(
                "~/Scripts/Visual/MasonryEffect.js"));

            bundles.Add(new ScriptBundle("~/FunctionsProduct").Include(
                "~/Scripts/ProdutosJS/FunctionsProdutos.js"));

            bundles.Add(new ScriptBundle("~/FunctionsClientRequest").Include(
                        "~/Scripts/PedidosClientes/PedidosClientesJS.js"));

            bundles.Add(new ScriptBundle("~/ADMRequest").Include(
                "~/Scripts/PedidosADM/PedidosADM.js"));

            bundles.Add(new ScriptBundle("~/Login").Include(
                        "~/Scripts/LoginJS/LoginJS.js"));

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryunobtrusive").Include(
                        "~/Scripts/jquery.unobtrusive*"));

            bundles.Add(new ScriptBundle("~/bundles/inputmask").Include(
                        "~/Scripts/inputmask/jquery.inputmask.js",
                        "~/Scripts/jquery.moneymask.js"));

            bundles.Add(new ScriptBundle("~/Spinner").Include(
                "~/Scripts/jquery.dpNumberPicker-1.0.1-min.js"
                ));

            // Use a versão em desenvolvimento do Modernizr para desenvolver e aprender. Em seguida, quando estiver
            // pronto para a produção, utilize a ferramenta de build em https://modernizr.com para escolher somente os testes que precisa.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/Content/Navbar.css",
                      "~/Content/Sidebar/Sidebar.css",
                      "~/Content/Dropdown/Dropdown.css",
                      "~/Content/Footer/FooterDefault.css",
                      "~/Content/Administrador/Produtos/ADMProdutos.css",
                      "~/Content/Modal.css",
                      "~/Content/FormItems.css",
                      "~/Content/ClientePedidos/ClientRequests.css",
                      "~/Content/Login/LoginStyle.css",
                      "~/Content/ClientePedidos/RealizeRequests.css",
                      "~/Content/AdminPedidos/AdmRequests.css",
                      "~/Content/Administrador/Produtos/ADMEditarProdutos.css"
                      ));

            bundles.Add(new StyleBundle("~/Content/InputSpinner").IncludeDirectory(
                "~/Content/InputNumberSpinner", "*.css", true
                ));


            bundles.Add(new StyleBundle("~/HomePanel").Include(
                    "~/Content/Home/HomePanel.css"
                ));

            bundles.Add(new StyleBundle("~/Default/css").Include(
                    "~/Content/PanelDefault/PanelDefault.css"
                ));
        }
    }
}
