sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("com.clause.blockedorders.controller.App", {

        onInit: function () {
            // Apply compact/cozy density from the component
            this.getView().addStyleClass(
                this.getOwnerComponent().getContentDensityClass()
            );
        }
    });
});
