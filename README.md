# Welcome to Payslips app 👋

A React Native (Expo) app for managing and viewing payslips. Supports previewing PDFs/images, downloading files to device storage or gallery, and is designed for a clean, polished mobile UX.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation & Setup](#installation--setup)
- [File Handling](#file-handling)
- [Theming & Styling](#theming--styling)
- [License](#license)

## Features

* Payslip list and details screens

* In-app PDF viewer

* Image preview modal

* Download images to gallery

* Save and share PDFs

* Context-based state management

* Fully typed with TypeScript

* Extracted theme for colors, spacing, typography

## Technologies

* React Native (Expo)

* TypeScript

* React Navigation (Native Stack)

* Expo File System & Sharing

* Expo Media Library

## Installation & Setup

Clone the repository:
```bash
git clone https://github.com/MouazAlzahabi/Payslips

cd <repo-folder>
```

Install dependencies:
```bash
npm install

# or

yarn install
   ```


Install Expo CLI globally (if not installed):

```bash
npm install -g expo-cli
   ```


Install peer dependencies:
```bash
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-pager-view
npx expo install @react-navigation/native @react-navigation/native-stack
npx expo install expo-file-system expo-sharing expo-media-library

   ```


Start the app:
```bash
expo start

   ```

Open on iOS simulator, Android emulator, or Expo Go app.

#### Notes:

Media library features (image save) require a physical device or properly configured emulator with permissions.

PDFs saved to app storage can be opened via native file apps.

## File Handling

Images: saved directly to device gallery using expo-media-library.

PDFs: saved to app storage with option to share or open in native apps.

Handles errors gracefully with alerts.

## Theming & Styling

All screens use a centralized theme in theme.ts.

Colors, spacing, and typography are extracted for consistency.

Each screen folder contains its own style file.

Shared components also have extracted styles.

## License

MIT License © 2025

