# Blocked Orders (com.clause.blockedorders)

A simple SAP Fiori / UI5 freestyle application to review and manage blocked
sales orders. Built against **UI5 1.100** with the Horizon theme.

## What it does

- Displays a list of blocked orders (order number, customer, amount,
  order date, issue type, status) from mock data.
- Filter orders by issue type — **Payment**, **Delivery**, or **Other** —
  via an icon tab bar with live counts of unresolved orders.
- Live search by customer name.
- Mark an order as **Resolved** directly from the list. In this mock stage
  the status is updated in the client-side JSON model; when connected to a
  real OData V4 service this becomes a bound `resolve` action on the entity.

## Project structure

```
blockedorders/
├── README.md
├── .gitignore
└── webapp/
    ├── index.html                  # UI5 bootstrap (CDN, v1.100, Horizon theme)
    ├── manifest.json               # App descriptor: models, dependencies
    ├── Component.js                # UIComponent bootstrap
    ├── view/
    │   └── App.view.xml            # DynamicPage + IconTabBar + orders table
    ├── controller/
    │   └── App.controller.js       # Filtering, search, resolve logic
    ├── model/
    │   ├── formatter.js            # Status / issue-type texts and states
    │   └── orders.json             # Mock data: 7 blocked orders
    └── i18n/
        └── i18n.properties         # UI texts
```

## Running locally

The app bootstraps UI5 from the public CDN, so any static file server works.

**Option 1 — UI5 CLI (recommended for development):**

```bash
npm install --global @ui5/cli   # once
cd blockedorders
ui5 init                        # generates ui5.yaml on first run
ui5 serve --open webapp/index.html
```

**Option 2 — any static server:**

```bash
cd blockedorders/webapp
npx serve .
# then open http://localhost:3000
```

Note: opening `index.html` directly from the filesystem (`file://`) will not
work because the manifest and mock data are loaded via HTTP.

## Live demo

_The live demo will be published here once deployed (e.g., GitHub Pages,
SAP BTP HTML5 Application Repository, or SAP Build Work Zone):_

**URL:** _TBD_

## Next steps

- Replace the `orders` JSONModel with the real OData V4 service
  (`ZUI5_BLOCKED_ORDERS` or a CAP service). Property names in the mock data
  already match the planned entity, so migration is mostly removing the
  `orders>` model prefix and switching `onResolvePress` to execute the
  bound `resolve` action.
- Add unit tests (QUnit) for `formatter.js` and OPA5 journeys for the
  filter/resolve flows.
- Add a `ui5.yaml` and CI pipeline for linting and builds.
