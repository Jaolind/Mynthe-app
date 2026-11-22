# Teknologi: Tech stack, distribution, dansk lyd og assets til et læringsspil for 5-7-årige (solo-hobbyudvikler, React/TS-baggrund)

Research date: 2026-11-14. Note on method: expo.dev could not be fetched because the session network blocked it, so the Expo facts come from search snippets of docs.expo.dev and expo.dev pages. Many engine-specific audio findings come from forums and are anecdotal. Where a claim rests on general knowledge rather than a source fetched in this session, it is listed under Gaps or Inferences, not under Cited Findings.

## 1. Tech stack comparison (PWA, React Native/Expo, Flutter/Flame, Godot 4, Phaser/PixiJS in Capacitor, Unity)

### Takeaway
For a React + Vite + TypeScript developer building a simple 2D drag-and-drop, tap-and-listen learning game, there are two strong options. The cheapest and fastest is a React/Vite PWA, optionally with PixiJS/Phaser for game scenes, wrapped in Capacitor later if needed. The more "native-feeling" option is Expo/React Native with expo-audio, Reanimated, Gesture Handler and Skia. Godot, Flutter/Flame and Unity work, but they mean learning a new language and toolchain for little gain at this level of game complexity. The main technical risk in every web-based route is audio on iOS WebKit.

