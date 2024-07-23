using Microsoft.AspNetCore.Mvc;
using System;
using WebApplication1.Models;
using WebApplication1.Services;
// TODO: put the MitarbeiterListe in the service (See service TODO)
namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MitarbeiterController : ControllerBase
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

        };
        private MitarbeiterService mitarbeiterService;

        public MitarbeiterController(MitarbeiterService mitarbeiterService)
        {
            this.mitarbeiterService = mitarbeiterService;
        }

        // Get all Mitarbeiter
        [HttpGet]
        public IActionResult getAll()
        {
            return Ok(MitarbeiterListe);
        }

        // Get  Mitarbeiter by ID
        [HttpGet("{id}")]
        public IActionResult getById(int id)  
        {
            var mitarbeiter = MitarbeiterListe.FirstOrDefault(m => m.Txt_id == id);
            if (mitarbeiter == null)
            {
                return NotFound();
            }
            return Ok(mitarbeiter);
        }

        [HttpPost]
        public ActionResult<Mitarbeiter> Create(Mitarbeiter mitarbeiter)
        {
            if (MitarbeiterListe.Any(m => m.Txt_id == mitarbeiter.Txt_id))
            {
                return Conflict("Mitarbeiter with this ID already exists.");
            }

            MitarbeiterListe.Add(mitarbeiter);
            return CreatedAtAction(nameof(Create), new { id = mitarbeiter.Txt_id }, mitarbeiter);
        }

        // Update Mitarbeiter data (PUT)
        // TODO: Hide ID, Gender must be Int between 1 and X
        [HttpPut("{id}")]
        public ActionResult Update(int id, Mitarbeiter mitarbeiter)
        {
            var existingMitarbeiter = MitarbeiterListe.FirstOrDefault(m => m.Txt_id == id);
            if (existingMitarbeiter == null)
            {
                return NotFound();
            }

            existingMitarbeiter.Vorname = mitarbeiter.Vorname;
            existingMitarbeiter.Nachname = mitarbeiter.Nachname;
            existingMitarbeiter.Geburtsdatum = mitarbeiter.Geburtsdatum;
            existingMitarbeiter.Geschlecht = mitarbeiter.Geschlecht;
            existingMitarbeiter.Qualifiziert = mitarbeiter.Qualifiziert;
            existingMitarbeiter.Notiz = mitarbeiter.Notiz;

            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var mitarbeiter = MitarbeiterListe.FirstOrDefault(m => m.Txt_id == id);
            if (mitarbeiter == null)
            {
                return NotFound();
            }

            MitarbeiterListe.Remove(mitarbeiter);
            return NoContent();
        }
    }
}
