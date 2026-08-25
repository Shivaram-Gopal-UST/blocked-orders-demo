sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device"
], function (UIComponent, Device) {
    "use strict";

    return UIComponent.extend("com.clause.blockedorders.Component", {

        metadata: {
            manifest: "json"
        },

        /**
         * Initializes the component. Models declared in the manifest
         * (orders JSONModel, i18n ResourceModel) are set up automatically.
         */
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
        },

        /**
         * Returns the content density class depending on the device,
         * so the app renders compact on desktop and cozy on touch devices.
         * @returns {string} the content density CSS class
         */
        getContentDensityClass: function () {
            if (!this._sContentDensityClass) {
                this._sContentDensityClass = Device.support.touch
                    ? "sapUiSizeCozy"
                    : "sapUiSizeCompact";
            }
            return this._sContentDensityClass;
        }
    });
});
