using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System.Data;
using WebApplication1.Controllers;
using WebApplication1.Models;
using webAppServer.Data;

namespace WebApplication1.Services
{
    public class MitarbeiterService
    {
        private readonly MyJuStartContext _context;

        public MitarbeiterService(MyJuStartContext context)
        {
            _context = context;
        }
        private readonly static List<Mitarbeiter> MitarbeiterListe = new List<Mitarbeiter>
        {
            new Mitarbeiter(1, "x", "x", new DateTime(1985, 5, 14), 1, true, "x"),
            new Mitarbeiter(2, "x", "x", new DateTime(1990, 8, 22), 2, false, "x"),
            new Mitarbeiter(3, "x", "x", new DateTime(1978, 12, 3), 1, true, "x"),
            new Mitarbeiter(4, "x", "x", new DateTime(1982, 7, 30), 2, true, "x"),
            new Mitarbeiter(5, "x", "x", new DateTime(1965, 4, 1), 1, false, "x")
        };

        public async Task<List<Mitarbeiter>?> GetAll()
        {
            try
            {
                return await _context.Mitarbeiter.ToListAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<Mitarbeiter?> GetByID(int id)
        {
            return await _context.Mitarbeiter.FindAsync(id);
        }

        public async Task Create(Mitarbeiter mitarbeiter)
        {
            await _context.Mitarbeiter.AddAsync(mitarbeiter);
            await _context.SaveChangesAsync();
        }

        //public int GenerateId()
        //{
        //    var allMitarbeiter = GetAll();
        //    if (allMitarbeiter.Count == 0) return 1;

        //    return allMitarbeiter.Max(m => m.Id) + 1;
        //}



        //public bool Update(int id, Mitarbeiter mitarbeiter)     //TODO: return mitarbeiter, no bool
        //{
        //    var existingMitarbeiter = GetByID(id);
        //    if (existingMitarbeiter == null)
        //    {
        //        return false;
        //    }
        //    existingMitarbeiter.Vorname = mitarbeiter.Vorname;
        //    existingMitarbeiter.Nachname = mitarbeiter.Nachname;
        //    existingMitarbeiter.Geburtsdatum = mitarbeiter.Geburtsdatum;
        //    existingMitarbeiter.Geschlecht = mitarbeiter.Geschlecht;
        //    existingMitarbeiter.Qualifiziert = mitarbeiter.Qualifiziert;
        //    existingMitarbeiter.Notiz = mitarbeiter.Notiz;
        //    return true;
        //}

        //public bool Delete(int id)
        //{
        //    var mitarbeiter = GetByID(id);
        //    if (mitarbeiter == null)
        //    {
        //        return false;
        //    }
        //    MitarbeiterListe.Remove(mitarbeiter);
        //    return true;
        //}
    }
}
