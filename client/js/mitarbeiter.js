export class Mitarbeiter {
    constructor(id, vorname, nachname, geburtsdatum, geschlecht, qualifiziert, notiz) {
        this.txt_id = id == 0 ? this.generateId() : id;
        this.vorname = vorname;
        this.nachname = nachname;
        this.geburtsdatum = geburtsdatum;
        this.geschlecht = geschlecht;
        this.qualifiziert = qualifiziert;
        this.notiz = notiz;
    }

    generateId() {
        if (data.length === 0) {
            return 1;
        }
        return Math.max(...data.map(m => m.txt_id)) + 1;
    }
}
