sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "com/clause/blockedorders/model/formatter"
], function (Controller, Filter, FilterOperator, MessageToast, formatter) {
    "use strict";

    return Controller.extend("com.clause.blockedorders.controller.Orders", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle                                                    */
        /* =========================================================== */

        onInit: function () {
            this.getView().addStyleClass(
                this.getOwnerComponent().getContentDensityClass()
            );

            // Current filter state
            this._sStatusFilter = "all";
            this._sIssueFilter = "all";

            // Recalculate issue-tab counts once mock data is loaded
            var oOrdersModel = this.getOwnerComponent().getModel("orders");
            oOrdersModel.dataLoaded().then(this._updateCounts.bind(this));
        },

        /* =========================================================== */
        /* event handlers                                               */
        /* =========================================================== */

        /**
         * Fired when the status Select in the toolbar changes.
         * Reads the selected key and re-applies all list filters.
         * @param {sap.ui.base.Event} oEvent the Select change event
         */
        onFilterChange: function (oEvent) {
            this._sStatusFilter = oEvent.getParameter("selectedItem").getKey();
            this._applyFilters();
        },

        /**
         * Fired when an issue-type tab is selected.
         * @param {sap.ui.base.Event} oEvent the IconTabBar select event
         */
        onIssueFilterSelect: function (oEvent) {
            this._sIssueFilter = oEvent.getParameter("key");
            this._applyFilters();
        },

        /**
         * Marks the order of the pressed row as resolved.
         * With the real OData V4 service this becomes the bound
         * "resolve" action executed on the row's binding context.
         * @param {sap.ui.base.Event} oEvent the Button press event
         */
        onResolveOrder: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("orders");
            var oModel = oContext.getModel();
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var sOrderId = oContext.getProperty("OrderID");

            oModel.setProperty(oContext.getPath() + "/Status", "resolved");
            this._updateCounts();

            MessageToast.show(oBundle.getText("msgResolved", [sOrderId]));
        },

        /* =========================================================== */
        /* internal methods                                             */
        /* =========================================================== */

        /**
         * Builds the sap.ui.model.Filter array for the current
         * status and issue-type selection.
         * @returns {sap.ui.model.Filter[]} filters for the list binding
         */
        getFilteredOrders: function () {
            var aFilters = [];

            if (this._sStatusFilter !== "all") {
                aFilters.push(
                    new Filter("Status", FilterOperator.EQ, this._sStatusFilter)
                );
            }

            if (this._sIssueFilter !== "all") {
                aFilters.push(
                    new Filter("IssueType", FilterOperator.EQ, this._sIssueFilter)
                );
            }

            return aFilters;
        },

        /**
         * Applies the current filters to the list's items binding.
         */
        _applyFilters: function () {
            this.byId("ordersList")
                .getBinding("items")
                .filter(this.getFilteredOrders());
        },

        /**
         * Recomputes the counts shown on the issue-type tabs.
         * Resolved orders are excluded from the "blocked" counts.
         */
        _updateCounts: function () {
            var oModel = this.getOwnerComponent().getModel("orders");
            var aOrders = oModel.getProperty("/BlockedOrders") || [];

            var oCounts = aOrders.reduce(function (oAcc, oOrder) {
                if (oOrder.Status !== "resolved") {
                    oAcc.all += 1;
                    if (oAcc.hasOwnProperty(oOrder.IssueType)) {
                        oAcc[oOrder.IssueType] += 1;
                    }
                }
                return oAcc;
            }, { all: 0, payment: 0, delivery: 0, other: 0 });

            oModel.setProperty("/counts", oCounts);
        }
    });
});
