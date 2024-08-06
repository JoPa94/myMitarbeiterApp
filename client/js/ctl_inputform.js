import { getData, deleteMitarbeiter, genders } from "./script.js";
import { cls_sidebar } from "./cls_sidebar.js";
import { Mitarbeiter } from "./mitarbeiter.js";
export let idTextBox, vornameTextBox, nachnameTextBox, notizRte, datepicker, comboBox, checkbox, formObject, sidebar, data, grid;
let selectedRecord = null;

export async function createGrid() {
    data = await getData();
    data = data.map(x => {
        x.geburtsdatum = new Date(x.geburtsdatum)
        return x;
    });
    grid = new ej.grids.Grid({
        dataSource: data,
        toolbar: ['Delete', 'Edit', 'Add'],
        editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true },
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
        pageSettings: { currentPage: 1, pageSize: 10, pageCount: 5, pageSizes: true },
    });
    grid.appendTo('#Grid');

    // Event listener for beginEdit
    grid.addEventListener('actionBegin', async function (args) {
        if (args.requestType === 'beginEdit') {
            args.cancel = true;  // Cancel the default editing behavior
            selectedRecord = args.rowData;
            // await createSidebar(selectedRecord);
            sidebar = new cls_sidebar('#sidebar', args.rowData);
        }
        if (args.requestType === 'delete') {
            selectedRecord = args.data[0];
            await deleteMitarbeiter(selectedRecord.id);
            grid.refresh();
        }

        if (args.requestType === 'add') {
            args.cancel = true;     // Cancel the default add behavior
            sidebar = new cls_sidebar('#sidebar', null);
        }
    });
    let toolbar = grid.element.querySelector('.e-toolbar');
    grid.element.appendChild(toolbar);
}

export function createControls() {
    idTextBox = new ej.inputs.TextBox({
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

    datepicker = new ej.calendars.DatePicker({
        placeholder: 'Geburtsdatum',
        enableMask: true,
        format: 'dd/MM/yyyy',
        max: new Date(),
    });
    datepicker.appendTo('#geburtsdatum');

    comboBox = new ej.dropdowns.ComboBox({
        placeholder: "Geschlecht",
        allowCustom: false,
        autofill: true,
        locale: 'de',
        dataSource: genders,
        fields: { text: 'Gender', value: 'Id' },
    });
    comboBox.appendTo('#geschlecht');

    checkbox = new ej.buttons.CheckBox({ label: 'Qualifiziert', labelPosition: 'Before' });
    checkbox.appendTo('#qualifiziert');

    // Event listeners for form buttons
    $('#clear').on('click', () => clearForm());
    $('#save').on('click', () => saveData());

    let options = {
        rules: {
            'vorname': { required: true, regex: '^[a-zA-Z\\s-]+$' },
            'nachname': { required: true, regex: '^[a-zA-Z\\s-]+$' },
            'geburtsdatum': { required: true },
            'geschlecht': { required: true },
        }
    };
    formObject = new ej.inputs.FormValidator('#myForm', options);
}

export function populateData(datarow) {
    if (datarow) {
        idTextBox.value = datarow.id;
        vornameTextBox.value = datarow.vorname;
        nachnameTextBox.value = datarow.nachname;
        datepicker.value = datarow.geburtsdatum;
        const gender = genders.find(g => g.Id === datarow.geschlecht);
        comboBox.value = gender ? gender.Id : null;
        checkbox.checked = datarow.qualifiziert;
        notizRte.value = datarow.notiz;
    }
}

async function saveData() {
    if (formObject.validate()) {
        const exists = await mitarbeiterExists(parseInt(idTextBox.value));
        const mitarbeiter = new Mitarbeiter(parseInt(idTextBox.value), vornameTextBox.value, nachnameTextBox.value, datepicker.value, parseInt(comboBox.value), checkbox.checked, notizRte.getText());

        if (exists) {
            try {
                const response = await fetch(`https://localhost:7155/Mitarbeiter`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(mitarbeiter)
                });

                if (!response.ok) {
                    throw new Error(`Error updating employee: ${response.status}`);
                }
            } catch (error) {
                console.error('Error updating employee:', error);
            }
            const updatedEmployee = data.find(item => item.id === mitarbeiter.id);
            if (updatedEmployee) {
                Object.assign(updatedEmployee, mitarbeiter);        //??? WAS DAS
            }
        } else {
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
                data.push(await response.json());

            } catch (error) {
                console.error('Error creating employee:', error);
            }
        }
        grid.refresh();
        clearForm();
    }
}

