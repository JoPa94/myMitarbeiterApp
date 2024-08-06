import { cls_inputform } from "./cls_inputform.js";

ej.base.enableRipple(true);
let gridId = '#Grid';

$(document).ready((args) => {
    init();
});

export const genders = [
    { Id: 1, Gender: 'Männlich' },
    { Id: 2, Gender: 'Weiblich' },
    { Id: 3, Gender: 'Anderes' },
];

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

export async function deleteMitarbeiter(id) {
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

export async function init() {
    await loadLocales();
    new cls_inputform(gridId);
}
