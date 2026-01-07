# Shopify Sync Actions

Actions to synchronize data between a Shopify store and external services.

## Setup

Download the repository and install the dependencies:

```sh
pnpm install
```

Copy the `.env.example` file to `.env` and fill in the necessary environment variables depending on the actions you want to run.

## Actions

Run an action with:

```sh
pnpm run action <workflow-name>
```

Each action can be run as a GitHub Actions workflow defined in the `.github/workflows` directory and needs specific environment variables. Once set up, all actions can be triggered manually via the `Run workflow` button in the repository Actions tab.

### Sync Collections Status

The action synchronizes the publications of a Shopify collection depending on a given metafield and logs the operations in a Google Sheets spreadsheet.

| Workflow                                                     | Environment                                                                                                                                                                             | Schedule      |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| [`sync-collections`](.github/workflows/sync-collections.yml) | `GOOGLE_SHEETS_CLIENT_EMAIL`<br>`GOOGLE_SHEETS_PRIVATE_KEY`<br>`GOOGLE_SHEETS_SPREADSHEET_ID`<br>`GOOGLE_SHEETS_SYNC_COLLECTIONS_SHEET`<br>`SHOPIFY_ACCESS_TOKEN`<br>`SHOPIFY_STORE_ID` | Every 3 hours |

### Sync Products Quantity

The action synchronizes the quantity of the products in a customer PIM with the quantity in the Shopify store and logs the operations in a Google Sheets spreadsheet.

| Workflow                                               | Environment                                                                                                                                                                                                                                                                                      | Schedule                                              |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| [`sync-products`](.github/workflows/sync-products.yml) | `GOOGLE_SHEETS_CLIENT_EMAIL`<br>`GOOGLE_SHEETS_PRIVATE_KEY`<br>`GOOGLE_SHEETS_SPREADSHEET_ID`<br>`GOOGLE_SHEETS_SYNC_PRODUCTS_SHEET`<br>`PIM_API_URL`<br>`PIM_API_KEY`<br>`PIM_VERIFY_ENDPOINT`<br>`RETRIES` (optional)<br>`SHOPIFY_ACCESS_TOKEN`<br>`SHOPIFY_LOCATION_ID`<br>`SHOPIFY_STORE_ID` | Every minute[\*](#run-workflows-in-shorter-intervals) |

## Notes

### Run workflows in shorter intervals

GitHub Actions has a limit of 5 minutes for intervals between workflow runs. To run a workflow every minute, the action needs a `repository_dispatch` event, which can be triggered with the following HTTP request:

```sh
curl --request POST \
  --url 'https://api.github.com/repos/<repo>/dispatches' \
  --header 'authorization: Bearer <GITHUB_ACCESS_TOKEN>' \
  --data '{ "event_type": "sync-products" }'
```

A simple service that can send requests every minute is [Google Cloud Scheduler](https://cloud.google.com/scheduler).
