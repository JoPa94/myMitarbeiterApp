import { createControls, createGrid } from "./ctl_inputform.js";

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
        this.gridId = gridId.startsWith('#') ? gridId : '#' + gridId;

        this.init();
    }

    async init() {
        await createGrid();
        createControls();
    }
}

