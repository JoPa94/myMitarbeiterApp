using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Internal;
using System.Data;
using System.Linq;
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

        public async Task<List<Mitarbeiter>?> GetAll()
        {
            return await _context.Mitarbeiter.ToListAsync();

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

        public async Task<int> Delete(int id)
        {
            try
            {
                _context.Mitarbeiter.Remove(new Mitarbeiter { Id = id });
                return await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                return -1;
            }
        }
    }
}
