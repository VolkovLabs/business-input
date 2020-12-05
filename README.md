# Static data source for Grafana

[![Build](https://github.com/marcusolsson/grafana-static-datasource/workflows/CI/badge.svg)](https://github.com/marcusolsson/grafana-static-datasource/actions?query=workflow%3A%22CI%22)
[![Release](https://github.com/marcusolsson/grafana-static-datasource/workflows/Release/badge.svg)](https://github.com/marcusolsson/grafana-static-datasource/actions?query=workflow%3ARelease)
[![Marketplace](https://img.shields.io/badge/dynamic/json?color=orange&label=marketplace&prefix=v&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22marcusolsson-static-datasource%22%29%5D.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://grafana.com/grafana/plugins/marcusolsson-static-datasource)
[![Downloads](https://img.shields.io/badge/dynamic/json?color=orange&label=downloads&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22marcusolsson-static-datasource%22%29%5D.downloads&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://grafana.com/grafana/plugins/marcusolsson-static-datasource)
[![License](https://img.shields.io/github/license/marcusolsson/grafana-static-datasource)](LICENSE)

A data source plugin for [Grafana](https://grafana.com) for static data.

- Create static visualizations that don't depend on a specific data source
- Build custom query responses for testing or developing panel plugins

![Screenshot](https://github.com/marcusolsson/grafana-static-datasource/raw/master/src/img/screenshot.png)
