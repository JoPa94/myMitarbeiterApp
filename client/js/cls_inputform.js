import { Mitarbeiter } from "./mitarbeiter.js";
// TODO: CTL die das ganze eingabeformular zusammenfasst (Init ruft form auf) divid übergeben (Id in die das ctl geschrieben werden soll)
// TODO: Sidebar controlls zum überliegendem Element, ctlinput kümmert sich nur um Input und Grid
// TODO: Use sidebare.close instead of eventhandler

// Grid in CTL, DivID #sidebar wird mit $(this.divid) verwendet um das grid zu verwenden
// ???: An Klasse übergeben; Div ID, Sidebar (Element),xGrid, Datarow X

export class cls_inputform {
    constructor(data, grid, datarow, genders) {
        this.data = data;
        this.grid = grid;
        this.datarow = datarow;
        this.genders = genders;
        this.sidebarInit();
    }

    sidebarInit() {
        this.loadHTML().then(() => {
            this.createControls();
            this.populateData();
            this.createSidebar();
        });
    }

    async loadHTML() { 
        $('#sidebar').html("");
        try {
            const response = await $.get('../ctl_inputform.html');
            $('#sidebar').append(response);
        } catch (error) {
            console.error('Failed to load HTML:', error);
        }
    }

    createControls() {
        this.idTextBox = new ej.inputs.TextBox({
            floatLabelType: 'Auto',
        });
        this.idTextBox.appendTo('#txt_id');

        this.vornameTextBox = new ej.inputs.TextBox({
            placeholder: 'Vorname',
            floatLabelType: 'Auto',
        });
        this.vornameTextBox.appendTo('#vorname');

        this.nachnameTextBox = new ej.inputs.TextBox({
            placeholder: 'Nachname',
            floatLabelType: 'Auto',
        });
        this.nachnameTextBox.appendTo('#nachname');

        this.notizRte = new ej.richtexteditor.RichTextEditor({
            placeholder: 'Ihre Notizen hier...',
            height: 180,
            maxLength: 200,
            inlineMode: {
                enable: true,
                onSelection: true
            }
        });
        this.notizRte.appendTo('#notiz');

        this.datepicker = new ej.calendars.DatePicker({
            placeholder: 'Geburtsdatum',
            enableMask: true,
            format: 'dd/MM/yyyy',
            max: new Date(),
        });
        this.datepicker.appendTo('#geburtsdatum');

        this.comboBox = new ej.dropdowns.ComboBox({
            placeholder: "Geschlecht",
            allowCustom: false,
            autofill: true,
            locale: 'de',
            dataSource: this.genders,
            fields: { text: 'Gender', value: 'Id' },
        });
        this.comboBox.appendTo('#geschlecht');

        this.checkbox = new ej.buttons.CheckBox({ label: 'Qualifiziert', labelPosition: 'Before' });
        this.checkbox.appendTo('#qualifiziert');

        // Event listeners for form buttons
        $('#clear').on('click', () => this.clearForm());
        $('#save').on('click', () => this.saveData());

        let options = {
            rules: {
                'vorname': { required: true, regex: '^[a-zA-Z\\s-]+$' },
                'nachname': { required: true, regex: '^[a-zA-Z\\s-]+$' },
                'geburtsdatum': { required: true },
                'geschlecht': { required: true },
            }
        };
        this.formObject = new ej.inputs.FormValidator('#myForm', options);
    }

    createSidebar() {
        this.sidebar = new ej.navigations.Sidebar({
            showBackdrop: true,
            type: "Push",
            position: 'Right',
            width: '60%',
            close: () => this.destroy()
        });
        this.sidebar.appendTo('#sidebar');
        this.sidebar.show();
    }

    populateData() {
        if (this.datarow) {
            this.idTextBox.value = this.datarow.id;
            this.vornameTextBox.value = this.datarow.vorname;
            this.nachnameTextBox.value = this.datarow.nachname;
            this.datepicker.value = this.datarow.geburtsdatum;
            const gender = this.genders.find(g => g.Id === this.datarow.geschlecht);
            this.comboBox.value = gender ? gender.Id : null;
            this.checkbox.checked = this.datarow.qualifiziert;
            this.notizRte.value = this.datarow.notiz;
        }
    }

    clearForm() {
        $('#myForm')[0].reset();
        this.sidebar.hide();
    }

    async saveData() {
        if (this.formObject.validate()) {
            const exists = await this.mitarbeiterExists(parseInt(this.idTextBox.value));
            const mitarbeiter = new Mitarbeiter(parseInt(this.idTextBox.value), this.vornameTextBox.value, this.nachnameTextBox.value, this.datepicker.value, parseInt(this.comboBox.value), this.checkbox.checked, this.notizRte.getText());

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
                const updatedEmployee = this.data.find(item => item.id === mitarbeiter.id);
                if (updatedEmployee) {
                    Object.assign(updatedEmployee, mitarbeiter);
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
                    this.data.push(await response.json());

                } catch (error) {
                    console.error('Error creating employee:', error);
                }
            }
            this.grid.refresh();
            this.clearForm();
        }
    }

    async mitarbeiterExists(txt_id) {
        const url = `https://localhost:7155/Mitarbeiter/${txt_id}`;
        try {
            const response = await fetch(url);
            return response.status !== 204;
        } catch (error) {
            console.error('Failed to fetch data (Employee may not exist):', error.message);
        }
        return false;
    }

    destroy() {     //TODO: Destroy the object, after the sidebar is fully closed
        this.idTextBox.destroy();
        this.vornameTextBox.destroy();
        this.nachnameTextBox.destroy();
        this.notizRte.destroy();
        this.datepicker.destroy();
        this.comboBox.destroy();
        this.checkbox.destroy();

        $('#sidebar').html("");
        this.sidebar.destroy();
        console.log("Sidebar and controls destroyed");
    }
    sidebar() {
        this.sidebar.close = () => {
            this.destory()
        }
    }
    // destory() {
    //     this.checkbox.destory()
    //     // Nur elemente in der Sidebar destoryen (Nicht die Sidebar)
    // }

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
