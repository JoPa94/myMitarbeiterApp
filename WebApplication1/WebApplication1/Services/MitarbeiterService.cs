﻿using Microsoft.EntityFrameworkCore;
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
            var mitarbeiter = await _context.Mitarbeiter.FindAsync(id);
            Console.WriteLine(mitarbeiter);
            return mitarbeiter;
        }

        public async Task<Mitarbeiter?> Create(Mitarbeiter mitarbeiter)
        {
            if (mitarbeiter != null)
            {
                await _context.Mitarbeiter.AddAsync(mitarbeiter);
                return await _context.SaveChangesAsync() > 0 ? mitarbeiter : null;
            }
            return null;
        }

        public async Task<Mitarbeiter?> Update(Mitarbeiter mitarbeiter)
        {
            try
            {
                if (mitarbeiter.Id == 0)    // TODO IP: Check db
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

        public async Task<bool> Delete(int id)
        {
            try
            {
                var getDeletedMitarbeiter = await GetByID(id);
                if (getDeletedMitarbeiter != null)
                {                
                    _context.Mitarbeiter.Remove(getDeletedMitarbeiter);
                }
                return await _context.SaveChangesAsync() > 0 ? true : false;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
