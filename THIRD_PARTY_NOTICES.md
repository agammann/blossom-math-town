# Third-party notices

Original Blossom lesson text, browser code, and the original town/monster/object illustrations are distributed under the root MIT license. The third-party components below keep their separate licenses.

| Component | Use | License / source |
| --- | --- | --- |
| Nunito | Bundled local font | [SIL Open Font License 1.1](web/assets/FONT-LICENSE.txt); [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/nunito) |
| Kokoro-82M v1.0 and Kokoro ONNX | British Emma (`bf_emma`) voice used to render finished audio clips | [Apache License 2.0](web/assets/narration/KOKORO-LICENSE.txt); [model](https://huggingface.co/hexgrad/Kokoro-82M), [ONNX conversion](https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX) |
| kokoro-js 1.2.1 | Local narration production only, not shipped as a runtime dependency | [Apache License 2.0](web/assets/narration/KOKORO-LICENSE.txt); [implementation](https://github.com/hexgrad/kokoro) |
| Capacitor 8.5.2 | Local Android WebView wrapper | MIT; [license](licenses/CAPACITOR-LICENSE.txt), [source](https://github.com/ionic-team/capacitor) |
| AndroidX and Gradle | Android build/runtime components | Apache License 2.0; [AndroidX](https://source.android.com/docs/setup/about/licenses), [Gradle](https://github.com/gradle/gradle/blob/master/LICENSE) |

The [narration notice](web/assets/narration/NOTICE.txt) identifies Emma and the production settings. Only finished audio files are bundled; no inference model or hosted voice API is included. Emma is a synthetic British English voice, and is not presented as the voice of any actor or show character.

The public project contains no private Sites metadata, authentication tokens, signing keys, or local SDK paths. npm and Gradle dependencies downloaded during setup have their own included notices. Keep these notices and license files when redistributing the app or its assets.
