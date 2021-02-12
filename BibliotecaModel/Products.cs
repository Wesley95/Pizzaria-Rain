namespace BibliotecaModel
{
    public abstract class Products<T> : ObjectController<T>
    {
        public abstract string Id { get; set; }
        public abstract string Nome { get; set; }
        public abstract bool Disponibilidade { get; set; }
    }
}
