# Business Input Data Source for Grafana

![Screenshot](https://github.com/volkovlabs/volkovlabs-static-datasource/raw/main/src/img/dark.png)

![Grafana](https://img.shields.io/badge/Grafana-11.1-orange)
![CI](https://github.com/volkovlabs/volkovlabs-static-datasource/workflows/CI/badge.svg)
![E2E](https://github.com/volkovlabs/volkovlabs-static-datasource/workflows/E2E/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/volkovlabs-static-datasource/branch/main/graph/badge.svg?token=0m6f0ktUar)](https://codecov.io/gh/VolkovLabs/volkovlabs-static-datasource)
[![CodeQL](https://github.com/VolkovLabs/volkovlabs-static-datasource/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/VolkovLabs/volkovlabs-static-datasource/actions/workflows/codeql-analysis.yml)

## Introduction

The Business Input Data Source is a plugin for Grafana that allows storing and emulating your data.

[![Business Input data source for Grafana | Mimic any data source | Tutorial and examples](https://raw.githubusercontent.com/volkovlabs/volkovlabs-static-datasource/main/img/video.png)](https://youtu.be/QOV8ECOUjWs)

## Requirements

- Business Input Data Source version 4.X requires **Grafana 10.2** or **Grafana 11**.
- Static Data Source version 3.X requires **Grafana 9.2** or **Grafana 10**.
- Static Data Source version 2.X requires **Grafana 8.5** or **Grafana 9**.
- Static Data Source version 1.X requires **Grafana 7.3**.

## Getting Started

The Business Input Data Source can be installed from the [Grafana Catalog](https://grafana.com/grafana/plugins/marcusolsson-static-datasource/) or utilizing the Grafana command line tool.

For the latter, please use the following command.

```bash
grafana-cli plugins install marcusolsson-static-datasource
```

## Highlights

- Create static visualizations that don't depend on a specific data source.
- Allows specifying values manually or using the JavaScript Values Editor code.
- Allows to generate data with OpenAI and LLM App.
- Build custom query responses for testing or developing panel plugins.
- Store data and images directly in the dashboard.
- Supports variables in the text fields.
- Uses Number input for Number, Date Time Picker for Time fields.
- Uses Text Area for String inputs with more than 100 symbols.

## Documentation

| Section                                                                                  | Description                                                  |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [Provisioning](https://volkovlabs.io/plugins/volkovlabs-static-datasource/provisioning/) | Demonstrates how to automatically provision the Data Source. |
| [Variables](https://volkovlabs.io/plugins/volkovlabs-static-datasource/variables/)       | Demonstrates how to use variables.                           |
| [Panels](https://volkovlabs.io/plugins/volkovlabs-static-datasource/panels/)             | Demonstrates how to use data source with panels.             |
| [Variables](https://volkovlabs.io/plugins/volkovlabs-static-datasource/variables/)       | Demonstrates how to use variables.                           |
| [Release Notes](https://volkovlabs.io/plugins/volkovlabs-static-datasource/release/)     | Stay up to date with the latest features and updates.        |

## Feedback

We're looking forward to hearing from you. You can use different ways to get in touch with us.

- Ask a question, request a new feature, and file a bug with [GitHub issues](https://github.com/volkovlabs/volkovlabs-static-datasource/issues).
- Subscribe to our [YouTube Channel](https://www.youtube.com/@volkovlabs) and leave your comments.
- Sponsor our open source plugins for Grafana through [GitHub](https://github.com/sponsors/VolkovLabs).
- Support our project by starring the repository.

## License

Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/volkovlabs-static-datasource/blob/main/LICENSE).
