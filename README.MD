# Catalog Service

Its a service responsible for all the catalog related operations. It uses node.js, express.js, mongo db and Redis cache. Uses Auth0 for authentication/autorization. This api contains route for catalog and image operations. It also implements Tracing and logging using open telemetry and Grafana.
This catalog service will send message to kafka whenever there is change in product price and then there is Kafka Consumer(Check RentIt Repo) written in Dot.net 6 which consumes this message and then make Http call to Basket Service(Check RentIt Repo) to update the price.

## How to set up

1. Install "Node" runtime into your machine.
2. Please get Azure cloud access
3. Download the code
4. Do npm install.
5. Update environment file with azure blob storage connection string.
6. Run docker compose up which will download docker image and run the container.
7. Then you can do npm run dev which should start server or even docker will start the server if you just want to test and don't want to debug.

## Pending items

1. Auth0 integration.

## environment key's

| Variable                        | Description                    |
| ------------------------------- | ------------------------------ |
| AZURE_STORAGE_ACCOUNT_NAME      | Blob storage account           |
| AZURE_STORAGE_CONNECTION_STRING | blob storage connection string |
