import { getData } from "./script.js";

export class Mitarbeiter {
    constructor(id, vorname, nachname, geburtsdatum, geschlecht, qualifiziert, notiz) {
        this.txt_id = id;
        this.vorname = vorname;
        this.nachname = nachname;
        this.geburtsdatum = geburtsdatum;
        this.geschlecht = geschlecht;
        this.qualifiziert = qualifiziert;
        this.notiz = notiz;
    }
}
