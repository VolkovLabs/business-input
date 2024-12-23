# Business Input for Grafana

![Screenshot](https://github.com/volkovlabs/business-input/raw/main/src/img/dark.png)

![Grafana](https://img.shields.io/badge/Grafana-11.4-orange)
![CI](https://github.com/volkovlabs/business-input/workflows/CI/badge.svg)
![E2E](https://github.com/volkovlabs/business-input/workflows/E2E/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/business-input/branch/main/graph/badge.svg)](https://codecov.io/gh/VolkovLabs/business-input)
[![CodeQL](https://github.com/VolkovLabs/business-input/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/VolkovLabs/business-input/actions/workflows/codeql-analysis.yml)

## Introduction

The Business Input data source is a plugin for Grafana that allows storing and emulating your data.

[![Business Input data source for Grafana | Mimic any data source | Tutorial and examples](https://raw.githubusercontent.com/volkovlabs/business-input/main/img/video.png)](https://youtu.be/QOV8ECOUjWs)

## Requirements

- Business Input data source version 4.X requires **Grafana 10.3** or **Grafana 11**.
- Static data source version 3.X requires **Grafana 9.2** or **Grafana 10**.
- Static data source version 2.X requires **Grafana 8.5** or **Grafana 9**.
- Static data source version 1.X requires **Grafana 7.3**.

## Getting Started

The Business Input data source can be installed from the [Grafana Plugins catalog](https://grafana.com/grafana/plugins/marcusolsson-static-datasource/) or utilizing the Grafana command line tool.

For the latter, please use the following command.

```bash
grafana cli plugins install marcusolsson-static-datasource
```

[![Install Business Suite plugins in Cloud, OSS, Enterprise | Open source community plugins](https://raw.githubusercontent.com/volkovlabs/.github/main/started.png)](https://youtu.be/1qYzHfPXJF8)

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

| Section                                                                    | Description                                                  |
| -------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [Provisioning](https://volkovlabs.io/plugins/business-input/provisioning/) | Demonstrates how to automatically provision the Data Source. |
| [Variables](https://volkovlabs.io/plugins/business-input/variables/)       | Demonstrates how to use variables.                           |
| [Panels](https://volkovlabs.io/plugins/business-input/panels/)             | Demonstrates how to use data source with panels.             |
| [Release Notes](https://volkovlabs.io/plugins/business-input/release/)     | Stay up to date with the latest features and updates.        |

## Business Suite for Grafana

The Business Suite is a collection of open source plugins created and actively maintained by Volkov Labs.

The collection aims to solve the most frequent business tasks by providing an intuitive interface with detailed written documentation, examples, and video tutorials.

[![Business Suite for Grafana](https://raw.githubusercontent.com/VolkovLabs/.github/main/business.png)](https://volkovlabs.io/plugins/)

### Enterprise Support

With the [Business Suite Enterprise](https://volkovlabs.io/pricing/), you're not just getting a product, you're getting a complete support system. You'll have a designated support team ready to tackle any issues.

You can contact us via Zendesk, receive priority in feature requests and bug fixes, meet with us for in-person consultation, and get access to the Business Intelligence. It's a package that's designed to make your life easier.

## Always happy to hear from you

- Ask a question, request a new feature, and file a bug with [GitHub issues](https://github.com/volkovlabs/business-input/issues).
- Subscribe to our [YouTube Channel](https://youtube.com/@volkovlabs) and leave your comments.
- Become a [Business Suite sponsor](https://github.com/sponsors/VolkovLabs).

## License

Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/business-input/blob/main/LICENSE).
