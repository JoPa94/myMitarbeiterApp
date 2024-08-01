import { Mitarbeiter } from "./mitarbeiter.js";
import { grid, getData } from "./script.js";
export let idTextBox, vornameTextBox, nachnameTextBox, notizRte, datepicker, comboBox, checkbox, formObject;

export let sidebar;

export const genders = [
    { Id: 1, Gender: 'Männlich' },
    { Id: 2, Gender: 'Weiblich' },
    { Id: 3, Gender: 'Anderes' },
];

export async function createSidebar(rowData) {
    await loadHTML();
    createControlls();
    if (rowData != undefined) {
        idTextBox.value = rowData.id;
        vornameTextBox.value = rowData.vorname
        nachnameTextBox.value = rowData.nachname
        datepicker.value = rowData.geburtsdatum
        const gender = genders.find(g => g.Id === rowData.geschlecht);
        comboBox.value = gender.Id;
        checkbox.checked = rowData.qualifiziert
        notizRte.value = rowData.notiz
    }
}

export async function createControlls() {
    $('#clear').on('click', clearForm);
    $('#save').on('click', saveData);
    // Initialize TextBox elements
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
    let options = {
        rules: {
            'vorname': { required: true, regex: '^[a-zA-Z\\s-]+$' },
            'nachname': { required: true, regex: '^[a-zA-Z\\s-]+$' },
            'geburtsdatum': { required: true },
            'geschlecht': { required: true },
        }
    };
    // Initialize Sidebar
    sidebar = new ej.navigations.Sidebar({
        showBackdrop: true,
        type: "Push",
        position: 'Right',
        width: '60%'
    });
    // sidebar.addEventListener('created', () => {
    //     console.log("Sidebar created")
    // });
    sidebar.appendTo('#sidebar'); sidebar.show();
    formObject = await new ej.inputs.FormValidator('#myForm', options);
}
// Button functions
export function clearForm() {
    $('#myForm')[0].reset();

    sidebar.addEventListener('destroyed', () => {
        console.log("Sidebar destroyed")
    });

    sidebar.addEventListener('close', () => {
        console.log("Sidebar closed")
    });

    sidebar.addEventListener('change', () => {
        console.log("Sidebar changed")
        $('#sidebar').html("");
        sidebar.destroy();
    });
    sidebar.hide();
}

export async function saveData() {
    if (formObject.validate()) {
        let exists = await mitarbeiterExists(parseInt(idTextBox.value));
        let mitarbeiter = new Mitarbeiter(parseInt(idTextBox.value), vornameTextBox.value, nachnameTextBox.value, datepicker.value, parseInt(comboBox.value), checkbox.checked, notizRte.getText());
        if (exists) {
            try {   // UPDATE
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
        } else {    // CREATE
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
        grid.dataSource = await getData(); // TODO: Update Grid manually
        grid.refresh();
        clearForm();
    }
}

export async function mitarbeiterExists(txt_id) {   //If Mitarbeiter exists 200 will be returned, if not 204 (Not content) is returned
    const url = `https://localhost:7155/Mitarbeiter/${txt_id}`;
    try {
        const response = await fetch(url);
        if (response.status != 204) {
            return true;
        }

    } catch (error) {
        console.error('Failed to fetch data (Employee may not exist):', error.message);
    }
    return false;
}

async function loadHTML() {
    $('#sidebar').html("");
    try {
        const response = await $.get('../ctl_inputform.html');
        $('#sidebar').append(response);
    } catch (error) {
        console.error('Failed to load HTML:', error);
    }
}