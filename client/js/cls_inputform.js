import { getData, genders, deleteMitarbeiter } from "./script.js";
import { cls_sidebar } from "./cls_sidebar.js";
import { createControls } from "./ctl_inputform.js";

export class cls_inputform {
    constructor(gridId) {
        this.selectedRecord = null;
        this.data = null; 
        this.grid = null; 
        this.sidebarObj = null;  
        this.idTextBox = null; 
        this.vornameTextBox = null; 
        this.nachnameTextBox = null; 
        this.notizRte = null; 
        this.datepicker = null; 
        this.comboBox = null; 
        this.checkbox = null; 
        this.formObject = null; 
        this.gridId = gridId;

        this.init();
    }

    async init() {
        await this.createGrid();
        createControls();
    }

    async createGrid() {
        this.data = await getData();
        this.data = this.data.map(x => {
            x.geburtsdatum = new Date(x.geburtsdatum);
            return x;
        });

        this.grid = new ej.grids.Grid({
            dataSource: this.data,
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

        this.grid.appendTo('#Grid');

        // Event listener for beginEdit
        this.grid.addEventListener('actionBegin', async (args) => {
            if (args.requestType === 'beginEdit') {
                args.cancel = true;  // Cancel the default editing behavior
                this.sidebarObj = new cls_sidebar('#sidebar', args.rowData);
            }
            if (args.requestType === 'delete') {
                this.selectedRecord = args.data[0];
                await deleteMitarbeiter(this.selectedRecord.id);
                this.grid.refresh();
            }

            if (args.requestType === 'add') {
                args.cancel = true;     // Cancel the default add behavior
                this.sidebarObj = new cls_sidebar('#sidebar', null);
            }
        });

        let toolbar = this.grid.element.querySelector('.e-toolbar');
        this.grid.element.appendChild(toolbar);
    }

    populateData(datarow) {
        if (datarow) {
            this.idTextBox.value = datarow.id;
            this.vornameTextBox.value = datarow.vorname;
            this.nachnameTextBox.value = datarow.nachname;
            this.datepicker.value = datarow.geburtsdatum;
            const gender = genders.find(g => g.Id === datarow.geschlecht);
            this.comboBox.value = gender ? gender.Id : null;
            this.checkbox.checked = datarow.qualifiziert;
            this.notizRte.value = datarow.notiz;
        }
    }

    async saveData() {
        if (this.formObject.validate()) {
            const exists = await this.mitarbeiterExists(parseInt(this.idTextBox.value));
            const mitarbeiter = new Mitarbeiter(
                parseInt(this.idTextBox.value),
                this.vornameTextBox.value,
                this.nachnameTextBox.value,
                this.datepicker.value,
                parseInt(this.comboBox.value),
                this.checkbox.checked,
                this.notizRte.getText()
            );

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

    clearForm() {
        $('#myForm')[0].reset();
        this.sidebarObj.destroy();
    }
}

