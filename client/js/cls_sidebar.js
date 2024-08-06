import { createControls, populateData } from "./ctl_inputform.js";
// TODO: CTL die das ganze eingabeformular zusammenfasst (Init ruft form auf) divid übergeben (Id in die das ctl geschrieben werden soll)
// TODO: Sidebar controlls zum überliegendem Element, ctlinput kümmert sich nur um Input und Grid

// ???: An Klasse übergeben; Div ID, Sidebar (Element), Grid, Datarow

export class cls_sidebar {
    constructor(sidebarId, datarow, inputForm) {
        this.sidebarId = sidebarId;
        this.datarow = datarow;
        this.inputForm = inputForm;
        this.sidebarInit();
    }

    sidebarInit() {
        this.form().then(() => {
            createControls(this.inputForm);
            populateData(this.datarow);
            this.createSidebar();
        });
    }

    async form() { 
        $(this.sidebarId).html("");
        try {
            const response = await $.get('../ctl_inputform.html');
            $(this.sidebarId).append(response);
        } catch (error) {
            console.error('Failed to load HTML:', error);
        }
    }

    createSidebar() {
        this.sidebar = new ej.navigations.Sidebar({
            showBackdrop: true,
            type: "Push",
            position: 'Right',
            width: '60%',
            close: () => this.destroy()
        });
        this.sidebar.appendTo(this.sidebarId);
        this.sidebar.show();
    }

    destroy() {
        $(this.sidebarId).html("");
        this.sidebar.destroy();
        console.log("Sidebar and controls destroyed");
    }
    
    sidebar() {
        this.sidebar.close = () => {
            destory()
        }
    }
}