### Cited Findings
**PWA on iOS (2025-2026)**
- iOS still evicts web storage: a seven-day cap on script-writable storage has applied since iOS 13.4, with LRU eviction under storage pressure. Several sources report that home-screen PWAs are exempt from the 7-day timer, but Apple does not clearly document it. — [Apple Developer Forums: Safari iOS PWA Data Persistence Beyond 7 Days](https://developer.apple.com/forums/thread/710157); [MagicBell iOS PWA guide](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide)
- Storage quota: one source says an origin gets about 20% of disk, rising to about 60% for home-screen web apps. MagicBell instead cites 50 MB, which conflicts with this and looks outdated. — [MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide); [youngju.dev PWA 2026 deep-dive](https://www.youngju.dev/blog/culture/2026-05-16-pwa-service-workers-2026-workbox-vite-pwa-capacitor-twa-ios-web-push-deep-dive.en)
- Safari-tab storage and home-screen-app storage are separate. Data written while using the site in Safari is not visible to the installed home-screen app. — [MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide)
- Sources contradict each other on the Persistent Storage API on iOS. One says it needs notification permission, another says requests are always denied. — [MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide); [swoff iOS Safari limitations](https://swoff.netlify.app/docs/concepts/ios-safari-limitations)
- iOS 16.4 (March 2023) added Web Push and badges for home-screen web apps. Monterail reports that iOS 26 opens sites added to the Home Screen as web apps by default. — [Monterail: PWA for Apple iOS](https://monterail.com/blog/pwa-for-apple-ios)
- There is still no `beforeinstallprompt` on iOS. A claim that Apple added a native install prompt in 2026 came only from a low-credibility site and could not be verified. — [noman-web-developer (low credibility)](https://noman-web-developer.vercel.app/news/apple-expands-pwa-support-ios-2026); [MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide)
- iOS WebView (WKWebView, used by PWAs and Capacitor apps) has extra audio restrictions compared with Safari tabs, and neither the simulator nor desktop Safari reproduces mobile audio behavior. Bluetooth adds 100-300 ms of latency that the browser cannot detect. — [abratabia: mobile audio issues](https://abratabia.com/web-game-audio/mobile-audio-issues.php)
- iOS requires a user gesture before audio playback or `speechSynthesis.speak()` can start. — [SpeechSynthesis in browsers and OSes (Readium)](https://readium.org/speech/docs/WebSpeech.html); [Apple Dev Forums thread 49875](https://developer.apple.com/forums/thread/49875)

**Phaser/PixiJS in Capacitor**
- Phaser developers report unreliable Web Audio in iOS Capacitor/Cordova builds. Common workarounds are `disableWebAudio: true` (HTML5 audio), switching to m4a, or using Howler.js. Most of these threads date from 2019-2021. — [Phaser Discourse: Phaser 3 + Web Audio Help](https://phaser.discourse.group/t/phaser-3-web-audio-help/5451); [Phaser Discourse: iOS audio delayed](https://phaser.discourse.group/t/ios-audio-delayed-problem/7413); [Silent Audio in iOS with Cordova](https://phaser.discourse.group/t/silent-audio-in-ios-with-cordova/14690)
- Some Phaser 3 + Capacitor Android APK builds show white screens, texture failures and orientation problems. — [Phaser Discourse](https://phaser.discourse.group/t/phaser-3-capacitor-android-apk-white-screens-texture-rendering-failures-and-orientation-issues/15571)

**React Native / Expo**
- `expo-av` is deprecated in SDK 54 and no longer patched. It is removed in SDK 55 and replaced by `expo-audio` and `expo-video`. — [Expo docs v54: AV](https://docs.expo.dev/versions/v54.0.0/sdk/av.md); [expo/expo-av GitHub](https://github.com/expo/expo-av)
- The migration maps `Audio.Sound` to `useAudioPlayer` and `Audio.Recording` to `useAudioRecorder`. `expo-audio` therefore covers both playback and recording of a parent's voice. — [Expo SDK 55 migration guide (reactnativerelay)](https://reactnativerelay.com/article/expo-sdk-55-migration-guide-breaking-changes-sdk-53-to-55)
- EAS Build free plan: Expo's billing docs and an October 2026 review list up to 15 Android + 15 iOS builds per month on a low-priority queue (previously 30 builds per month in total). The quota resets monthly, builds that fail within 3 minutes are partly waived, and the Starter plan costs $19/month with $45 in build credit. — [Expo billing plans](https://docs.expo.dev/billing/plans.md); [vibecoding.app EAS review 2026](https://vibecoding.app/blog/expo-eas-review); [Expo changelog: fast-failed builds](https://expo.dev/changelog/2024-05-02-fast-failed-builds-exclusion); [agentdeals Expo free tier](https://agentdeals.dev/vendor/expo)
- One third-party source says free-plan builds are cancelled after 45 minutes. Expo's own docs say only that the time limit is "lower" on free. — [newly.app EAS guide](https://newly.app/guides/eas-build); [Expo build limitations](https://docs.expo.dev/build-reference/limitations.md)

**Godot 4**
- Godot 4.5 dev web exports crashed on iOS Safari/Chrome when audio played. This was reported fixed in 4.5 beta 2, but other users still had problems on 4.3/4.4. — [Godot forum: sounds crash web game on mobile](https://forum.godotengine.org/t/sounds-crash-my-web-game-on-mobile-browser-godot-4-5-dev5-html-export-on-itch/113237); [Godot forum: iOS HTML export crashes](https://forum.godotengine.org/t/game-crashes-randomly-on-ios-devices-html-export/114043)
- Android audio latency in Godot 4.6 is still reported as an open issue (2026). One rhythm game measured a 165 ms offset, and `get_output_latency()` returned 0 on Android. — [Godot forum: Audio latency on Android](https://forum.godotengine.org/t/audio-latency-on-android-devices/134704); [Godot forum: rhythm game 165 ms](https://forum.godotengine.org/t/rhythm-game-has-a-165-ms-delay-running-on-mobile/133858)
- The Compatibility renderer is recommended for 2D, web and older Android phones. Godot 4.5 added Android debug symbols. Godot publishes regular mobile updates (April 2026). — [Strayspark Godot 4.6 export guide](https://www.strayspark.studio/blog/godot-46-export-web-android-ios-guide); [Godot release candidate 4.5.2](https://godotengine.org/article/release-candidate-godot-4-5-2-rc-1/); [Godot mobile update Apr 2026](https://godotengine.org/article/godot-mobile-update-apr-2026/)

### Inferences
- **Reusing the React/TS skill set:** PWA (React + Vite + vite-plugin-pwa) reuses 100% of it, including the existing repo, tooling and AI assistant workflows. Expo/RN reuses React, TS and hooks, but swaps the DOM for RN primitives and adds Reanimated, Gesture Handler and Skia. That is moderate new learning, but AI assistants know it well. Phaser/PixiJS is TS-native and slots into Vite. Flutter (Dart), Godot (GDScript/C#) and Unity (C#) all mean a new language, editor and asset pipeline.
- **2D game and animation needs for 5-7-year-olds** (drag letters to pictures, tap objects, simple tweens, confetti) are modest. CSS/Framer Motion or PixiJS on the web, and Reanimated + Skia in RN, are enough. Godot, Unity and Flame shine for physics, tilemaps and larger scenes, which this project probably does not need.
- **Drag-and-drop and touch:** On the web, use Pointer Events with `touch-action: none`. Libraries like dnd-kit work but are tuned for lists; for game-style drag, hand-rolled pointer handlers or PixiJS/Phaser input are simpler. In RN, Gesture Handler + Reanimated runs gestures on the UI thread.
- **Audio latency:** For "tap a letter and hear its sound", around 100 ms is acceptable. This is not a rhythm game, so latency matters less than reliability: sounds must play at all, the audio context must be unlocked, and the silent switch must be handled. Preloading short clips with Howler.js or the Web Audio API on the web, or `expo-audio` on native, should be fine.
- **Suggested path:** (1) Build as a React + Vite PWA with offline precaching of all audio and images. Test on the actual family device early. (2) If iOS storage eviction or audio becomes a problem, or a "real app" icon is wanted on iOS, wrap the same code with Capacitor, which keeps data in the app sandbox and gives native audio plugins. (3) Choose Expo instead only if the parent wants a native-first app from the start. Avoid Unity, Godot and Flutter unless the game ambitions grow considerably.
- **Cost:** PWA can be $0 to host (GitHub Pages, Netlify or Vercel free tiers). Expo and Capacitor are free to build locally. Building for iOS locally needs a Mac with Xcode; EAS cloud builds avoid that within the free quota.

### Gaps
- Could not fetch expo.dev directly (network blocked). Expo Go SDK-version constraints are not verified: Expo Go supports only the latest SDK, and native modules outside the Expo SDK need a development build.
- No first-party 2025-2026 benchmark comparing audio latency across PWA, RN, Flutter and Godot was found. All latency evidence is anecdotal.
- Flutter + Flame and Unity were not specifically researched this session (no fresh sources). Unity's runtime-fee controversy was cancelled in 2024 according to general knowledge, but this was not verified here.
- React Native Skia / Reanimated 4 current versions and capabilities were not verified this session.

## 2. Distribution for personal use (iOS, Android, PWA) and kid lock-down

### Takeaway
The easiest, $0, no-expiry route to one family phone is a PWA added to the Home Screen, on iOS or Android, or a sideloaded APK on Android via ADB or Android's new free hobbyist account. On iOS, a native app without paying Apple means free provisioning: reinstall every 7 days, maximum 3 apps. A paid Apple Developer Program membership gives TestFlight and roughly one-year profiles. For lock-down, use Guided Access on iOS, which has its own passcode and is stronger than Android's Screen Pinning.

### Cited Findings
- Free Apple account (Xcode "Personal Team"): up to 3 apps per device, provisioning profiles expire 7 days after issue (rebuild and reinstall), and 10 App IDs per 7 days. Free is for personal on-device testing only. Paid team profiles last about a year. — [Apple: Choosing a Membership](https://developer.apple.com/support/compare-memberships); [Apple Dev Forums: Xcode app limit](https://developer.apple.com/forums/thread/745359); [Apple Dev Forums: bundle IDs limit](https://developer.apple.com/forums/thread/724896)
- Android developer verification: Google is rolling out developer verification for apps installed on certified Android devices. Enforcement starts on 30 September 2026 in select regions and goes global in 2027. — [Android Developers Blog, Mar 2026](https://android-developers.googleblog.com/2026/03/android-developer-verification-rolling-out-to-all-developers.html); [Google support: Understanding Android developer verification](https://support.google.com/android-developer-console/answer/16561738)
- Google offers a free "limited distribution" account for students and hobbyists. It lets you share an app with up to 20 devices and needs only an email, no government ID. Sources differ on whether this arrived in June or August 2026. — [Android Developers Blog](https://android-developers.googleblog.com/2026/03/android-developer-verification-rolling-out-to-all-developers.html); [winaero](https://winaero.com/google-introduces-limited-unverified-developer-registration-for-android-apps)
- ADB install of unverified apps on your own device remains allowed. There is also a new "advanced flow" (a one-time security process) for sideloading unregistered apps. — [Google support FAQ](https://support.google.com/android-developer-console/answer/16561738); [Engadget](https://engadget.com/apps/android-will-hide-app-sideloading-behind-a-new-one-time-security-process-184651171.html)
- Guided Access (iOS) locks the device to one app, lets you mask screen areas, and has a separate exit passcode. Android Screen/App Pinning uses the device PIN to unpin, so it is weaker if the child knows the phone PIN. — [42gears: Guided Access](https://42gears.com/blog/how-to-use-guided-access-on-iphone-and-ipad/); [CyberGuy: lock iPhone or Android to one app](https://cyberguy.com/daily-tech-tip/lock-iphone-android-one-app/?print=print); [Scalefusion](https://blog.scalefusion.com/how-to-lock-phone-on-one-app/)
- Android pinning: Settings → Security → App pinning, then enable "require PIN to unpin". Menu names vary by OEM. — [PopSci: kid-proof any phone](https://www.popsci.com/how-to-kid-proof-any-phone-or-tablet/)

### Inferences
- **For one family device:**
  - iOS: a PWA (free, permanent) or a Capacitor/Expo app via free provisioning (7-day reinstall, which is annoying). The $99/year program pays off if the parent wants it to "just work" via TestFlight or a long-lived install.
  - Android: a PWA, or `adb install` / Expo `eas build --profile preview` producing an APK. With verification enforced, register with the free hobbyist account or keep using ADB.
- No app store listing is needed. Publishing to the stores as a kids' app would add Apple Kids Category and Google Families policy requirements, privacy labels and review. That is overkill for personal use.
- Guided Access works with any app, including PWAs, so lock-down does not favor any stack.

### Gaps
- The Apple Developer Program price ($99/year, or the local DKK equivalent) and TestFlight specifics were not confirmed by a source fetched this session. General knowledge: up to 100 internal testers, builds expire after 90 days, external testing needs Beta App Review.
- The Google Play one-time $25 registration fee was not verified this session.
- No confirmation of whether the 20-device hobbyist account is already available in Denmark/EU as of November 2026.
- The EU DMA (alternative marketplaces, web distribution on iOS in the EU) was not researched. It likely needs a paid account and is irrelevant for one device.

## 3. Danish audio: TTS, parent voice recording, phoneme assets, speech recognition

### Takeaway
High-quality Danish neural TTS exists from Azure (da-DK-ChristelNeural, da-DK-JeppeNeural), Google Cloud (Chirp 3 HD with GA da-DK since August 2025) and ElevenLabs (Danish supported, free tier limited to non-commercial use). On-device Web Speech API voices on iOS are unreliable: Safari often lists only low-quality voices and hides enhanced/Siri voices. The best approach is to pre-generate all words and sentences with cloud TTS at build time, bundle them as static audio files for offline use, and record the parent's own voice for letter sounds (phonemes). Danish child speech recognition is not realistically feasible for a hobby project.

### Cited Findings
- Azure Danish neural voices: da-DK-ChristelNeural (female) and da-DK-JeppeNeural (male). Christel launched in a 15-language neural expansion, and in 2023 got improved reading of English words in Danish text. Jeppe supports SSML. — [Microsoft Tech Community: Neural TTS extends to 15 more languages](https://techcommunity.microsoft.com/t5/azure-ai/neural-text-to-speech-extends-support-to-15-more-languages-with/ba-p/1505911); [Tech Community: mixed-lingual improvement](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/azure-neural-tts-improves-english-word-reading-for-mixed-lingual/ba-p/3785920); [json2video: Jeppe](https://json2video.com/ai-voices/azure/voices/da-dk-jeppeneural/); [SignalWire Azure voice list](https://docs.signalwire.com/voice/tts/azure)
- Older Microsoft Q&A users asked for more Danish voices than the two available. — [Microsoft Q&A: additional Danish voices](https://learn.microsoft.com/en-us/answers/questions/261890/add-aditional-danish-voices-to-audio-content-creat)
- Google Cloud TTS: Chirp 3 HD voices became GA for da-DK in August 2025, and the regions include eu/europe-west2. MP3 output is available in batch mode. — [Google Cloud: Chirp 3 HD](https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd); [Cloud TTS release notes](https://docs.cloud.google.com/text-to-speech/docs/release-notes?hl=id); [Google Cloud voice list](https://cloud.google.com/text-to-speech/docs/voices)
- ElevenLabs supports Danish (v3 has the broadest language coverage). The free tier gives about 10,000 credits per month, is non-commercial, and requires attribution. The Starter plan (about $5-6/month) adds a commercial license. — [ElevenLabs Danish TTS](https://elevenlabs.io/ja/text-to-speech/danish); [ElevenLabs for developers](https://start.elevenlabs.io/cp/for-developers); [Puter: ElevenLabs API pricing Jun 2026](https://developer.puter.com/tutorials/elevenlabs-api-pricing/)
- Web Speech API on iOS: Safari exposes only low-quality voices even when better ones are installed. Downloaded and Siri voices do not appear in `getVoices()`. A voice disappeared after iOS 17, and voices went missing in iOS 18. Speech requires a user gesture. — [Apple Dev Forums: voices missing since iOS 18](https://developer.apple.com/forums/thread/764438); [Apple Dev Forums: not all voices listed](https://developer.apple.com/forums/thread/723503); [Readium: SpeechSynthesis in browsers](https://readium.org/speech/docs/WebSpeech.html); [web-speech-recommended-voices (GitHub)](https://github.com/HadrienGardeur/web-speech-recommended-voices)
- Recording audio: `expo-audio` provides `useAudioRecorder` (successor to `Audio.Recording`). — [reactnativerelay SDK 55 migration guide](https://reactnativerelay.com/article/expo-sdk-55-migration-guide-breaking-changes-sdk-53-to-55)
- Child ASR: research on Dutch child speech (a comparable low-resource language) found that reliable ASR for children "remains challenging in low-resource languages" and that fine-tuning on child speech is needed. Whisper fine-tuned on child speech improves WER by 29-89% relative, and fine-tuned Wav2Vec2 can beat Whisper. — [Lathouwers et al., arXiv 2605.28833](https://arxiv.org/pdf/2605.28833); [Kid-Whisper, arXiv 2309.07927](https://arxiv.org/html/2309.07927v3); [Jain et al., IEEE Access 2024](https://doaj.org/article/0511c1c47cad47ab8ad278b14388fd9e); [arXiv 2307.13008](https://arxiv.org/pdf/2307.13008)

### Inferences
- **Recommended audio pipeline:** a script (Node/TS) reads a word list (JSON) and calls Azure or Google TTS once. Both have free monthly quotas (not verified this session), and the volume needed is tiny. Save MP3/M4A files into `public/audio/` and precache them via the service worker or bundle them in the native app. Runtime is then fully offline, with no API key on the device and no privacy exposure.
- **Letter sounds (lydbogstaver):** TTS is poor at isolated phonemes. Reading "m" aloud yields the letter name "æm", not the sound /m/. The parent should record letter sounds themselves, either in the app via MediaRecorder / `expo-audio` or in Audacity. This also personalises the game: the child hears a parent's voice. SSML phoneme tags could be tried in Azure, but this is not verified for Danish.
- **In-app parent recording:** on the web, MediaRecorder + IndexedDB works but faces iOS eviction risk, so export or back up recordings. On native, write the files to the app's document directory.
- **Speech recognition:** skip it for v1. For "say the word", use a parent-in-the-loop design (parent taps ✓) or simple keyword matching via on-device speech recognition with a lenient threshold. Expect poor accuracy for 5-year-old Danish speech.
- Prefer Azure or Google over ElevenLabs if output might ever be shared publicly, given ElevenLabs' free-tier non-commercial and attribution terms.

### Gaps
- Current free-tier quotas for Azure Speech (F0) and Google Cloud TTS in 2026 were not verified.
- Whether Azure added new da-DK voices (e.g. HD/DragonHD) by 2026 was not verified.
- The name and quality of the iOS Danish on-device voice ("Sara") and of Android Google TTS Danish through Web Speech were not confirmed by a source.
- No Danish child-speech ASR dataset or benchmark was found.
- No free licensed set of Danish phoneme (letter-sound) recordings was found. Danish publishers (e.g. Alinea, Gyldendal) likely have them in paid material, but this is unverified.

## 4. Free assets, AI art and Danish/early-reader fonts

### Takeaway
Kenney.nl gives 30,000-40,000+ CC0 assets (no attribution needed). That, plus OpenGameArt (check each licence) and AI-generated images for themed illustrations, covers visuals. For text, Andika (SIL OFL) is purpose-built for beginning readers with single-story "a" and "g" and full Latin coverage including æ, ø, å. Lexend is another free option. No dedicated free Danish "school font" with single-story glyphs was confirmed.

### Cited Findings
- Kenney: all game assets are public domain (CC0), attribution is optional, and the assets are funded by donations. The catalog is 30,000+ assets per Defold, and a 2026 guide says 40,000+. — [Kenney support](https://kenney.nl/support); [Kenney Space Shooter Redux](https://kenney.nl/assets/space-shooter-redux); [Defold: Kenney assets](https://defold.com/assets/kenney); [Cinevva free 2D sprites 2026](https://app.cinevva.com/guides/free-2d-sprites-tilesets)
- Andika: designed by SIL to maximise legibility for new readers. It has single-story "a" and "g" that look like handwriting, and a distinct I/l/1. Double-story forms are available via feature ss01. It is licensed under the SIL OFL with the reserved name "Andika". — [Wikipedia: Andika](https://Www.wikipedia.org/wiki/Andika_(typeface)); [CTAN Andika design doc](https://softlibre.unizar.es/ctan/fonts/andika/doc/design.md); [Material Design blog: SIL typefaces](https://material.io/blog/sil-typefaces)
- Lexend is described as designed to reduce visual stress and improve reading speed. OpenDyslexic is mentioned for dyslexia. — [iubenda (DA): most accessible fonts](https://www.iubenda.com/da/help/183417-de-mest-tilgaengelige-skrifttyper-saadan-vaelger-du-typografi-der-understoetter-inklusion/)
- Kids' font criteria: single-story a/g, open forms, generous spacing, and clear b/d and l/I/1 distinction. Comic Neue is suggested as a better Comic Sans. — [MadeGoodDesigns: best fonts for kids](https://madegooddesigns.com/best-fonts-for-kids/)

### Inferences
- Use Andika as the main reading font, self-hosted as WOFF2 so it works offline. Verify that Lexend's "a"/"g" are double-story before using it for letter learning, since Lexend uses a double-story "a" by default (general knowledge, unverified). For letter-recognition tasks, consistency with how Danish schools teach letters matters more than font novelty.
- AI-generated art (e.g. image models) is fine for private family use. If the app is ever shared publicly, check the model's terms. Also note that AI art often has inconsistent style across images, so generate a style sheet first.
- Sound effects: Kenney also has CC0 audio packs, and other CC0 SFX sources (e.g. freesound with a CC0 filter) exist but were not verified this session.

### Gaps
- "Skrivesystem"/Danish school handwriting fonts were not found as free fonts. Danish schools use different handwriting systems (e.g. "Formskrift"), but no free digital font could be verified.
- OpenGameArt and Freesound licence details were not fetched this session.
- No research was found on whether AI art affects kids' engagement.

## 5. Local-only progress storage vs simple backend (Supabase); privacy

### Takeaway
For one child on one device, store progress locally: IndexedDB/localStorage in a PWA, or AsyncStorage/SQLite/MMKV in RN. A parent "dashboard" screen behind a parental gate in the same app is enough. Add Supabase only if the parent wants to see progress from a separate device. That adds auth, GDPR considerations for a child's data, and a dependency. On iOS PWAs, local storage has an eviction risk that must be mitigated.

### Cited Findings
- iOS Safari applies a 7-day cap on script-writable storage and LRU eviction. Home-screen apps reportedly behave differently, but this is undocumented. Persistent-storage behavior is disputed. — [Apple Dev Forums 710157](https://developer.apple.com/forums/thread/710157); [MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide)
- Safari and home-screen PWA storage are separate silos. — [MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide)

### Inferences
- **Mitigations for a PWA:**
  - Always launch from the Home Screen icon.
  - Call `navigator.storage.persist()`. It is harmless even if denied.
  - Offer "export progress" (a JSON download or copy-to-clipboard) in the parent area.
  - Or wrap the app in Capacitor, where app-sandbox storage is not subject to Safari's eviction policy.
- **Local-only privacy benefit:** no personal data about the child leaves the device. That means no GDPR processor agreements, no auth and no running costs, and the app works fully offline.
- **Supabase option:** the free tier (pauses after inactivity per general knowledge, unverified) plus email magic-link auth for the parent only. Store a pseudonymous child ID and aggregate scores only, never voice recordings. Choose an EU region.
- Since TTS audio is pre-generated, no runtime calls to cloud services are needed. This keeps the app offline-capable and private.

### Gaps
- Current Supabase free-tier terms (project pausing, EU regions) were not verified this session.
- No authoritative Apple source was found confirming that home-screen PWAs are exempt from the 7-day eviction.
- Danish/EU rules (GDPR Art. 8, Datatilsynet guidance) for a private family app were not researched. Purely household activity is likely outside GDPR scope, but this is unverified.
