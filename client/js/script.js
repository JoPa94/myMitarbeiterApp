// TODO: REFACTOR Edit Button in grid, to open the Sidebar (InputForm) with data
// TODO Refresh the Grid after the Sidebar is closed (Use the data from the Grid, no extra API calls) (An edit das Grid übergeben)
// TODO Call destory() after use of Sideabar ($(id).off(click) or PREF -> $(id).one(click))

// TODO: CTL die das ganze eingabeformular zusammenfasst (Init ruft form auf) divid übergeben (Id in die das ctl geschrieben werden soll)
// TODO  HTML von div id auf nichts setzen -> 
// TODO: An Klasse übergeben; Div ID, SIdebar (Element), Grid?, Datarow or null,

// in form()
//         $(this.divid).html('');
//         await fetch('/app/myjugendhilfe/ctl/ctl_leistungsnachweis_edit.html')
//             .then(x => x.text())
//             .then(html => {
//                 $(this.divid).append(html);

import { createControlls, genders, sidebar } from "./ctl_inputform.js";
ej.base.enableRipple(true);
let data, grid;
let selectedRecord = null;

// functions
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

export async function getData() {
    const url = "https://localhost:7155/Mitarbeiter";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch data:', error.message);
    }
    return [];
}

async function createGrid() {
    data = await getData();
    data = data.map(x => {
        x.geburtsdatum = new Date(x.geburtsdatum)
        return x;
    });
    grid = new ej.grids.Grid({
        dataSource: data,
        toolbar: ['Delete', 'Edit', 'Add'],
        editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Dialog'},
        columns: [
            { field: 'id', headerText: 'ID', width: 60, type: 'number', isPrimaryKey: true, visible: false },
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
                foreignKeyField: 'Id',
                dataSource: genders,
                foreignKeyValue: 'Gender',
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
            await deleteMitarbeiter(selectedRecord.id);
            grid.refresh();
        }
        if (args.requestType === 'add') {
            args.cancel = true;     // Cancel the default add behavior
            await loadHTML();
            createControlls(); 
            sidebar.show(); 
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
    } catch (error) {
        console.error('Error updating employee:', error);
    }
}

function editRowData(rowData) {
    idTextBox.value = rowData.id;
    vornameTextBox.value = rowData.vorname;
    nachnameTextBox.value = rowData.nachname;
    datepicker.value = new Date(rowData.geburtsdatum);
    comboBox.value = rowData.geschlecht;
    checkbox.checked = rowData.qualifiziert;
    notizRte.value = rowData.notiz;
}

$(document).ready((args) => {
    init();
});

export async function init() {
    await loadLocales();
    await loadHTML();
    createGrid();
    createControlls();
}



// Close the sidebar
// $('close').on('click', () => {
//     sidebar.hide();
// })

async function loadHTML() {
    $('#sidebar').html("");
    try {
        const response = await $.get('../ctl_inputform.html');
        $('#sidebar').append(response);
    } catch (error) {
        console.error('Failed to load HTML:', error);
    }
}

// Neues JS file für ctl_input Klasse erstellen div id übergeben die in Klasse soll (sidebar) klasse erstellt das HTML und zeigt es an ...