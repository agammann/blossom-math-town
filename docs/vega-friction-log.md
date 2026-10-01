# Vega SDK 0.24 friction log: WebView package on Ubuntu Virtual Device

**Task attempted:** Build and run Blossom's Vega WebView package in the Ubuntu Vega Virtual Device during the Fire TV track development workflow.

**Environment:** Ubuntu 24.04 container with `/dev/kvm`; Vega Developer Tools 0.24.12112; x86_64 Vega Virtual Device. The app was generated from the `vegaWebview` template and bundled local web assets.

**Steps:**

1. Generate the WebView project with `npm run vega:prepare`.
2. In `vega-app/`, run `npm install` and `npm run build:app`. Manifest validation and packaging succeeded.
3. Run the x86_64 package with `vega run-app <path-to-vpkg> io.github.agammann.blossom.main -d VirtualDevice`.

**Expected:** Either the package launches in the selected Virtual Device, or the tooling identifies the missing target capability before the full build.

**Actual:** Installation failed with `Module dependency not found`, naming `/com.amazon.kepler.webview_4@IWebview_4`. The installer suggested testing on a physical Fire TV Stick. Amazon's [Virtual Device troubleshooting page](https://developer.amazon.com/docs/vega/0.24/kvd-issues) documents that Ubuntu Virtual Device does not support WebView.

**Severity:** Important for simulator-only development. The package built successfully, but could not be demonstrated on this target.

**Workaround used:** Built a native React Native for Vega version from the `helloWorld` template. It installed and launched in the same Ubuntu Virtual Device; the town, remote focus, retry flow, Back behavior, and a complete five-round game were tested there.

**Suggestion:** When a WebView package is built for or installed on Ubuntu Virtual Device, show a target compatibility message that names the unavailable WebView module and points to supported simulator choices and the native Vega path. This would make the working route clear earlier in the build workflow.
