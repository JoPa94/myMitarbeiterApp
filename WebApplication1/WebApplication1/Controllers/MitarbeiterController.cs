using Microsoft.AspNetCore.Mvc;
using System;
using WebApplication1.Models;
using WebApplication1.Services;
namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MitarbeiterController : ControllerBase
    {
        private MitarbeiterService mitarbeiterService;

        public MitarbeiterController(MitarbeiterService mitarbeiterService)
        {
            this.mitarbeiterService = mitarbeiterService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(mitarbeiterService.GetAll());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)  
        {
            var mitarbeiter = mitarbeiterService.GetAll().FirstOrDefault(m => m.Txt_id == id);
            if (mitarbeiter == null)
            {
                return NotFound();
            }
            return Ok(mitarbeiter);
        }

        [HttpPost]
        public ActionResult<Mitarbeiter> Create(Mitarbeiter mitarbeiter)
        {
            if (mitarbeiterService.GetAll().Any(m => m.Txt_id == mitarbeiter.Txt_id))
            {
                return Conflict("Mitarbeiter with this ID already exists.");
            }

            mitarbeiterService.GetAll().Add(mitarbeiter);
            return CreatedAtAction(nameof(Create), new { id = mitarbeiter.Txt_id }, mitarbeiter);
        }

        [HttpPut("{id}")]
        public ActionResult Update(int id, Mitarbeiter mitarbeiter)
        {
            var existingMitarbeiter = mitarbeiterService.GetAll().FirstOrDefault(m => m.Txt_id == id);
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
            var mitarbeiter = mitarbeiterService.GetAll().FirstOrDefault(m => m.Txt_id == id);
            if (mitarbeiter == null)
            {
                return NotFound();
            }
            mitarbeiterService.GetAll().Remove(mitarbeiter);
            return NoContent();
        }
    }
}
