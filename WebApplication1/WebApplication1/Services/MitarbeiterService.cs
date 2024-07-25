using System.Data;
using WebApplication1.Controllers;
using WebApplication1.Models;
using webAppServer.Data;

namespace WebApplication1.Services
{
    public class MitarbeiterService
    {

        private readonly static List<Mitarbeiter> MitarbeiterListe =
[
    new Mitarbeiter(
        1,
        vorname: "x",
        nachname: "x",
        geburtsdatum: new DateTime(1985, 5, 14),
        geschlecht: 1,
        qualifiziert: true,
        notiz: "x"
    ),
    new Mitarbeiter(
        2,
        vorname: "x",
        nachname: "x",
        geburtsdatum: new DateTime(1990, 8, 22),
        geschlecht: 2,
        qualifiziert: false,
        notiz: "x"
    ),
    new Mitarbeiter(
        3,
        vorname: "x",
        nachname: "x",
        geburtsdatum: new DateTime(1978, 12, 3),
        geschlecht: 1,
        qualifiziert: true,
        notiz: "x"
    ),
    new Mitarbeiter(
        4,
        vorname: "x",
        nachname: "x",
        geburtsdatum: new DateTime(1982, 7, 30),
        geschlecht: 2,
        qualifiziert: true,
        notiz: "x"
    ),
    new Mitarbeiter(
        5,
        vorname: "x",
        nachname: "x",
        geburtsdatum: new DateTime(1965, 4, 1),
        geschlecht: 1,
        qualifiziert: false,
        notiz: "x"
    )
];

        public List<Mitarbeiter> GetAll()
        {
                return MitarbeiterListe;
        }

        //public List<Mitarbeiter> GetAllSQL()
        //{
        //    return _context.Mitarbeiter.ToList();
        //}

        public bool IdTaken(int id)
        {
            return GetAll().Any(m => m.Id == id);
        }

        public int GenerateId()
        {
            var allMitarbeiter = GetAll();
            if (allMitarbeiter.Count == 0) return 1;

            return allMitarbeiter.Max(m => m.Id) + 1;
        }

        public Mitarbeiter? GetByID(int id)
        {
            return MitarbeiterListe.FirstOrDefault(m => m.Id == id);
        }

        public bool Update(int id, Mitarbeiter mitarbeiter)     //TODO: return mitarbeiter, no bool
        {
            var existingMitarbeiter = GetByID(id);
            if (existingMitarbeiter == null)
            {
                return false;
            }
            existingMitarbeiter.Vorname = mitarbeiter.Vorname;
            existingMitarbeiter.Nachname = mitarbeiter.Nachname;
            existingMitarbeiter.Geburtsdatum = mitarbeiter.Geburtsdatum;
            existingMitarbeiter.Geschlecht = mitarbeiter.Geschlecht;
            existingMitarbeiter.Qualifiziert = mitarbeiter.Qualifiziert;
            existingMitarbeiter.Notiz = mitarbeiter.Notiz;
            return true;
        }

        public bool Delete(int id)
        {
            var mitarbeiter = GetByID(id);
            if (mitarbeiter == null)
            {
                return false;
            }
            MitarbeiterListe.Remove(mitarbeiter);
            return true;
        }
    }
}
