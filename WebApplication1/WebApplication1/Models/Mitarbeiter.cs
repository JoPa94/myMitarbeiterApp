using Microsoft.EntityFrameworkCore.Metadata.Internal;
using WebApplication1.Services;
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
    public class Mitarbeiter
    {

        [Key]
        public int Id { get; set; }

        public string? Vorname { get; set; }
        public string? Nachname { get; set; }
        public DateTime Geburtsdatum { get; set; }
        public int Geschlecht { get; set; }
        public bool Qualifiziert { get; set; }
        public string? Notiz { get; set; }

    }
}
