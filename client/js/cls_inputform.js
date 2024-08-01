export class cls_inputform{
    constructor( sidebar, divid, grid, datarow){

    }
    sidebar(){
        this.sidebar.close = () => {
            this.destory()
        }
    }
    destory(){
        this.checkbox.destory()
        // Nur elemente in der Sidebar destoryen (Nicht die Sidebar)
    }
}

// außerhalb der Klasse das Sidebar closevent erstellen 

export class StringbuilderFormatDto {
    constructor(values) {
        let defaults = $.extend({}, {
            id: 0,
            stringbuilderId: 0,
            field: '',
            format: '',
        }, values);

        this.id = defaults.id;
        this.stringbuilderId = defaults.stringbuilderId;
        this.field = defaults.field;
        this.format = defaults.format;
    }
}

// Stringbuilder Example

export class StringbuilderDto {
    constructor(values) {
        let defaults = $.extend({}, {
            id: 0,
            parent: 0,
            parentKey: 0,
            type: null,
            builder: '',
            erstelltAm: new Date(),
            erstelltVon: '',
            erstelltSid: 0,
            stringbuilderFormats: []
        }, values);

        this.id = defaults.id;
        this.parent = defaults.parent;
        this.parentKey = defaults.parentKey;
        this.type = defaults.type;
        this.builder = defaults.builder;
        this.erstelltAm = new Date(defaults.erstelltAm);
        this.erstelltVon = defaults.erstelltVon;
        this.erstelltSid = defaults.erstelltSid;
        this.stringbuilderFormats = defaults.stringbuilderFormats;
    }
}

export function getExampleBuilder() {
    return new StringbuilderDto({
        id: 1,
        parent: 31,
        parentKey: 0,
        type: 10101,
        builder: '†⸸23.Nachname⸸†, †⸸23.Geburtsdatum⸸† †⸸30.Name⸸†', //†⸸23.Nachname⸸†, †⸸23.Vorname⸸† †⸸30.Name⸸†
        erstelltAm: new Date(),
        stringbuilderFormats: [{id: 1, stringbuilderId: 1, field: '23.Geburtsdatum', format: 'dd.MM.yyyy'}]
    });
}
