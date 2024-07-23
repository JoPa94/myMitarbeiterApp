namespace WebApplication1.Models
{
    public class Mitarbeiter
    {
        public int Txt_id { get; set; }
        public string Vorname { get; set; }
        public string Nachname { get; set; }
        public DateTime Geburtsdatum { get; set; }
        public int Geschlecht { get; set; }
        public bool Qualifiziert { get; set; }
        public string Notiz { get; set; }
    }

}
