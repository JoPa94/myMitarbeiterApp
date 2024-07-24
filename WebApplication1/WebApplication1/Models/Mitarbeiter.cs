using WebApplication1.Services;

namespace WebApplication1.Models
{
    public class Mitarbeiter
    {
    public int Txt_id { get; set; }
    public string? Vorname { get; set; }
    public string? Nachname { get; set; }
    public DateTime Geburtsdatum { get; set; }
    public int Geschlecht { get; set; }
    public bool Qualifiziert { get; set; }
    public string? Notiz { get; set; }

    public Mitarbeiter(int txt_id = 0, string? vorname = null, string? nachname = null, DateTime geburtsdatum = new DateTime(), int geschlecht = 0, bool qualifiziert = false, string? notiz = null) =>
        (Txt_id, Vorname, Nachname, Geburtsdatum, Geschlecht, Qualifiziert, Notiz) = (txt_id, vorname, nachname, geburtsdatum, geschlecht, qualifiziert, notiz);
    }
}
