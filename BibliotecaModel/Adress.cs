namespace BibliotecaModel
{
    public interface IAdress
    {
        string Estado { get; set; }
        string Cidade { get; set; }
        string Bairro { get; set; }
        string Logradouro { get; set; }
        string Numero { get; set; }
    }
}
