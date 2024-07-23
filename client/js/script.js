let selectedRecord = null;
ej.base.enableRipple(true);
import { Mitarbeiter } from "./mitarbeiter.js";

// TODO: Update and ID logic in API
// TODO: Jquery obj erstellen mit id vom button (.on)

let idTextBox, vornameTextBox, nachnameTextBox, notizRte, datepicker, comboBox, checkbox, grid, data, formObject;

const genders = [
    { Id: 1, Gender: 'Männlich' },
    { Id: 2, Gender: 'Weiblich' },
    { Id: 3, Gender: 'Anderes' },
];

//  FormValidator
let customFn = (args) => {
    return args['value'].length >= 5;
};

function editRowData(rowData) {
    idTextBox.value = rowData.txt_id;
    vornameTextBox.value = rowData.vorname;
    nachnameTextBox.value = rowData.nachname;
    datepicker.value = new Date(rowData.geburtsdatum);
    comboBox.value = rowData.geschlecht;
    checkbox.checked = rowData.qualifiziert;
    notizRte.value = rowData.notiz;
}

// Button functions
export function clearForm() {
    document.getElementById('myForm').reset();
}

export async function saveData() {
    if (formObject.validate()) {
    const id = idTextBox.value;
    const vorname = vornameTextBox.value;
    const nachname = nachnameTextBox.value;
    const geburtsdatum = datepicker.value;
    const geschlecht = parseInt(comboBox.value);
    const qualifiziert = checkbox.checked;
    const notiz = notizRte.getText();
    data = await getData();
    let mitarbeiter = data.find(m => m.txt_id == id);

    if (mitarbeiter) {
        mitarbeiter.vorname = vorname;
        mitarbeiter.nachname = nachname;
        mitarbeiter.geburtsdatum = geburtsdatum;
        mitarbeiter.geschlecht = geschlecht;
        mitarbeiter.qualifiziert = qualifiziert;
        mitarbeiter.notiz = notiz;

        try {
            const response = await fetch(`https://localhost:7155/Mitarbeiter/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mitarbeiter)
            });

            if (!response.ok) {
                throw new Error(`Error updating employee: ${response.status}`);
            }

            const updatedEmployee = await response.json();
            console.error('Employee updated:', updatedEmployee)
        } catch (error) {
            console.log('Error updating employee:', error);
        }
    } else {
        mitarbeiter = new Mitarbeiter(id, vorname, nachname, geburtsdatum, geschlecht, qualifiziert, notiz);
        console.log(mitarbeiter)
        try {
            const response = await fetch("https://localhost:7155/Mitarbeiter", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mitarbeiter)
            });

            if (!response.ok) {
                throw new Error(`Error creating employee: ${response.status}`);
            }

        } catch (error) {
            console.error('Error creating employee:', error);
        }
    }
    grid.dataSource = await getData(); // Update the grid data source
    grid.refresh();
    clearForm();
    }
}

export async function getData() {
    const url = "https://localhost:7155/Mitarbeiter";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error.message);
    }
    return [];
}

export async function init() {
    await loadLocales()
    createGrid();
    createControlls();
}

async function loadLocales() {
    var calendarData, currenciesData, numberSystemData, numbersData, timeZoneNamesData;

    ej.base.L10n.load({
        'de': {
            'dropdowns': {
                'noRecordsTemplate': "Kein Datensatz gefunden",
                'actionFailureTemplate': "Fehler beim Abrufen der Daten"
            },
            'grid': {
                'Edit': 'Bearbeiten',
                'Delete': 'Löschen',
                'EmptyRecord': 'Keine Datensätze gefunden',
            },
            'datepicker': {
                'day': 'Tag',
                'month': 'Monat',
                'year': 'Jahr',
                'date': 'Datum'
            }
        }
    });

    await new ej.base.Ajax('./json/ca-gregorian.json', 'GET', true).send().then(function (result) {
        calendarData = JSON.parse(result);
    });
    await new ej.base.Ajax('./json/currencies.json', 'GET', true).send().then(function (result) {
        currenciesData = JSON.parse(result);
    });
    await new ej.base.Ajax('./json/numberingSystems.json', 'GET', true).send().then(function (result) {
        numberSystemData = JSON.parse(result);
    });
    await new ej.base.Ajax('./json/numbers.json', 'GET', true).send().then(function (result) {
        numbersData = JSON.parse(result);
    });
    await new ej.base.Ajax('./json/timeZoneNames.json', 'GET', true).send().then(function (result) {
        timeZoneNamesData = JSON.parse(result);
        ej.base.loadCldr(calendarData, currenciesData, numberSystemData, numbersData, timeZoneNamesData);
        ej.base.setCulture('de');
        ej.base.setCurrencyCode('EUR');
    });

}

function createControlls() {
    let options = {
        rules: {
            'vorname': { required: true, regex: '^[a-zA-Z\\s-]+$' },
            'nachname': { required: true, regex: '^[a-zA-Z\\s-]+$' },
            'geburtsdatum': { required: true },
            'geschlecht': { required: true },
        }
    };

    formObject = new ej.inputs.FormValidator('#myForm', options);
    // Initialize TextBox elements
    idTextBox = new ej.inputs.TextBox({
        placeholder: 'id',
        floatLabelType: 'Auto',
    });
    idTextBox.appendTo('#txt_id');

    vornameTextBox = new ej.inputs.TextBox({
        placeholder: 'Vorname',
        floatLabelType: 'Auto',
    });
    vornameTextBox.appendTo('#vorname');

    nachnameTextBox = new ej.inputs.TextBox({
        placeholder: 'Nachname',
        floatLabelType: 'Auto',
    });
    nachnameTextBox.appendTo('#nachname');

    // Initialize RichTextEditor
    notizRte = new ej.richtexteditor.RichTextEditor({
        placeholder: 'Ihre Notizen hier...',
        height: 180,
        maxLength: 200,
        inlineMode: {
            enable: true,
            onSelection: true
        }
    });
    notizRte.appendTo('#notiz');

    // Initialize DatePicker
    datepicker = new ej.calendars.DatePicker({
        // locale: 'de',
        // maskPlaceholder: {day: 'd', month: 'M', year: 'y'},
        placeholder: 'Geburtsdatum',
        enableMask: true,
        format: 'dd/MM/yyyy',
        max: new Date(),
    });
    datepicker.appendTo('#geburtsdatum');

    // Initialize ComboBox
    comboBox = new ej.dropdowns.ComboBox({
        placeholder: "Geschlecht",
        allowCustom: false,
        autofill: true,
        locale: 'de',
        dataSource: genders,
        fields: { text: 'Gender', value: 'Id' },
    });
    comboBox.appendTo('#geschlecht');

    // Initialize CheckBox
    checkbox = new ej.buttons.CheckBox({ label: 'Qualifiziert', labelPosition: 'Before' });
    checkbox.appendTo('#qualifiziert');
}

async function createGrid() {
    data = await getData();
    data = data.map(x => {
        x.geburtsdatum = new Date(x.geburtsdatum)
        return x;
    });
    grid = new ej.grids.Grid({
        dataSource: data,
        toolbar: ['Delete', 'Edit'],
        editSettings: { allowEditing: true, allowDeleting: true },
        locale: 'de',
        columns: [
            { field: 'txt_id', headerText: 'ID', width: 60, type: 'number', isPrimaryKey: true, visible: false },
            { field: 'vorname', headerText: 'Vorname', width: 140, type: 'string', textAlign: 'Center', validationRules: { required: true } },
            { field: 'nachname', headerText: 'Nachname', width: 140, type: 'string', textAlign: 'Center', validationRules: { required: true } },
            {
                field: 'geburtsdatum', headerText: 'Geburtsdatum', width: 100, format: { type: 'date', format: 'dd/MM/yyyy' }, textAlign: 'Center', validationRules: { required: true }, edit: {
                    params: {
                        format: 'dd/MM/yyyy',
                        max: new Date(),
                        min: new Date(1, 1, 1900)
                    }
                }
            },
            {
                field: 'geschlecht',
                headerText: 'Geschlecht',
                width: 100,
                textAlign: 'center',
                foreignKeyField: 'Id',          // Das Feld, das den Fremdschlüssel enthält
                dataSource: genders,            // Die Datenquelle
                foreignKeyValue: 'Gender',      // Der Fremdschlüsselwert
            },
            { headerText: 'Qualifiziert', width: 100, textAlign: 'Center', template: '#qualifiziertCheckbox' },
            { field: 'notiz', headerText: 'Notiz', width: 140, type: 'string' }
        ],
        allowPaging: true,
        pageSettings: { currentPage: 1, pageSize: 5, pageCount: 4, pageSizes: true },
    });
    grid.appendTo('#Grid');

    // Event listener for beginEdit
    grid.addEventListener('actionBegin', async function (args) {
        if (args.requestType === 'beginEdit') {
            selectedRecord = args.rowData;
            editRowData(selectedRecord);
            args.cancel = true;  // Cancel the default editing behavior
        }

        if (args.requestType === 'delete') {
            selectedRecord = args.data[0];
            await deleteMitarbeiter(selectedRecord.txt_id);
            grid.refresh();
        }
    });

    let toolbar = grid.element.querySelector('.e-toolbar');
    grid.element.appendChild(toolbar);
}

async function deleteMitarbeiter(id) {
    try {
        const response = await fetch(`https://localhost:7155/Mitarbeiter/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`Error deleting employee: ${response.status}`);
        }

        const deleteEmployee = await response.json();
        console.log('Employee deleted:', deleteEmployee);

    } catch (error) {
        console.error('Error updating employee:', error);
    }
}

// document.addEventListener('DOMContentLoaded', init);
