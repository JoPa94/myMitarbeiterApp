export class cls_sidebar {
    constructor(sidebarId, datarow, inputForm) {
        this.sidebarId = sidebarId;
        this.datarow = datarow;
        this.inputForm = inputForm;
        this.sidebarInit();
    }

    sidebarInit() {
        this.form().then(() => {
            this.inputForm.createControls();
            this.inputForm.populateData(this.datarow);
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

    async destroy() {
        setTimeout(() => {              //???: Besserer weg als timeout?
            $(this.sidebarId).html("");
            this.sidebar.destroy();
            console.log("Sidebar and controls destroyed");
        }, 1000)
    }
}
