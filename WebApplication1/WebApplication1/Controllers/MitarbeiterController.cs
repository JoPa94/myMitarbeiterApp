using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using WebApplication1.Models;
using WebApplication1.Services;
using webAppServer.Data;

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
        public async Task<ActionResult<IEnumerable<Mitarbeiter>>> GetAll()
        {
            try
            {
                var mitarbeiter = await _mitarbeiterService.GetAll();
                return Ok(mitarbeiter);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult>GetById(int id)
        {
            _logger.LogInformation("GetById method called with id: {id}", id);
            var mitarbeiter = await _mitarbeiterService.GetByID(id);

            if (mitarbeiter == null)
            {
                return NotFound();
            }
            return Ok(mitarbeiter);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Mitarbeiter mitarbeiter)
        {
            _logger.LogInformation("Create method called with Id: {mitarbeiterId}", mitarbeiter.Id);
            try
            {
                await _mitarbeiterService.Create(mitarbeiter);
                return CreatedAtAction(nameof(GetById), new { id = mitarbeiter.Id }, mitarbeiter);
                //??? return Ok(); or return(mitarbeiter) instead ?
            }
            catch (Exception)
            {
                return BadRequest(new {title = "Bad Request", status = 400, message = $"Error occurred while creating Mitarbeiter with ID: {mitarbeiter.Id}."});
            }
        }

        [HttpPut]
        public async Task<ActionResult> Update(Mitarbeiter mitarbeiter)
        {
            _logger.LogInformation("Update method called with id: {id}", mitarbeiter.Id);
            var mitarbeiterUpdated = await _mitarbeiterService.Update(mitarbeiter);

            if (mitarbeiterUpdated != null)
            {
                Console.WriteLine($"Mitarbeiter: {mitarbeiter.Id}, {mitarbeiter.Vorname}, {mitarbeiter.Nachname} angelegt");
                return NoContent();
            }
            return NotFound();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            _logger.LogInformation($"Delete method called with ID: {id}");
            if (await _mitarbeiterService.Delete(id) > 0)
            {
                return Ok(new {title = "Success", status = 200, message = $"Mitarbeiter with ID: {id} successfully deleted." });
            }
            return NotFound(new { title = "Not Found", status = 404 , message = $"Mitarbeiter with ID: {id} not found"});
        }
    }
}