async function mitarbeiterExists(txt_id) {
    const url = `https://localhost:7155/Mitarbeiter/${txt_id}`;
    try {
        const response = await fetch(url);
        return response.status !== 204;
    } catch (error) {
        console.error('Failed to fetch data (Employee may not exist):', error.message);
    }
    return false;
}

function clearForm() {
    $('#myForm')[0].reset();
    sidebar.destroy();
}


// export class cls_inputform {
//     constructor() {

//         // export let idTextBox, vornameTextBox, nachnameTextBox, notizRte, datepicker, comboBox, checkbox, formObject, sidebar, data, grid;
//         // let selectedRecord = null;
//         this.selectedRecord = null;
//         this.data = null;
//         this.grid = null;
//         this.sidebar = null;
//         this.idTextBox = null;
//         this.vornameTextBox = null;
//         this.nachnameTextBox = null;
//         this.notizRte = null;
//         this.datepicker = null;
//         this.comboBox = null;
//         this.checkbox = null;
//         this.formObject = null;

//         this.init();
//     }

//     async init() {
//         await this.createGrid();
//         this.createControls();
//     }

//     async createGrid() {
//         this.data = await getData();
//         this.data = this.data.map(x => {
//             x.geburtsdatum = new Date(x.geburtsdatum);
//             return x;
//         });

//         this.grid = new ej.grids.Grid({
//             dataSource: this.data,
//             toolbar: ['Delete', 'Edit', 'Add'],
//             editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true },
//             columns: [
//                 { field: 'id', headerText: 'ID', width: 60, type: 'number', isPrimaryKey: true, visible: false },
//                 { field: 'vorname', headerText: 'Vorname', width: 140, type: 'string', textAlign: 'Center', validationRules: { required: true } },
//                 { field: 'nachname', headerText: 'Nachname', width: 140, type: 'string', textAlign: 'Center', validationRules: { required: true } },
//                 {
//                     field: 'geburtsdatum', headerText: 'Geburtsdatum', width: 100, format: { type: 'date', format: 'dd/MM/yyyy' }, textAlign: 'Center', validationRules: { required: true }, edit: {
//                         params: {
//                             format: 'dd/MM/yyyy',
//                             max: new Date(),
//                             min: new Date(1, 1, 1900)
//                         }
//                     }
//                 },
//                 {
//                     field: 'geschlecht',
//                     headerText: 'Geschlecht',
//                     width: 100,
//                     textAlign: 'center',
//                     foreignKeyField: 'Id',
//                     dataSource: genders,
//                     foreignKeyValue: 'Gender',
//                 },
//                 { headerText: 'Qualifiziert', width: 100, textAlign: 'Center', template: '#qualifiziertCheckbox' },
//                 { field: 'notiz', headerText: 'Notiz', width: 140, type: 'string' }
//             ],
//             allowPaging: true,
//             pageSettings: { currentPage: 1, pageSize: 10, pageCount: 5, pageSizes: true },
//         });

//         this.grid.appendTo('#Grid');

//         // Event listener for beginEdit
//         this.grid.addEventListener('actionBegin', async (args) => {
//             if (args.requestType === 'beginEdit') {
//                 args.cancel = true;  // Cancel the default editing behavior
//                 this.selectedRecord = args.rowData;
//                 this.sidebar = new cls_sidebar('#sidebar', args.rowData);
//             }
//             if (args.requestType === 'delete') {
//                 this.selectedRecord = args.data[0];
//                 await deleteMitarbeiter(this.selectedRecord.id);
//                 this.grid.refresh();
//             }

//             if (args.requestType === 'add') {
//                 args.cancel = true;     // Cancel the default add behavior
//                 this.sidebar = new cls_sidebar('#sidebar', null);
//             }
//         });

//         let toolbar = this.grid.element.querySelector('.e-toolbar');
//         this.grid.element.appendChild(toolbar);
//     }

//     createControls() {
//         this.idTextBox = new ej.inputs.TextBox({
//             floatLabelType: 'Auto',
//         });
//         this.idTextBox.appendTo('#txt_id');

//         this.vornameTextBox = new ej.inputs.TextBox({
//             placeholder: 'Vorname',
//             floatLabelType: 'Auto',
//         });
//         this.vornameTextBox.appendTo('#vorname');

//         this.nachnameTextBox = new ej.inputs.TextBox({
//             placeholder: 'Nachname',
//             floatLabelType: 'Auto',
//         });
//         this.nachnameTextBox.appendTo('#nachname');

