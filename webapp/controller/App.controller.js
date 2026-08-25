sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "com/clause/blockedorders/model/formatter"
], function (Controller, Filter, FilterOperator, MessageToast, formatter) {
    "use strict";

    return Controller.extend("com.clause.blockedorders.controller.App", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle                                                    */
        /* =========================================================== */

        onInit: function () {
            // Apply compact/cozy density from the component
            this.getView().addStyleClass(
                this.getOwnerComponent().getContentDensityClass()
            );

            // Current filter state
            this._sIssueFilter = "all";
            this._sSearchQuery = "";

            // Recalculate tab counts once the mock data is loaded
            var oOrdersModel = this.getOwnerComponent().getModel("orders");
            oOrdersModel.dataLoaded().then(this._updateCounts.bind(this));
        },

        /* =========================================================== */
        /* event handlers                                               */
        /* =========================================================== */

        /**
         * Filters the table by issue type when a tab is selected.
         * @param {sap.ui.base.Event} oEvent the IconTabBar select event
         */
        onFilterSelect: function (oEvent) {
            this._sIssueFilter = oEvent.getParameter("key");
            this._applyFilters();
        },

        /**
         * Filters the table by customer name (live search).
         * @param {sap.ui.base.Event} oEvent the SearchField liveChange event
         */
        onSearch: function (oEvent) {
            this._sSearchQuery = oEvent.getParameter("newValue") || "";
            this._applyFilters();
        },

        /**
         * Marks the order of the pressed row as resolved.
         * With the future OData V4 service this becomes a bound action
         * ("resolve") executed on the row's binding context.
         * @param {sap.ui.base.Event} oEvent the Button press event
         */
        onResolvePress: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("orders");
            var oModel = oContext.getModel();
            var oBundle = this.getView().getModel("i18n").getResourceBundle();

            oModel.setProperty(oContext.getPath() + "/Status", "resolved");
            this._updateCounts();

            MessageToast.show(
                oBundle.getText("msgResolved", [oContext.getProperty("OrderID")])
            );
        },

        /* =========================================================== */
        /* internal methods                                             */
        /* =========================================================== */

        /**
         * Applies the combined issue-type and search filters
         * to the table's items binding.
         */
        _applyFilters: function () {
            var aFilters = [];

            if (this._sIssueFilter !== "all") {
                aFilters.push(
                    new Filter("IssueType", FilterOperator.EQ, this._sIssueFilter)
                );
            }

            if (this._sSearchQuery) {
                aFilters.push(
                    new Filter("CustomerName", FilterOperator.Contains, this._sSearchQuery)
                );
            }

            this.byId("ordersTable")
                .getBinding("items")
                .filter(aFilters);
        },

        /**
         * Recomputes the counts shown on the IconTabBar filters.
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
