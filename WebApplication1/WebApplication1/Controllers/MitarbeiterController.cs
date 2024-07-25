﻿using Microsoft.AspNetCore.Mvc;
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
                throw;  // Will ich throwen?
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult>GetById(int id)
        {
            try
            {
                _logger.LogInformation("GetById method called with id: {id}", id);
                var mitarbeiter = await _mitarbeiterService.GetByID(id);
                if(mitarbeiter == null) return NotFound();
                return Ok(mitarbeiter);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPost]
        public void Create(Mitarbeiter mitarbeiter)
        {
            _logger.LogInformation("Create method called with Id: {mitarbeiter}", mitarbeiter.Id);
            _mitarbeiterService.Create(mitarbeiter);

        }       //TODO: SWagger works, but client not!

        //[HttpPut("{id}")]
        //public ActionResult Update(int id, Mitarbeiter mitarbeiter)
        //{
        //    _logger.LogInformation("Update method called with id: {id}", id);
        //    bool mitarbeiterUpdated = _mitarbeiterService.Update(id, mitarbeiter);

        //    if (mitarbeiterUpdated)     // TODO: Return null/mitarbeiter 
        //    {
        //        return NoContent();
        //    }
        //    return NotFound();
        //}

        //[HttpDelete("{id}")]
        //public ActionResult Delete(int id)
        //{
        //    _logger.LogInformation("Delete method called with id: {id}", id);
        //    var deleted = _mitarbeiterService.Delete(id);
        //    if (deleted)
        //    {
        //        return NoContent();
        //    }
        //    return NotFound(); 
        //}
    }
}
