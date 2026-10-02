# Verification

This release has ten kindergarten games, nine monster friends, and 404 bundled British Emma narration clips. The dated follow-up below separates current verification from the earlier release checks.

## Version 1.0.2 follow-up — October 2, 2026

The native browser-agent tools disappeared after navigating away and returning from the browser’s Back/Forward Cache: the page had aborted its registrations on departure but did not recreate them on restoration. Version 1.0.2 registers them again when a persisted page returns.

Fresh browser verification used Edge **154.0.4258.48** with the actual app:

- All ten games completed five practice rounds each, including an incorrect answer, retry, hint, reset, completion, and replay.
- All ten complete narrated lessons played through native browser media elements. All **404** voice clips were fetched and decoded with the browser audio decoder. Mute stopped active audio.
- Every game rendered at **320, 390, and 1440 px** without horizontal overflow or broken images. There were no page errors or failed asset responses.
- Switching to another real browser tab emitted a trusted visibility event and stopped narration; returning did not resume it. This used a headed browser without Playwright’s focus emulation, replacing the earlier visibility-shim limitation for this check.
- With experimental `WebMCP` and `WebMCPTesting` browser features enabled, native `document.modelContext` registered both tools. The original code lost both after a real persisted restore; the fix retained them and the in-tab practice state across two restores. Both tools executed after each restore, including restarting Counting Garden and navigating to Snack Lab, with returned state matching the visible screen.

The freshly built **1.0.2 / version code 3** Android APK was installed in Android 16 / API 36 with WebView **133.0.6943.137**, airplane mode on and Wi-Fi off:

- All ten games completed five rounds, wrong-answer retries, hints, reset and replay; all ten complete lessons produced native media playback events. All 404 clips decoded offline.
- All nine town gestures, mute, native Back from settings and games, Back to exit, and reopening passed. Two actual Home-and-return cycles stopped narration and did not resume it. An initial playback-event-count assertion raced a queued event; the corrected lifecycle trace waited for actual playback before backgrounding and passed both cycles.
- All **446** packaged static files matched the built website byte for byte. APK signature verification passed, and the APK requests no internet permission. There were no page errors or failed asset responses.
- Installing over v1.0.1 failed with Android’s `INSTALL_FAILED_UPDATE_INCOMPATIBLE`, confirming the different debug certificates. Uninstalling that old test build and freshly installing 1.0.2 succeeded, followed by another practice and native-navigation check.

This emulator run verified decoding and media playback state, not audible output from physical speakers. Physical phones/tablets remain untested. Native WebMCP was absent in the tested Android WebView; desktop-native checks above are a separate capability test. The native Vega build was not rebuilt or retested during this follow-up.

The game’s answers remain deterministic; no hosted language model is needed for its math checks. Native WebMCP is optional and depends on browser support. These checks do not establish compatibility with every external agent or physical device.

## Earlier release checks

The sections below and the accompanying JSON records describe the earlier 1.0.1 verification. They are retained as historical evidence.

### Math and assets

`npm test`: **8 tests passed**. Coverage includes every valid addition/subtraction within ten; every group comparison including zero and equality; every supported length comparison; count and ten-frame boundaries; all numbers from 0 through 20 in Number Trail; repeating patterns; and sorting selections that must include all and only matching treasures.

All nine teacher images exist. All 404 WAV files have complete RIFF data, valid durations, and matching narration catalog entries. The local generation checks also verified nonempty audio, signal levels, and peak levels. They do not replace a human review of every sentence's pronunciation.

### Browser

Chromium checks passed for all ten games:

- Five rounds of practice, incorrect-answer retries, hints and reset, completion, and Play again.
- Real playback of all ten complete narrated animated demonstrations.
- Restart, stop, replay, mute, Town, and browser Back cancel previous audio/animation flows.
- Every image loads at viewport widths **320, 390, 768, and 1440**. No horizontal overflow; active buttons have at least **44 × 44 px** targets.
- Keyboard Enter/Space and mobile tap controls work. Reduced-motion preference is respected.
- All **404** narration files load over HTTP and decode in the browser with the expected durations.
- Audio also works when `speechSynthesis` is absent. Opening/closing settings and Escape cancel playback. Captions keep play available when narration is unavailable.
- Calm motion and 200% text fit the mobile settings. The hidden-page cancellation handler was tested with a visibility shim in headless Chromium; that check is not a physical OS tab-switch test.

### Interactive home

All nine monster gesture previews and clicks passed. Eight gesture types are present: wink, wave, dance, kiss, point, peace sign, double wave, and a happy fist raise. Keyboard Enter/Space, mobile taps, repeated activation, and cleanup when entering/returning from games passed. The larger home artwork and transparent game-card backgrounds fit 320, 390, 768, and 1440 px. Calm/reduced motion shows static gesture poses without movement. Original pose sprites have alpha transparency.

Version 1.0.1 places one of each friend around the illustrated town and removes all duplicate monster artwork from the compact game buttons. All ten game buttons open the correct lesson and return to town. Phone/tablet horizontal exploration and focus scrolling passed with the larger sprites; the page itself has no horizontal overflow.

### Android

The Android Studio project built successfully using **JDK 21, Gradle 8.14.3, and Android SDK 36**. The debug APK contains the same canonical web files and all narration assets. Native Back handles game routes before exiting the app.

The final APK was installed and verified in an **Android 16 / API 36 emulator**, using its actual Android System WebView (Chrome 133), with airplane mode enabled. All nine interactive home gestures worked with the larger transparent artwork. All ten games completed five practice rounds. All **404** voice clips loaded and decoded from APK assets offline. Real narration and mute worked. Android system Back returned to the town, and sending the app to the background cancelled narration without resuming it on return. There were no runtime page errors or missing narration entries. The APK requests no internet permission.

Physical phones/tablets and Play Store distribution have not been tested. This is a debug-signed prototype; it requires production signing and device testing before store release. The browser and Android JSON evidence is included in this directory.

### Limits

No persistent progress, accounts, assessment reporting, or filmed video. The lessons use short animated demonstrations. Hosted browser play requires a connection to load assets; there is no service worker. The installed Android app and local static build include the assets for offline use after setup. Browser audio policies can require a tap on Hear again; captions and hints remain usable.
