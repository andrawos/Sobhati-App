# سبحتي — Sobhati

Mobile-first Arabic Islamic companion built with Capacitor.

## Included in this first build
- Six dhikr counter modes with reset and tap counting.
- Morning, evening and general adhkar list.
- A rotating selection of hadith with source references.
- Quran audio directory from MP3Quran API, including Sheikh Al-Ayoun Al-Koushi when returned by the API.
- GPS-based prayer time lookup through AlAdhan.
- GPS-based Qibla bearing with device-orientation updates where supported.
- Arabic-first interface with initial French and English greeting support.

## Build Android APK
GitHub Actions builds a debug APK on pushes to main affecting the app or workflow, and on manual dispatch.

1. Open Actions.
2. Select Build Sobhati Android APK.
3. Open the latest successful run.
4. Download Sobhati-Android-debug from Artifacts.

## Data and network
Prayer times and reciter directory/audio require internet access. GPS permission is requested when the user asks to calculate prayer times or Qibla. Calculation results can vary by local authority and method; verify local prayer-time settings before relying on them.

## Sources
- MP3Quran API: https://www.mp3quran.net/ar/api
- AlAdhan prayer times API: https://aladhan.com/prayer-times-api
