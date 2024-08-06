import { createControls, populateData } from "./ctl_inputform.js";
// TODO: CTL die das ganze eingabeformular zusammenfasst (Init ruft form auf) divid übergeben (Id in die das ctl geschrieben werden soll)
// TODO: Sidebar controlls zum überliegendem Element, ctlinput kümmert sich nur um Input und Grid
// TODO: Use sidebare.close instead of eventhandler

// Grid in CTL, DivID #sidebar wird mit $(this.divid) verwendet um das grid zu verwenden
// ???: An Klasse übergeben; Div ID, Sidebar (Element),xGrid, Datarow X

export class cls_sidebar {
    constructor(sidebarId, datarow) {
        this.sidebarId = sidebarId;
        this.datarow = datarow;
        this.sidebarInit();
    }

    sidebarInit() {
        this.loadHTML().then(() => {
            createControls();
            populateData(this.datarow);
            this.createSidebar();
        });
    }

    async loadHTML() { 
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

    destroy() {     //TODO: Destroy the object, after the sidebar is fully closed
        $(this.sidebarId).html("");
        this.sidebar.destroy();
        console.log("Sidebar and controls destroyed");
    }
    sidebar() {
        this.sidebar.close = () => {
            this.destory()
        }
    }
}

// außerhalb der Klasse das Sidebar closevent erstellen

// export class StringbuilderFormatDto {
//     constructor(values) {
//         let defaults = $.extend({}, {
//             id: 0,
//             stringbuilderId: 0,
//             field: '',
//             format: '',
//         }, values);

//         this.id = defaults.id;
//         this.stringbuilderId = defaults.stringbuilderId;
//         this.field = defaults.field;
//         this.format = defaults.format;
//     }
// }
