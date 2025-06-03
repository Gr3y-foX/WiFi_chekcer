# Architecture of the WiFi Vulnerability Scanner Application

## Overview
The WiFi Vulnerability Scanner is designed to identify potential security vulnerabilities in WiFi networks across macOS and mobile platforms (Android and iOS). The application is structured to facilitate easy maintenance and scalability, with a clear separation of concerns between different components.

## Project Structure
The project is organized into several key directories:

- **src**: Contains the main application code.
  - **core**: Implements the core functionalities of the scanner and analyzer.
    - `scanner.js`: Handles the scanning of WiFi networks.
    - `analyzer.js`: Analyzes scan results for vulnerabilities.
    - `utils.js`: Provides utility functions for data handling and error management.
  - **platforms**: Contains platform-specific implementations.
    - **macos**: Includes macOS-specific functionalities.
      - `adapter.js`: Interfaces with macOS networking APIs.
      - `system-calls.js`: Implements system calls for network operations.
    - **mobile**: Contains mobile-specific functionalities.
      - **android**: Manages WiFi operations on Android devices.
        - `wifi-manager.js`: Functions for connecting, disconnecting, and scanning networks.
      - **ios**: Provides network extension functionalities for iOS devices.
        - `network-extension.js`: Manages WiFi connections and network information.
  - **ui**: Contains user interface components and screens.
    - **components**: Defines reusable UI components.
      - `Scanner.js`: Component for initiating scans.
      - `Results.js`: Component for displaying scan results.
      - `Recommendations.js`: Component for providing security recommendations.
    - **screens**: Defines the main screens of the application.
      - `HomeScreen.js`: Main entry point for users.
      - `ScanScreen.js`: Screen for initiating scans.
      - `VulnerabilitiesScreen.js`: Screen for displaying identified vulnerabilities.
    - `styles.js`: Contains styling for UI components.
  - **utils**: Provides utility functions for logging and permissions.
    - `logger.js`: Implements logging functionalities.
    - `permissions.js`: Handles permission requests for network access.

- **docs**: Contains documentation for the application.
  - `ARCHITECTURE.md`: This document outlining the architecture.
  - `TUTORIALS.md`: Guides users through the application features.
  - `WIFI_SECURITY.md`: Information on WiFi security best practices.

- **tests**: Contains unit tests for the application.
  - **core**: Tests for core functionalities.
    - `scanner.test.js`: Unit tests for the scanner.
  - **platforms**: Tests for platform-specific functionalities.
    - `macos.test.js`: Unit tests for macOS functionalities.
    - `mobile.test.js`: Unit tests for mobile functionalities.

- **configuration files**: Includes various configuration files for the application.
  - `app.json`: Configuration settings for the application.
  - `package.json`: Lists dependencies and scripts for the project.
  - `babel.config.js`: Configuration for Babel.
  - `metro.config.js`: Configuration for Metro bundler.
  - `README.md`: Documentation for setup and usage.

## Design Decisions
- **Modularity**: The application is designed in a modular fashion, allowing for easy updates and maintenance. Each component has a specific responsibility, making the codebase easier to understand and navigate.
- **Cross-Platform Compatibility**: By separating platform-specific code into distinct directories, the application can easily adapt to different environments while sharing common logic.
- **User-Centric UI**: The UI components are designed to be intuitive and user-friendly, ensuring that users can easily navigate the application and access its features.

## Conclusion
This architecture document provides a high-level overview of the WiFi Vulnerability Scanner application. The design choices made aim to create a robust, maintainable, and user-friendly application that effectively identifies WiFi vulnerabilities across multiple platforms.