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
            return Ok(result);
        }

        [HttpGet("{id}")]
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
        public ActionResult<Mitarbeiter> Create(Mitarbeiter mitarbeiter)
        {
            _logger.LogInformation("Create method called with Id: {mitarbeiter}", mitarbeiter.Txt_id);
            if (!_mitarbeiterService.IdTaken(mitarbeiter.Txt_id))
            {
                mitarbeiter.Txt_id = mitarbeiter.Txt_id == 0 ? _mitarbeiterService.GenerateId() : mitarbeiter.Txt_id;
                _mitarbeiterService.GetAll().Add(mitarbeiter);
                return CreatedAtAction(nameof(Create), new { id = mitarbeiter.Txt_id }, mitarbeiter);
            }else
            {
                return Conflict("Mitarbeiter with this ID already exists.");
            }
        }

        [HttpPut("{id}")]
        public ActionResult Update(int id, Mitarbeiter mitarbeiter)
        {
            _logger.LogInformation("Update method called with id: {id}", id);
            bool mitarbeiterUpdated = _mitarbeiterService.Update(id, mitarbeiter);

            if (mitarbeiterUpdated)
            {
                return NoContent();
            }
            return NotFound();
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            _logger.LogInformation("Delete method called with id: {id}", id);
            var deleted = _mitarbeiterService.Delete(id);
            if (deleted)
            {
                return NoContent();
            }
            return NotFound(); 
        }
    }
}
