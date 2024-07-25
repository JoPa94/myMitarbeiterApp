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

        public Mitarbeiter(int id = 0, string? vorname = null, string? nachname = null, DateTime geburtsdatum = new DateTime(), int geschlecht = 0, bool qualifiziert = false, string? notiz = null) =>
            (Id, Vorname, Nachname, Geburtsdatum, Geschlecht, Qualifiziert, Notiz) = (id, vorname, nachname, geburtsdatum, geschlecht, qualifiziert, notiz);
        }
}
