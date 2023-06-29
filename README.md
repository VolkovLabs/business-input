# Static Data Source for Grafana

![Screenshot](https://github.com/volkovlabs/volkovlabs-static-datasource/raw/main/src/img/dark.png)

![Grafana 10](https://img.shields.io/badge/Grafana-10.0.0-orange)
![CI](https://github.com/volkovlabs/volkovlabs-static-datasource/workflows/CI/badge.svg)
![E2E](https://github.com/volkovlabs/volkovlabs-static-datasource/workflows/E2E/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/volkovlabs-static-datasource/branch/main/graph/badge.svg?token=0m6f0ktUar)](https://codecov.io/gh/VolkovLabs/volkovlabs-static-datasource)
[![CodeQL](https://github.com/VolkovLabs/volkovlabs-static-datasource/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/VolkovLabs/volkovlabs-static-datasource/actions/workflows/codeql-analysis.yml)

## Introduction

The Static Data Source is a plugin for Grafana that allows storing and emulating your data.

[![Static data source for Grafana | Mimic any data source | Tutorial and examples](https://raw.githubusercontent.com/volkovlabs/volkovlabs-static-datasource/main/img/video.png)](https://youtu.be/QOV8ECOUjWs)

## Requirements

- **Grafana 8.5+**, **Grafana 9.0+** is required for major version 2.
- **Grafana 7.3+** is required for major version 1.

## Getting Started

The Static Data Source can be installed from the [Grafana Catalog](https://grafana.com/grafana/plugins/marcusolsson-static-datasource/) or utilizing the Grafana command line tool.

For the latter, use the following command.

```bash
grafana-cli plugins install marcusolsson-static-datasource
```

## Highlights

- Create static visualizations that don't depend on a specific data source.
- Build custom query responses for testing or developing panel plugins.
- Store data and images directly in the dashboard.
- Supports variables in the text fields.
- Uses Number input for Number, Date Time Picker for Time fields.
- Uses Text Area for String inputs with more than 100 symbols.
- Allows to temporarily hide values for specific fields.

## Documentation

| Section                      | Description                                                  |
| ---------------------------- | ------------------------------------------------------------ |
| [Provisioning](https://volkovlabs.io/plugins/volkovlabs-static-datasource/provisioning/) | Demonstrates how to automatically provision the Data Source. |
| [Variables](https://volkovlabs.io/plugins/volkovlabs-static-datasource/variables/)       | Demonstrates how to use variables.                           |
| [Panels](https://volkovlabs.io/plugins/volkovlabs-static-datasource/panels/)             | Demonstrates how to use data source with panels.             |
| [Variables](https://volkovlabs.io/plugins/volkovlabs-static-datasource/variables/)       | Demonstrates how to use variables.                           |


## Feedback

We love to hear from you. There are various ways to get in touch with us.

- Ask a question, request a new feature, and file a bug with [GitHub issues](https://github.com/volkovlabs/volkovlabs-static-datasource/issues/new/choose).
- Subscribe to our [YouTube Channel](https://www.youtube.com/@volkovlabs) and add a comment.
- Sponsor our open-source plugins for Grafana with [GitHub Sponsor](https://github.com/sponsors/VolkovLabs).
- Star the repository to show your support.

## License

Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/volkovlabs-static-datasource/blob/main/LICENSE).
