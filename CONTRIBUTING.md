# Contributing

Keep changes focused on the kindergarten learning experience. Every new game should have correct deterministic answer checks, a visual demonstration, independent practice, helpful retry feedback, captions, and large controls that work with keyboard and touch.

Run `npm test` and `npm run build`. Try both lesson and practice modes at a narrow mobile width and on desktop. Check that replay, mute, hints, reset, completion, and Town/Back cancel any earlier animation or audio.

Edit canonical files in `web/`; run `npm run android:sync` to update the native package. Keep models, private credentials, local paths, signing keys, ads, analytics, and child personal data out of the project. A new spoken line also needs a bundled, appropriately licensed clip, or an explicit captions-only fallback.
