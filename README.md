# FP Hvac

## Description

An API and a mobile-friendly web app for controlling a Cooper & Hunter Nordic Premium series HVAC unit
from a web browser. Implemented in Object Pascal (using the Free Pascal Compiler, and Pas2JS).

## Compatible units

Tested with `CH-S12FTXN-PS` unit. Will probably work with other units from the `SxxFTXN` series.

## Components

### API
Stand-alone web service providing a REST-like interface to control the units.
Implements the following endpoints:

| Endpoint | Description |
| --- | ---
| GET /api/v1/state | Retrieves the current state of the HVAC unit as a JSON. |
| PUT /api/v1/state | Sets the state for the HVAC unit. The state must be provided in JSON form (see the requests.http file for an example). |
| GET /api/v1/enums | Returns the full list of values that can be used for enumerated options (`mode`, `fanSpeed`, etc). |

Can be configured through environment variables:
- `LISTEN_PORT`: The port on which the application listens. The default value is `9090`.
- `HVAC_CONNECTION_STRING`: The connection string for the HVAC device or a simulator. The default value is `localhost:12416`.
- `API_KEY`: The API key used for authentication. The default is an empty string (no authentication).
- `ALLOW_ORIGIN`: The allowed origin for cross-origin resource sharing (CORS). The default is an empty string.

### Web app
A mobile-friendly web app that allows controlling the unit from a web browser by consuming the API described above. Requires the API URL and API key (if used) to be set up on the UI.

Can be configured though environment variables:
- `LISTEN_IFACE`: the interface to listen on. Default is `localhost`.
- `LISTEN_PORT`: the TCP port to listen on. Default is `12416`.

## Usage
Build and run using the docker compose.

```
docker compose build
docker compose up -d
```

In case you don't want to use Docker, you can find the `build.sh` scripts inside the `/src/...` directories. You'll need the Free Pascal Compiler version 3.2.2+ (for building the API and the Simulator), and Pas2JS version 3.1.1+ (for the web app) installed on your system.

By default, the app will be run with the simulator, and accessible via `http://localhost:8080/`.
The UI will need to be set up as follows:

- `API URL`: `http://localhost:9090/api/v1` (important: no trailing slash)
- `API key`: `abcdef`

If you want to run against the real unit, change the `HVAC_CONNECTION_STRING` environment variable for the `api` container. In that case, you don't need to start the `simulator` container.

## Acknowledgments
Thanks to 

- [ki0ki0](https://github.com/ki0ki0/) ([homeeasy_ha_local](https://github.com/ki0ki0/homeeasy_ha_local) project)

for info on the HVAC unit protocol specs.
