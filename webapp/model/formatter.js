sap.ui.define([], function () {
    "use strict";

    var mIssueText = {
        payment: "Payment issue",
        delivery: "Delivery issue",
        other: "Other"
    };

    var mIssueState = {
        payment: "Error",
        delivery: "Warning",
        other: "None"
    };

    var mStatusText = {
        open: "Open",
        in_progress: "In progress",
        resolved: "Resolved"
    };

    var mStatusState = {
        open: "Error",
        in_progress: "Warning",
        resolved: "Success"
    };

    return {

        /**
         * @param {string} sType issue type key (payment | delivery | other)
         * @returns {string} human-readable issue type text
         */
        issueTypeText: function (sType) {
            return mIssueText[sType] || sType || "";
        },

        /**
         * @param {string} sType issue type key
         * @returns {sap.ui.core.ValueState} semantic state for the issue type
         */
        issueTypeState: function (sType) {
            return mIssueState[sType] || "None";
        },

        /**
         * @param {string} sStatus status key (open | in_progress | resolved)
         * @returns {string} human-readable status text
         */
        statusText: function (sStatus) {
            return mStatusText[sStatus] || sStatus || "";
        },

        /**
         * @param {string} sStatus status key
         * @returns {sap.ui.core.ValueState} semantic state for the status
         */
        statusState: function (sStatus) {
            return mStatusState[sStatus] || "None";
        }
    };
});
