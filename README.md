name: Build Android APK

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Dependencies
        run: |
          npm install
          npm install @tailwindcss/oxide-linux-x64-gnu --force

      - name: Build Web App
        run: npx vite build

      - name: Setup Capacitor & Android
        run: |
          npm install @capacitor/core @capacitor/cli @capacitor/android
          npx cap init "ServiGo" "com.servigo.app" --web-dir "dist" || true
          npx cap add android || true
          npx cap sync android

      - name: Fix Kotlin STD cross-resolution
        run: |
          echo "android.enableJetifier=true" >> android/gradle.properties
          echo "android.useAndroidX=true" >> android/gradle.properties
          
          cat << 'EOF' >> android/app/build.gradle
          configurations.all {
              resolutionStrategy.eachDependency { DependencyResolveDetails details ->
                  if (details.requested.group == 'org.jetbrains.kotlin') {
                      if (details.requested.name.startsWith('kotlin-stdlib-jdk')) {
                          details.useTarget 'org.jetbrains.kotlin:kotlin-stdlib:1.9.10'
                      }
                  }
              }
          }
          EOF

      - name: Setup Java JDK 21
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '21'

      - name: Make gradlew executable
        run: chmod +x android/gradlew

      - name: Build Android APK
        run: |
          cd android
          ./gradlew assembleDebug

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: app-debug-apk
          path: android/app/build/outputs/apk/debug/app-debug.apk
