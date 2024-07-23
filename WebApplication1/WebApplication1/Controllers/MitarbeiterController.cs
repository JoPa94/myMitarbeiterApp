using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MitarbeiterController : ControllerBase
    {
        private readonly MitarbeiterService _mitarbeiterService;
        private readonly ILogger<MitarbeiterController> _logger;

        public MitarbeiterController(MitarbeiterService mitarbeiterService, ILogger<MitarbeiterController> logger)
        {
            _mitarbeiterService = mitarbeiterService;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var result = _mitarbeiterService.GetAll();
            
            var resultString = string.Join(", ", result.Select(m => $"ID: {m.Txt_id}, Name: {m.Vorname} {m.Nachname}"));
            _logger.LogInformation("GetAll result: {Result}", resultString); return Ok(result);
        }

        [HttpGet("{id}")]   // Endpoint not useable from client (Use Swagger if debugging)
        public IActionResult GetById(int id)
        {
            _logger.LogInformation("GetById method called with id: {id}", id);
            var mitarbeiter = _mitarbeiterService.GetAll().FirstOrDefault(m => m.Txt_id == id);
            if (mitarbeiter == null)
            {
                return NotFound();
            }
            return Ok(mitarbeiter);
        }

        [HttpPost]
        public ActionResult<Mitarbeiter> Create(Mitarbeiter mitarbeiter) // FIXME: Does't work from client, but from swagger
        {
            _logger.LogInformation("Create method called with data: {mitarbeiter}", mitarbeiter);
            if (_mitarbeiterService.GetAll().Any(m => m.Txt_id == mitarbeiter.Txt_id))
            {
                return Conflict("Mitarbeiter with this ID already exists.");
            }

            _mitarbeiterService.GetAll().Add(mitarbeiter); // FIXME?: Correct?
            return CreatedAtAction(nameof(Create), new { id = mitarbeiter.Txt_id }, mitarbeiter);
        }

        [HttpPut("{id}")]
        public ActionResult Update(int id, Mitarbeiter mitarbeiter)
        {
            _logger.LogInformation("Update method called with id: {id}", id);
            var existingMitarbeiter = _mitarbeiterService.GetAll().FirstOrDefault(m => m.Txt_id == id);
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
            _logger.LogInformation("Delete method called with id: {id}", id);
            var mitarbeiter = _mitarbeiterService.GetAll().FirstOrDefault(m => m.Txt_id == id);
            if (mitarbeiter == null)
            {
                return NotFound();
            }
            _mitarbeiterService.GetAll().Remove(mitarbeiter);
            return NoContent();
        }
    }
}
