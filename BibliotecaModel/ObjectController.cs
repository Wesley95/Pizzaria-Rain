using System;
using System.Collections.Generic;
using BD;

namespace BibliotecaModel
{
    public abstract class ObjectController<T> : IObjectController<T>, IObjectController
    {
        public virtual bool Add(string query = "")
            => CommandExecute(query);

        public virtual bool Delete(string query = "")
            => CommandExecute(query);

        public virtual bool Update(string query = "")
            => CommandExecute(query);
        
        internal bool CommandExecute(string query)
        {
            try
            {
                new Commands().ExecuteCommand(query);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public abstract List<T> ListAll(string query);
    }
}
