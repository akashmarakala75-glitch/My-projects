# DepthScape 3D Wallpapers

DepthScape is a React Native wallpaper showcase app built for a final-year student project submission. It presents a polished mobile UI with a pseudo-3D browsing effect, featured wallpaper hero section, category filters, favorites, and a full-screen preview modal.

## Features

- Modern landing screen with layered gradients and cinematic styling
- 3D-style wallpaper cards using perspective, scale, and parallax transforms
- Category-based wallpaper filtering
- Favorites counter and save/remove behavior
- Preview modal with project explanation and mock apply action
- Remote wallpaper catalogue for a lightweight project setup

## Tech Stack

- Expo
- React Native
- Animated API
- Expo Linear Gradient

## Run The Project

```bash
npm install
npm start
```

Then scan the QR code in Expo Go, or press:

- `a` for Android emulator
- `w` for web preview

## Direct Wallpaper Apply On Android

This app now supports direct wallpaper setting on Android through a native module.

- Build the native app with `npm run android`
- Test direct wallpaper apply inside the built Android app, not Expo Go
- Keep Android Studio or an Android SDK, Java, and an emulator or USB device ready for the first build

If you open the project in Expo Go or on iPhone, the app falls back to saving the wallpaper for manual use.

## Suggested Submission Notes

You can describe this as a **mobile wallpaper browsing application with a 3D visual experience**. The key implementation areas are:

- responsive mobile UI design
- animation using React Native `Animated`
- filtering and state management
- modal-based preview interaction
- reusable component architecture

## Project Structure

```text
App.js
src/
  components/
    CategoryPill.js
    PreviewModal.js
    WallpaperCard.js
  data/
    wallpapers.js
```