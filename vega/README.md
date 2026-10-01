# Blossom for Vega OS

The primary TV build is a native React Native for Vega app. It includes ten five-round math activities, character artwork, visible remote focus, and local assets. It does not need a network connection. The browser and Android versions also include narration; the native Vega app uses on-screen lesson text.

## Build and run in the Vega Virtual Device

Use native Ubuntu 20.04, 22.04, or 24.04, or macOS, with Node.js 22 or newer and Vega Developer Tools 0.24. The steps below were tested in an Ubuntu 24.04 Docker container with the Vega Virtual Device and `/dev/kvm` available.

From the repository root:

```sh
npm ci
npm run vega:native:prepare
cd vega-native-app
npm install
npm run build:app
vega device list
vega run-app 'build/private/kepler/@amazon-devices/blossom/undefined/vega/x86_64/Release/@amazon-devices/blossom_x86_64.vpkg' io.github.agammann.blossom.main -d VirtualDevice
```

The x86_64 `.vpkg` is for the Ubuntu simulator. The same build also creates aarch64 and armv7 packages under `vega-native-app/build/private/kepler/`. Paths may vary with Vega SDK updates.

`vega:native:prepare` creates the generated `vega-native-app/` project from Amazon's `helloWorld` template, copies `vega/NativeApp.tsx` to its app entry point, and copies local WebP assets. Re-run it after editing the source or images. Commit changes to `vega/`, `web/assets/`, and `scripts/`, rather than generated output. The native app is fully playable with directional keys, Select/Enter, and Back/Escape.

## Demo check

1. On the town screen, use arrows to move through the ten activity cards. The focused card gets a gold outline.
2. Press Select to open an activity and see its lesson and character.
3. Press Select on **My turn**; make an incorrect choice and retry, then select the correct answer.
4. Complete all five rounds to reach the finish screen; select **Play again** or **Choose a game**.
5. Press Back from an activity to return to town. Open another activity and repeat.

## WebView build

The optional WebView edition packages the browser game and narration. Build it with `npm run vega:prepare`, then `cd vega-app && npm install && npm run build:app`. Ubuntu's Vega Virtual Device does not include the WebView module, so use the native build above for the Ubuntu simulator.

For browser-only UI checks, use `docker build -f Dockerfile.tv-preview -t blossom-tv-preview .` and `docker run --rm -p 127.0.0.1:4173:4173 blossom-tv-preview`, then open `http://127.0.0.1:4173/tv.html`. Browser checks do not verify Vega runtime behavior.
