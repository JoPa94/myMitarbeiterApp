using WebApplication1.Controllers;
using WebApplication1.Models;

namespace WebApplication1.Services
{
    public class MitarbeiterService
    {
        private readonly static List<Mitarbeiter> MitarbeiterListe =
[
    new Mitarbeiter(
        txt_id: 1,
        vorname: "Max",
        nachname: "Mustermann",
        geburtsdatum: new DateTime(1985, 5, 14),
        geschlecht: 1,
        qualifiziert: true,
        notiz: "Erfahrener Mitarbeiter"
    ),
    new Mitarbeiter(
        txt_id: 2,
        vorname: "Erika",
        nachname: "Musterfrau",
        geburtsdatum: new DateTime(1990, 8, 22),
        geschlecht: 2,
        qualifiziert: false,
        notiz: "Neuer Mitarbeiter"
    ),
    new Mitarbeiter(
        txt_id: 3,
        vorname: "John",
        nachname: "Doe",
        geburtsdatum: new DateTime(1978, 12, 3),
        geschlecht: 1,
        qualifiziert: true,
        notiz: "Langjähriger Mitarbeiter"
    ),
    new Mitarbeiter(
        txt_id: 4,
        vorname: "Jane",
        nachname: "Smith",
        geburtsdatum: new DateTime(1982, 7, 30),
        geschlecht: 2,
        qualifiziert: true,
        notiz: "Teamleiterin"
    ),
    new Mitarbeiter(
        txt_id: 5,
        vorname: "Albert",
        nachname: "Einstein",
        geburtsdatum: new DateTime(1965, 4, 1),
        geschlecht: 1,
        qualifiziert: false,
        notiz: "Experte in der Forschung"
    )
];

        public List<Mitarbeiter> GetAll()
        {
            return MitarbeiterListe;
        }

        public bool IdTaken(int id)
        {
            return GetAll().Any(m => m.Txt_id == id);
        }

        public int GenerateId()
        {
            var allMitarbeiter = GetAll();
            if (allMitarbeiter.Count == 0) return 1;

            return allMitarbeiter.Max(m => m.Txt_id) + 1;
        }

        public Mitarbeiter? GetByID(int id)
        {
            return MitarbeiterListe.FirstOrDefault(m => m.Txt_id == id);
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
