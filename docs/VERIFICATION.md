# Verification

This release has ten kindergarten games, nine monster friends, and 404 bundled British Emma narration clips. The tests below were performed against the actual finished app, not a mockup.

## Math and assets

`npm test`: **8 tests passed**. Coverage includes every valid addition/subtraction within ten; every group comparison including zero and equality; every supported length comparison; count and ten-frame boundaries; all numbers from 0 through 20 in Number Trail; repeating patterns; and sorting selections that must include all and only matching treasures.

All nine teacher images exist. All 404 WAV files have complete RIFF data, valid durations, and matching narration catalog entries. The local generation checks also verified nonempty audio, signal levels, and peak levels. They do not replace a human review of every sentence's pronunciation.

## Browser

Chromium checks passed for all ten games:

- Five rounds of practice, incorrect-answer retries, hints and reset, completion, and Play again.
- Real playback of all ten complete narrated animated demonstrations.
- Restart, stop, replay, mute, Town, and browser Back cancel previous audio/animation flows.
- Every image loads at viewport widths **320, 390, 768, and 1440**. No horizontal overflow; active buttons have at least **44 × 44 px** targets.
- Keyboard Enter/Space and mobile tap controls work. Reduced-motion preference is respected.
- All **404** narration files load over HTTP and decode in the browser with the expected durations.
- Audio also works when `speechSynthesis` is absent. Opening/closing settings and Escape cancel playback. Captions keep play available when narration is unavailable.
- Calm motion and 200% text fit the mobile settings. The hidden-page cancellation handler was tested with a visibility shim in headless Chromium; that check is not a physical OS tab-switch test.

## Interactive home

All nine monster gesture previews and clicks passed. Eight gesture types are present: wink, wave, dance, kiss, point, peace sign, double wave, and a happy fist raise. Keyboard Enter/Space, mobile taps, repeated activation, and cleanup when entering/returning from games passed. The larger home artwork and transparent game-card backgrounds fit 320, 390, 768, and 1440 px. Calm/reduced motion shows static gesture poses without movement. Original pose sprites have alpha transparency.

## Android

The Android Studio project built successfully using **JDK 21, Gradle 8.14.3, and Android SDK 36**. The debug APK contains the same canonical web files and all narration assets. Native Back handles game routes before exiting the app.

The final APK was installed and verified in an **Android 16 / API 36 emulator**, using its actual Android System WebView (Chrome 133), with airplane mode enabled. All nine interactive home gestures worked with the larger transparent artwork. All ten games completed five practice rounds. All **404** voice clips loaded and decoded from APK assets offline. Real narration and mute worked. Android system Back returned to the town, and sending the app to the background cancelled narration without resuming it on return. There were no runtime page errors or missing narration entries. The APK requests no internet permission.

Physical phones/tablets and Play Store distribution have not been tested. This is a debug-signed prototype; it requires production signing and device testing before store release. The browser and Android JSON evidence is included in this directory.

## Limits

No persistent progress, accounts, assessment reporting, or filmed video. The lessons use short animated demonstrations. Hosted browser play requires a connection to load assets; there is no service worker. The installed Android app and local static build include the assets for offline use after setup. Browser audio policies can require a tap on Hear again; captions and hints remain usable.