//         this.notizRte = new ej.richtexteditor.RichTextEditor({
//             placeholder: 'Ihre Notizen hier...',
//             height: 180,
//             maxLength: 200,
//             inlineMode: {
//                 enable: true,
//                 onSelection: true
//             }
//         });
//         this.notizRte.appendTo('#notiz');

//         this.datepicker = new ej.calendars.DatePicker({
//             placeholder: 'Geburtsdatum',
//             enableMask: true,
//             format: 'dd/MM/yyyy',
//             max: new Date(),
//         });
//         this.datepicker.appendTo('#geburtsdatum');

//         this.comboBox = new ej.dropdowns.ComboBox({
//             placeholder: "Geschlecht",
//             allowCustom: false,
//             autofill: true,
//             locale: 'de',
//             dataSource: genders,
//             fields: { text: 'Gender', value: 'Id' },
//         });
//         this.comboBox.appendTo('#geschlecht');

//         this.checkbox = new ej.buttons.CheckBox({ label: 'Qualifiziert', labelPosition: 'Before' });
//         this.checkbox.appendTo('#qualifiziert');

//         // Event listeners for form buttons
//         $('#clear').on('click', () => this.clearForm());
//         $('#save').on('click', () => this.saveData());

//         let options = {
//             rules: {
//                 'vorname': { required: true, regex: '^[a-zA-Z\\s-]+$' },
//                 'nachname': { required: true, regex: '^[a-zA-Z\\s-]+$' },
//                 'geburtsdatum': { required: true },
//                 'geschlecht': { required: true },
//             }
//         };
//         this.formObject = new ej.inputs.FormValidator('#myForm', options);
//     }

//     populateData(datarow) {
//         if (datarow) {
//             this.idTextBox.value = datarow.id;
//             this.vornameTextBox.value = datarow.vorname;
//             this.nachnameTextBox.value = datarow.nachname;
//             this.datepicker.value = datarow.geburtsdatum;
//             const gender = genders.find(g => g.Id === datarow.geschlecht);
//             this.comboBox.value = gender ? gender.Id : null;
//             this.checkbox.checked = datarow.qualifiziert;
//             this.notizRte.value = datarow.notiz;
//         }
//     }

//     async saveData() {
//         if (this.formObject.validate()) {
//             const exists = await this.mitarbeiterExists(parseInt(this.idTextBox.value));
//             const mitarbeiter = new Mitarbeiter(
//                 parseInt(this.idTextBox.value),
//                 this.vornameTextBox.value,
//                 this.nachnameTextBox.value,
//                 this.datepicker.value,
//                 parseInt(this.comboBox.value),
//                 this.checkbox.checked,
//                 this.notizRte.getText()
//             );

//             if (exists) {
//                 try {
//                     const response = await fetch(`https://localhost:7155/Mitarbeiter`, {
//                         method: 'PUT',
//                         headers: {
//                             'Content-Type': 'application/json'
//                         },
//                         body: JSON.stringify(mitarbeiter)
//                     });

//                     if (!response.ok) {
//                         throw new Error(`Error updating employee: ${response.status}`);
//                     }
//                 } catch (error) {
//                     console.error('Error updating employee:', error);
//                 }
//                 const updatedEmployee = this.data.find(item => item.id === mitarbeiter.id);
//                 if (updatedEmployee) {
//                     Object.assign(updatedEmployee, mitarbeiter);
//                 }
//             } else {
//                 try {
//                     const response = await fetch("https://localhost:7155/Mitarbeiter", {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json'
//                         },
//                         body: JSON.stringify(mitarbeiter)
//                     });

//                     if (!response.ok) {
//                         throw new Error(`Error creating employee: ${response.status}`);
//                     }
//                     this.data.push(await response.json());

//                 } catch (error) {
//                     console.error('Error creating employee:', error);
//                 }
//             }
//             this.grid.refresh();
//             this.clearForm();
//         }
//     }

//     async mitarbeiterExists(txt_id) {
//         const url = `https://localhost:7155/Mitarbeiter/${txt_id}`;
//         try {
//             const response = await fetch(url);
//             return response.status !== 204;
//         } catch (error) {
//             console.error('Failed to fetch data (Employee may not exist):', error.message);
//         }
//         return false;
//     }

//     clearForm() {
//         $('#myForm')[0].reset();
//         this.sidebar.destroy();
//     }
// }
