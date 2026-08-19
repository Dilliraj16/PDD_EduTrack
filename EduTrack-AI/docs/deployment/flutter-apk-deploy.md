# Flutter APK & AppBundle Build Guide

The Flutter mobile application is located in `apps/mobile/`.

## Local Builds

Ensure your Android SDK is installed and Flutter is in your path.

1. Navigate to the mobile app:
   ```sh
   cd apps/mobile
   ```

2. Fetch dependencies:
   ```sh
   flutter pub get
   ```

3. Build Android APK (Release for standard installation):
   ```sh
   flutter build apk --release
   ```

4. Build AppBundle (AAB for Google Play Store):
   ```sh
   flutter build appbundle --release
   ```

5. Build Split APKs (For smaller file sizes per architecture):
   ```sh
   flutter build apk --split-per-abi
   ```

## CI/CD (GitHub Actions)
The repository is configured through `.github/workflows/deploy.yml` to automatically build the APK and AAB whenever a new GitHub Release is created. The files will be attached as release artifacts.
