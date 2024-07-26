using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Internal;
using System.Data;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Runtime.CompilerServices;
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
            _context.Mitarbeiter.Add(mitarbeiter);
            await _context.SaveChangesAsync();
        }

        public async Task<Mitarbeiter?> Update(Mitarbeiter mitarbeiter)     //TODO: return mitarbeiter, no bool
        {
            try
            {
                if (mitarbeiter.Id == 0)
                {
                    return null;
                }
                else
                {
                    _context.Mitarbeiter.Update(mitarbeiter);
                    await _context.SaveChangesAsync();
                    return mitarbeiter;
                }
            }
            catch (Exception)
            {
                return null;
            }
        }
            //    if (_context.Mitarbeiter.Find(mitarbeiter.Id) != null)
            //    {
            //        _context.Mitarbeiter.Update(mitarbeiter);
            //        await _context.SaveChangesAsync();
            //        return true;
            //    }
            //    return false;
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
