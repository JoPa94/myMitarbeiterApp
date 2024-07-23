using WebApplication1.Models;

namespace WebApplication1.Services
{
    public class MitarbeiterService
    {
        private static List<Mitarbeiter> MitarbeiterListe = new List<Mitarbeiter>
        {
            new Mitarbeiter
            {
                Txt_id = 1,
                Vorname = "Max",
                Nachname = "Mustermann",
                Geburtsdatum = new DateTime(1985, 5, 14),
                Geschlecht = 1,
                Qualifiziert = true,
                Notiz = "Erfahrener Mitarbeiter"
            },
            new Mitarbeiter
            {
                Txt_id = 2,
                Vorname = "Erika",
                Nachname = "Musterfrau",
                Geburtsdatum = new DateTime(1990, 8, 22),
                Geschlecht = 2,
                Qualifiziert = false,
                Notiz = "Neuer Mitarbeiter"
            },
            new Mitarbeiter
            {
                Txt_id = 3,
                Vorname = "John",
                Nachname = "Doe",
                Geburtsdatum = new DateTime(1978, 12, 3),
                Geschlecht = 1,
                Qualifiziert = true,
                Notiz = "Langjähriger Mitarbeiter"
            },
            new Mitarbeiter
            {
                Txt_id = 4,
                Vorname = "Jane",
                Nachname = "Smith",
                Geburtsdatum = new DateTime(1982, 7, 30),
                Geschlecht = 2,
                Qualifiziert = true,
                Notiz = "Teamleiterin"
            },
            new Mitarbeiter
            {
                Txt_id = 5,
                Vorname = "Albert",
                Nachname = "Einstein",
                Geburtsdatum = new DateTime(1965, 4, 1),
                Geschlecht = 1,
                Qualifiziert = false,
                Notiz = "Experte in der Forschung"
            }

        };  // TODO: Simplyfy the new Mitarbeiter expression

        public List<Mitarbeiter> GetAll()
        {
            return MitarbeiterListe;
        }

        public Mitarbeiter? GetByID(int id)
        {
            return MitarbeiterListe.FirstOrDefault(m => m.Txt_id == id);
        }

        public void Add(Mitarbeiter mitarbeiter)
        {
            MitarbeiterListe.Add(mitarbeiter);
        }

        public bool Update(int id, Mitarbeiter mitarbeiter)
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
