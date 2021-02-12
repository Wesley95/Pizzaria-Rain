using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Mvc;
using PizzariaSite.Models;
using ProjetoPizzaria.DTO;
using ProjetoPizzaria.BLL;
using System.Diagnostics;

namespace PizzariaSite.Areas.Administrador.Controllers
{
    [Authorize(Roles = "Admin")]
    public class ProdutosController : Controller
    {
        public ActionResult Produtos()
        {
            ViewData["AllProducts"] = ProductTypeBLL.ProductTypeValues();

            return View();
        }

        [NoDirectAccess]
        public ActionResult DeletarProduto(Product[] products)
        {
            if (Request.IsAjaxRequest())
            {
                if (!string.IsNullOrEmpty(products[0].Id))
                {
                    if (ProductBLL.ProductDelete(products))
                    {
                        return Json(JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        Response.StatusCode = 500;
                        return PartialView("Error");
                    }
                }
                else
                {
                    Response.StatusCode = 500;
                    return PartialView("Error");
                }
            }
            Response.StatusCode = 401;
            return PartialView("Error");
        }

        [NoDirectAccess]
        [HttpPost]
        public ActionResult AlterarDisponibilidade(string id, bool checkOrNot = false)
        {
            if (Request.IsAjaxRequest())
            {
                if (!string.IsNullOrEmpty(id))
                {
                    if (ProductBLL.UpdateProductStateById(checkOrNot, id))
                    {
                        return Json(checkOrNot, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        Response.StatusCode = 500;
                        return PartialView("Error");
                    }
                }
                else
                {
                    Response.StatusCode = 403;
                    return PartialView("Error");
                }
            }
            Response.StatusCode = 401;
            return PartialView("Error");
        }

        [NoDirectAccess]
        [HttpPost]
        public ActionResult CadastrarProduto(Product produto)
        {
            if (Request.IsAjaxRequest())
            {
                if (!string.IsNullOrEmpty(produto.Nome))
                {
                    try
                    {
                        Product ToAdd = new Product
                        {
                            Nome = produto.Nome,
                            PrecoProduto = produto.PrecoProduto.ToString().Replace("R$", "").Replace(",", "."),
                            Disponibilidade = produto.Disponibilidade,
                            IdType = produto.IdType
                        };

                        if (ProductBLL.ProductAdd(ToAdd))
                        {
                            return Json(JsonRequestBehavior.AllowGet);
                        }
                        else
                        {
                            Response.StatusCode = 500;
                            return PartialView("Error");
                        }
                    }
                    catch
                    {
                        Response.StatusCode = 500;
                        return PartialView("Error");
                    }
                }
                else
                {
                    Response.StatusCode = 403;
                    return PartialView("Error");
                }
            }
            Response.StatusCode = 401;
            return PartialView("Error");
        }

        [NoDirectAccess]
        [HttpGet]
        public ActionResult TypeProductsJson()
        {
            if (Request.IsAjaxRequest())
            {
                return Json(ProductTypeBLL.ProductTypeValues(), JsonRequestBehavior.AllowGet);
            }
            else
            {
                Response.StatusCode = 401;
                return PartialView("Error");
            }
        }

        [NoDirectAccess]
        [HttpGet]
        public ActionResult TypeProductsJsonById(string id)
        {
            //Debug.WriteLine("Ok");
            if (Request.IsAjaxRequest())
            {
                return Json(ProductTypeBLL.TypeById(id), JsonRequestBehavior.AllowGet);
            }
            else
            {
                Response.StatusCode = 401;
                return PartialView("Error");
            }
        }

        /*----------------------------------------------------
         -----------------------------------------------------
         -----------------------------------------------------         
         ----------------TIPOS DE PRODUTOS--------------------
         -----------------------------------------------------
         -----------------------------------------------------
         ----------------------------------------------------*/

        #region Tipos Produtos

        /// <summary>
        /// Verifica a existencia de um tipo de produto
        /// </summary>
        /// <param name="Nome"></param>
        /// <returns></returns>
        /// 
        [NoDirectAccess]
        public JsonResult ProductTypeExistence(string Nome)
        {
            return Json(ProductTypeBLL.ListAll().Any(x => x.Nome.ToLower() == Nome.ToLower()),
                JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Método responsável por cadastrar um novo tipo de produto
        /// </summary>
        /// <param name="produto"></param>
        /// <returns></returns>
        [NoDirectAccess]
        [HttpPost]
        public ActionResult CadastrarProdutoTipo(ProductType produto)
        {
            if (Request.IsAjaxRequest())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        if (ProductTypeBLL.Add(produto))
                        {
                            return Json(JsonRequestBehavior.AllowGet);
                        }
                        else
                        {
                            Response.StatusCode = 500;
                            return PartialView("Error");
                        }
                    }
                    catch
                    {
                        Response.StatusCode = 401;
                        return PartialView("Error");
                    }
                }
            }

            Response.StatusCode = 401;
            return PartialView("Error");
        }

        /// <summary>
        /// Método responsável por alterar a disponibilidade do tipo de produto.
        /// Utilizado para especificar qual tipo produto o usuário poderá comprar
        /// </summary>
        /// <param name="id"></param>
        /// <param name="checkOrNot"></param>
        /// <returns></returns>
        /// 
        [NoDirectAccess]
        [HttpPost]
        public ActionResult AlterarDisponibilidadeTipo(string id, bool checkOrNot)
        {
            if (Request.IsAjaxRequest())
            {
                if (!string.IsNullOrEmpty(id))
                {
                    if (ProductTypeBLL.UpdateStateById(id, checkOrNot))
                    {
                        return Json(checkOrNot, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        Response.StatusCode = 500;
                        return PartialView("Error");
                    }
                }
                else
                {
                    Response.StatusCode = 401;
                    return PartialView("Error");
                }
            }
            Response.StatusCode = 401;
            return PartialView("Error");
        }

        [NoDirectAccess]
        [HttpPost]
        public ActionResult DeleteTypeProducts(string id)
        {
            if (Request.IsAjaxRequest())
            {
                if (!string.IsNullOrEmpty(id))
                {
                    string cs = ConfigurationManager.ConnectionStrings["ConexaoBD"].ConnectionString;

                    using (SqlConnection con = new SqlConnection(cs))
                    {
                        SqlCommand cmd = new SqlCommand("DeleteType", con)
                        {
                            CommandType = CommandType.StoredProcedure
                        };

                        cmd.Parameters.AddRange(new[]
                        {
                                new SqlParameter("@ID", id)
                        });

                        con.Open();
                        cmd.ExecuteNonQuery();
                        con.Close();
                    }

                    return Json(JsonRequestBehavior.AllowGet);
                }
                else
                {
                    Response.StatusCode = 500;
                    return PartialView("Error");
                }
            }
            Response.StatusCode = 403;
            return PartialView("Error");
        }

        [NoDirectAccess]
        [HttpGet]
        public ActionResult TypeProducts()
        {
            return Json(ProductTypeBLL.ListAll(), JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region SUBTIPO DE PRODUTOS

        [NoDirectAccess]
        [HttpGet]
        public JsonResult SubType(string id)
        {
            return Json(SubProductBLL.ListAllByTypeId(id), JsonRequestBehavior.AllowGet);
        }

        [NoDirectAccess]
        [HttpPost]
        public ActionResult DeleteSubTypeProducts(string id)
        {
            if (Request.IsAjaxRequest())
            {
                if (!string.IsNullOrEmpty(id))
                {
                    string cs = ConfigurationManager.ConnectionStrings["ConexaoBD"].ConnectionString;

                    using (SqlConnection con = new SqlConnection(cs))
                    {
                        SqlCommand cmd = new SqlCommand("DeleteSubType", con)
                        {
                            CommandType = CommandType.StoredProcedure
                        };

                        cmd.Parameters.AddRange(new[]
                        {
                                new SqlParameter("@ID", id)
                        });

                        con.Open();
                        cmd.ExecuteNonQuery();
                        con.Close();
                    }

                    return Json(JsonRequestBehavior.AllowGet);
                }
                else
                {
                    Response.StatusCode = 500;
                    return PartialView("Error");
                }
            }
            Response.StatusCode = 403;
            return PartialView("Error");
        }

        [NoDirectAccess]
        [HttpPost]
        public ActionResult ChangeStatusSubtype(string id, bool checkOrNot)
        {
            //System.Diagnostics.Debug.WriteLine(id + " / " + checkOrNot);
            if (Request.IsAjaxRequest())
            {
                if (!string.IsNullOrEmpty(id))
                {
                    if (SubProductBLL.UpdateStateById(id, checkOrNot))
                    {
                        return Json(checkOrNot, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        Response.StatusCode = 500;
                        return PartialView("Error");
                    }
                }
                else
                {
                    Response.StatusCode = 401;
                    return PartialView("Error");
                }
            }
            Response.StatusCode = 401;
            return PartialView("Error");

        }

        [NoDirectAccess]
        [HttpPost]
        public ActionResult RegisterSubtype(SubProduct subtipo)
        {
            if (Request.IsAjaxRequest())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        if (SubProductBLL.Add(subtipo))
                        {
                            return Json(JsonRequestBehavior.AllowGet);
                        }
                        else
                        {
                            Response.StatusCode = 500;
                            return PartialView("Error");
                        }
                    }
                    catch
                    {
                        Response.StatusCode = 401;
                        return PartialView("Error");
                    }
                }
            }

            Response.StatusCode = 401;
            return PartialView("Error");
        }

        [NoDirectAccess]
        [HttpGet]
        public JsonResult SubProductExistence(string Name, string id)
        {
            return Json(SubProductBLL.ListAllByTypeId(id).Any(x => x.Nome.ToLower() == Name.ToLower()),
                JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Editar Tipos de Produtos

        [NoDirectAccess]
        public ActionResult EditTypeProducts(string type_product)
        {
            try
            {
                ViewBag.ProductTypeToEdit = ProductTypeBLL.ProductTypeValues().Find(x => x.Id == type_product);

                return View();
            }
            catch
            {
                return PartialView("Error");
            }
        }

        [NoDirectAccess]
        public ActionResult UpdateAllSelected(Product[] products)
        {
            foreach (var item in products)
            {
                Debug.WriteLine(item.Comentario);
            }
            try
            {
                if (ProductBLL.UpdateAllProducts(products))
                {
                    return Json(JsonRequestBehavior.AllowGet);
                }
                else return PartialView("Error");
            }
            catch
            {
                return PartialView("Error");
            }
        }

        #endregion

    }
}