using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace webAppServer.Data
{
    public class MyJuStartContext : DbContext
    {
        public DbSet<Mitarbeiter> Mitarbeiter { get; set; }

        public MyJuStartContext(DbContextOptions<MyJuStartContext> options) : base(options) 
        { 
        }
    }
}
