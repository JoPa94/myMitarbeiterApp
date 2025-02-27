﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
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
            var mitarbeiter = await _mitarbeiterService.GetAll();
            if (mitarbeiter.IsNullOrEmpty())
            {
                return BadRequest(new { title = "Bad Request", status = 400, message = $"Error occurred while fetching all Mitarbeiter." });
            }
            return Ok(mitarbeiter);
        }

        [HttpGet("{id}")]
        public async Task<Mitarbeiter?>GetById(int id)
        {
            _logger.LogInformation("GetById method called with id: {id}", id);

            var mitarbeiter = await _mitarbeiterService.GetByID(id);
            return mitarbeiter;
        }

        [HttpPost]
        public async Task<IActionResult> Create(Mitarbeiter mitarbeiter)
        {
            _logger.LogInformation("Create method called with Id: {mitarbeiterId}", mitarbeiter.Id);

            return await _mitarbeiterService.Create(mitarbeiter) != null ? CreatedAtAction(nameof(GetById), new { id = mitarbeiter.Id }, mitarbeiter) : BadRequest();
        }

        [HttpPut]
        public async Task<ActionResult> Update(Mitarbeiter mitarbeiter)
        {
            _logger.LogInformation("Update method called with id: {id}", mitarbeiter.Id);
            var mitarbeiterUpdated = await _mitarbeiterService.Update(mitarbeiter);

            if (mitarbeiterUpdated != null)
            {
                return Ok(new { title = "Success", status = 200, message = $"Mitarbeiter with ID: {mitarbeiter.Id} successfully updated." });
            }
            return NotFound(new { title = "Not Found", status = 404, message = $"Mitarbeiter with ID: {mitarbeiter.Id} not found" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            _logger.LogInformation($"Delete method called with ID: {id}");
            if (await _mitarbeiterService.Delete(id))
            {
                return Ok(new {title = "Success", status = 200, message = $"Mitarbeiter with ID: {id} successfully deleted." });
            }
            return NotFound(new { title = "Not Found", status = 404 , message = $"Mitarbeiter with ID: {id} not found"});
        }
    }
}
