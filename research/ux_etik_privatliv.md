# UX/interaction design, ethical design and privacy/legal requirements for mobile learning games for children aged 5-7 (Denmark, possible app-store publication)

Research date: 14 Nov 2026. Note on method: nngroup.com, support.google.com, developers.google.com and pmc.ncbi.nlm.nih.gov could not be fetched from this session (blocked by network settings), so content from those sites comes from search-result snippets, not full-page reads. Apple's guideline pages were read in full.

## 1. Child UX design guidance (touch, gestures, pre-readers, audio, feedback, navigation, parental gate, session length)

### Takeaway
For 5-7-year-olds, design for big targets (at least 2 x 2 cm), single-finger tap/swipe/simple drag, and spoken (not written) instructions. Feedback should be positive and multimodal (sound + visual), and play sessions short. Avoid or soften pinch, multi-finger and long-press gestures. Put anything adult (settings, purchases, links) behind a parental gate with a voice prompt telling the child to fetch a parent.

### Cited Findings
**Touch targets and motor skills**
- NN/g recommends touch targets of at least 2 cm x 2 cm for young children, four times its 1 x 1 cm adult recommendation. The reasoning is that young children's gross motor skills are better developed than their fine motor skills. This comes from NN/g user testing with children aged 3-12 in the US and China. — [NN/g: Children's UX: Physical Development](https://www.nngroup.com/articles/children-ux-physical-development/) (search snippet only; page not fetched)
- NN/g example: two 7-year-olds struggled to tap the small "x" to close an ad in the Sketchbook app. — [NN/g](https://www.nngroup.com/articles/children-ux-physical-development/) (snippet)
- NN/g summary: swiping and tapping big targets are easy for all children, but fine mouse/trackpad gestures such as dragging are hard for young kids. — [NN/g Young Users topic](https://www.nngroup.com/topic/young-users/) (snippet)

**Gestures**
- A Korean study of 90 children aged 2-8 found that 4-6-year-olds can perform single-finger touchscreen gestures, and some 7-8-year-olds can also perform multi-finger gestures. Children aged 4-6 follow non-textual prompts better, and text prompts were the hardest type. — [koreascience.kr study (PDF)](https://koreascience.kr/article/JAKO202026163872504.pdf)
- In a study of pre-kindergarten children, drag was harder than tap but most children could do it. Pinch, stretch and rotate were the hardest to perform successfully. Long press had problems because it is time-constrained. — [Nacher et al., UPV (PDF)](https://riunet.upv.es/bitstream/10251/64752/3/VersionAutor.pdf); [UPV short paper](https://riunet.upv.es/bitstream/10251/77963/4/shortpaperVersionAutor.pdf)
- Children aged 5-10 with Down syndrome could not perform long press without assistive strategies. — [UPV manuscript (PDF)](https://riunet.upv.es/bitstream/10251/123466/3/ManuscriptAV.pdf)
- CHI 2016 preliminary study (small sample, ages 5-10): children aged 5-7 scratched out drawn gestures more often and made more stray marks than children aged 8-10. Recognition of drawn gestures and handwriting therefore needs to be tolerant. — [Shaw & Anthony, CHI 2016 (PDF)](https://init.cise.ufl.edu/wp-content/uploads/sites/378/2017/05/Shaw-and-Anthony-CHI2016-1.pdf)

**Pre-/early readers, audio and feedback**
- Google's "Building for kids" guidance:
  - Most children under 5 cannot read and may not know how to turn the sound on if it is off.
  - Combine sound, visuals and text for feedback.
  - After an error, give positive audio/visual feedback so the child quickly gets back into the experience.
  — [Google: Designing engaging apps](https://developers.google.com/building-for-kids/designing-engaging-apps) (snippet; page not fetched)
- Preschoolers expect visual, audio or haptic feedback when they interact. — [UXmatters: Design for Kids](https://uxmatters.com/mt/archives/2014/07/design-for-kids-digital-products-for-playing-and-learning.php)
- A Joan Ganz Cooney Center study of PBS KIDS literacy apps recommends designing for shorter playtimes and keeping apps developmentally appropriate. — [Cooney Center learning apps report (PDF)](https://www.bestbeginningsalaska.org/wp-content/uploads/learningapps_final_110410.pdf)
- The PBS KIDS Games app offers adjustable audio settings, playback speed and visual contrast options. — [PBS KIDS app accessibility flyer, 2026 (PDF)](https://www.wxxi.org/wp-content/uploads/2026/01/PBS-KIDS-Free-App-Accessibility-Features.pdf)

**Parental gate (Apple)**
- A parental gate is an adult-level task that must be completed before a child can buy something or follow a link out of the app (web, social networks, other apps). Apple's examples are a math task and answering a question. For pre-literate children, Apple suggests a voiceover prompt that tells the child to get a parent. — [Apple: Age-appropriate experiences / Kids apps](https://developer.apple.com/app-store/kids-apps/)

**Session length and screen time (Denmark)**
- Sundhedsstyrelsen's current screen recommendations were revised in autumn 2023. They include no screens before bedtime and adults avoiding their own screens when with children. For ages 2-4 the advice is to limit screen time so the child gets enough physical activity, with the WHO limit of at most 1 hour of sedentary screen time per day as a reference. I found no 2025 update. — [Sundhedsstyrelsen baggrundsnotat Oct 2023](https://www.sst.dk/-/media/Udgivelser/2023/Skaerm/Baggrundsnotat---Sundhedsstyrelsens-anbefalinger-om-skaermbrug-06102023.ashx); [SST anbefalinger (PDF)](https://www.sst.dk/-/media/Borger/Søvn/SKAERM_SST_ANBEFALINGER.ashx); [SDU: skærm-guide for school-age children](https://www.sdu.dk/da/nyheder/tema/tema-klar-til-skolestart/skaerm-en-guide-til-foraeldre-med-skoleboern)

### Inferences
- Practical gesture policy for ages 5-7:
  - Primary: tap and swipe.
  - Secondary: drag-and-drop with generous snap zones that forgive imprecise drops.
  - Avoid: pinch/zoom, rotate, multi-finger gestures, double-tap, and long press. If long press is used, keep the hold short with visual progress, never as the only way to do something.
- Every instruction should be spoken, with a "replay instruction" button (e.g. a speaker or face icon). Text should be decorative or optional. A 5-year-old in Danish børnehaveklasse is usually a pre-reader.
- Wrong answers: use a neutral or encouraging sound, show a hint, and avoid "fail" sounds or lost lives.
- Keep navigation shallow (about 1-2 levels for the child area) and always show a clearly visible "home" button. Natural stopping points (e.g. 5-10-minute levels) fit Sundhedsstyrelsen's limit-screen-time advice. A gentle end-of-session ritual may help, but this is a design inference, not a sourced figure.
- Since sound may be off, show a visual cue (e.g. an animated speaker) when narration is playing or available.

### Gaps
- Could not access Debra Levin Gelman's "Design for Kids" (Rosenfeld, 2014) or Sesame Workshop's design guidance. No age-band specifics from these are included.
- No sourced, evidence-based optimal session length specifically for 5-7-year-olds. The WHO 1-hour figure is for ages 2-4.
- NN/g's exact age segmentation and full gesture tables were not verifiable because the page could not be fetched.

## 2. Ethical design and dark patterns in kids' apps

### Takeaway
Manipulative design is the norm in apps for young children (only about 1 in 5 apps was free of it in Radesky et al. 2022). EU and UK guidance explicitly targets streaks, push notifications, autoplay, engagement-driven features and nudges. A hobby learning game should simply have no ads, no purchases, no streaks or loss-framed rewards, and no artificial time pressure.

### Cited Findings
- Radesky et al. (2022), "Prevalence and Characteristics of Manipulative Design in Mobile Applications Used by Children," JAMA Network Open, doi:10.1001/jamanetworkopen.2022.17641:
  - Coded 160 apps used by children aged 3-5.
  - Most apps contained manipulative design: parasocial relationship pressure (a character urges the child to keep playing or pay), fabricated time pressure, navigation constraints, and lures to play longer or buy.
  - Only about 1 in 5 apps was free of these features, and nearly 99% of children had at least one manipulative design in their top-used apps.
  - Exposure was higher for children from lower-income or lower-education households.
  — [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC9206186/) (snippet); [Michigan Medicine summary](https://www.michiganmedicine.org/health-lab/design-tricks-commonly-used-monetize-young-childrens-app-use); [deceptive.design summary](https://deceptive.design/articles/prevalence-and-characteristics-of-manipulative-design-in-mobile-applications-used-by-children)
- The paper deliberately uses "manipulative design features" instead of "dark patterns." Disclosure: Radesky previously sat on the Noggin advisory board, and Noggin was among the apps coded (by assistants). — [EurekAlert release](https://www.eurekalert.org/news-releases/956153)
- European Commission guidelines on protection of minors under DSA Art. 28, final version published 14 July 2025:
  - Non-binding, but the Commission uses them as the compliance benchmark for Art. 28(1).
  - Platforms should disable by default features that drive excessive use, such as communication streaks, ephemeral content, read receipts, autoplay, push notifications and other engagement-driven design.
  - They also cover manipulative design, follow a risk-based approach, and stress privacy, safety and security by design.
  — [EC digital-strategy: guidelines published](https://digital-strategy.ec.europa.eu/en/library/commission-publishes-guidelines-protection-minors); [Hunton summary](https://www.hunton.com/privacy-and-information-security-law/european-commission-issues-guidelines-on-the-protection-of-minors); [Taylor Wessing summary](https://www.taylorwessing.com/de/insights-and-events/insights/2025/07/rd-european-commission-guidelines-on-protection-of-minors-under-the-digital-services-act)
- UK ICO Age Appropriate Design Code (Children's Code):
  - In force since 2 September 2021, with 15 standards, for online services likely to be accessed by under-18s.
  - Standard 7, default settings: settings must be "high privacy" by default, and geolocation off by default.
  - Standard 13, nudge techniques: do not use nudges that lead children to provide unnecessary personal data or weaken or turn off privacy protections.
  - Other standards include best interests of the child, data minimisation, transparency, parental controls and profiling off by default.
  — [ICO code PDF v2.1](https://ico.org.uk/media/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services-2-1.pdf); [gov.uk guidance](https://gov.uk/guidance/child-online-safety-data-protection-and-privacy); [TIGA summary](https://tiga.org/?p=9917)
- Apple 1.3: Kids Category apps must not include links out, purchasing opportunities "or other distractions to kids" unless behind a parental gate. — [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- COPPA 2025 (see section 3): separate parental opt-in consent is required for disclosing children's data for targeted advertising. — [Jones Day](https://jonesday.com/en/insights/2025/05/ftc-finalizes-amendments-to-coppa--rule)

### Inferences
- Ethical checklist for this project:
  - No ads of any kind.
  - No IAP, or if used later, only behind a parental gate in a parent area.
  - No streaks or "you'll lose your progress" messages.
  - No countdown timers or fake scarcity.
  - No character that guilt-trips the child into continuing ("Don't leave me!").
  - No push notifications aimed at the child.
  - No loot boxes or random paid rewards.
  - No autoplay into the next level without a choice.
- Rewards: favour intrinsic and mastery-based feedback (e.g. a sticker collection earned by learning, praise for effort) over variable-ratio or random rewards. Give the child a clear "stop" point.
- The DSA formally applies to online platforms (intermediary services). A standalone offline game with no user-generated content or sharing is very unlikely to be an "online platform." The Commission guidelines are still a good ethical benchmark.

### Gaps
- No specific primary source found on loot-box rules (e.g. Danish or EU positions, Belgium/Netherlands rulings) for children's games.
- 5Rights Foundation guidance (e.g. "Disrupted Childhood", the Child Rights by Design toolkit) not retrieved.
- Whether the EU "Digital Fairness Act" proposal (expected around 2026) has been published and what it says on dark patterns or minors: not verified.
- Full coding taxonomy of Radesky et al. not read (PMC was not fetchable).

## 3. Privacy and legal (GDPR/Denmark, COPPA, Apple Kids Category, Google Play Families, offline-only)

### Takeaway
Correction to the brief: Denmark's digital age of consent is now 15, not 13. It was raised by L 79, in force 1 January 2024. For a 5-7-year-old, any consent-based processing would need parental consent either way. The simplest compliant design is fully offline, with no accounts, no analytics/ads SDKs and progress stored only on the device. That makes app-store privacy labels trivial ("Data Not Collected") and Kids Category / Families requirements easy to meet. A privacy policy is still required for store listing.

### Cited Findings
**GDPR / Denmark**
- Under databeskyttelsesloven § 6, stk. 2 (implementing GDPR Art. 8), the age at which a child can consent to information society services was 13 from 2018. Bill L 79 (2023/24) changed "13" to "15" in § 6, stk. 2 and 3. Per the Folketing answer, the limit was raised from 13 to 15 on 1 January 2024. — [L 79 som fremsat (PDF)](https://www.ft.dk/ripdf/samling/20231/lovforslag/l79/20231_l79_som_fremsat.pdf); [Folketing answer (PDF)](https://ft.dk/samling/20231/almdel/diu/spm/216/svar/2078033/2921323.pdf); [danskelove.dk § 6](https://danskelove.dk/databeskyttelsesloven/6)
- GDPR Art. 8 lets member states set the age between 13 and 16. Below that age, consent must be given or authorised by the holder of parental responsibility, and the controller must make reasonable efforts to verify this. GDPR Art. 2(2)(c) excludes processing "by a natural person in the course of a purely personal or household activity". — [GDPR, EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj) (article content from regulation text; not re-fetched in this session)

**COPPA (US; relevant only if published to US users)**
- Amended COPPA Rule: published 22 April 2025, effective 23 June 2025, general compliance deadline 22 April 2026 (now passed). The FTC signals robust enforcement. — [Federal Register](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule); [Davis Polk, Apr 2026](https://www.davispolk.com/insights/client-update/ftc-prioritizes-coppa-enforcement-new-compliance-obligations-take-effect)
- Key changes:
  - Separate verifiable parental consent before disclosing children's data to third parties for targeted advertising, unless the disclosure is integral to the service.
  - A written data retention policy stating why data is collected and how long it is kept, published in the privacy notice, with no indefinite retention.
  - A written information security program. Sources conflict on whether it must be specific to children's data, and Perkins Coie says a separate program is not required.
  - Reasonable steps to ensure third-party recipients can keep data confidential and secure.
  — [Jones Day](https://jonesday.com/en/insights/2025/05/ftc-finalizes-amendments-to-coppa--rule); [Perkins Coie](https://perkinscoie.com/insights/update/ftc-announces-new-childrens-privacy-requirements-updated-coppa-rule); [Loeb & Loeb](https://www.loeb.com/fr/insights/publications/2025/05/childrens-online-privacy-in-2025-the-amended-coppa-rule)

**Apple App Store (guidelines read in full)**
- 1.3 Kids Category:
  - No links out of the app, purchasing opportunities or other distractions unless behind a parental gate.
  - Once in Kids Category, apps must keep meeting the requirements even if the category is later deselected.
  - No sending of PII or device information to third parties.
  - Apps "should not include third-party analytics or third-party advertising." Limited exceptions: analytics that do not collect the IDFA or any identifiable information about children, their location or devices, and contextual ads with human review of ad creatives.
  — [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- 5.1.4 Kids:
  - Comply with COPPA, GDPR and other laws.
  - Birthdate and parental contact may be requested only for legal compliance.
  - Kids Category apps, and apps collecting personal data from minors (including drawings, photos, persistent identifiers), must have a privacy policy.
  - The parental gate is not the same as parental consent under privacy law.
  - 2.3.8: "For Kids"/"For Children" in metadata is reserved for the Kids Category.
  — [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- Enforcement since June 2019: Apple has enforced the ban on third-party ads and analytics for new Kids apps since then, and developers report rejections over SDKs that can collect the IDFA. — [Apple developer news 2019](https://developer.apple.com/news/?id=06032019j); [Apple forum](https://developer.apple.com/forums/thread/130863)
- Kids Category listing:
  - Requires choosing an age band (5 and under, 6-8, 9-11) and providing parental gates.
  - Age ratings are now 4+, 9+, 13+, 16+, 18+, with an updated questionnaire on parental controls, messaging and advertising.
  - New or updated APIs: Declared Age Range (parents choose whether to share the child's age range), PermissionKit, the SignificantChange API, and server notifications when a parent withdraws consent.
  — [Apple: Kids apps / age-appropriate experiences](https://developer.apple.com/app-store/kids-apps/)

**Google Play Families**
- Scope and enforcement: the policy applies if children are any part of the target audience, and non-compliance can lead to removal or suspension. — [Google Play Families policy](https://support.google.com/googleplay/android-developer/answer/9893335?hl=en) (snippet; page not fetched)
- Privacy policy and ads: a privacy policy matching actual practices is required. Mixed-audience apps need a neutral age screen, and ads to children or unknown-age users must come from Families Self-Certified Ads SDKs. — [Google Play Families policy](https://support.google.com/googleplay/android-developer/answer/9893335?hl=en) (snippet)
- Child-only apps:
  - Must not transmit the AAID, SIM serial, Build serial, BSSID, MAC, SSID, IMEI or IMSI.
  - Should not request the AD_ID permission when targeting API 33+.
  - May not request location permission or collect precise location.
  — [Android Play policies](https://developer.android.com/distribute/play-policies?hl=en); [AdMob child-directed guidance](https://support.google.com/admob/answer/11402075?hl=en)
- Recent change: the Families Policy was expanded to bar anonymous chat apps from targeting children (listed as dated 26 Aug 2026). A third-party blog reports location/contacts permission changes with a 28 Oct 2026 deadline (unverified). — [Play policy updates](https://SUPPORT.GOOGLE.COM/googleplay/android-developer/answer/14550832); [DEV Community blog](https://dev.to/mr_manushukla/google-plays-july-2026-policy-update-5-changes-to-ship-before-the-31-august-deadline-3bie)
- Teacher Approved: all Families-compliant apps are eligible to be rated by teacher reviewers for quality and age appropriateness, but inclusion is not guaranteed. The Designed for Families requirements were merged into the Families Policy in 2022. — [Google Play Teacher Approved help](https://support.google.com/googleplay/android-developer/answer/10075896?hl=en); [Android Developers Blog 2022](https://android-developers.googleblog.com/2022/11/helping-kids-and-families-find-high-quality-apps-for-kids.html?hl=fi)

### Inferences
- Private use only (own daughter, sideloaded or TestFlight): this very likely falls under the GDPR household exemption, and in any case processes no personal data if offline. There are practically no legal obligations, but the same design is good practice.
- Publishing:
  - Avoid any server, accounts, cloud sync, crash reporting SDKs (many Firebase/Crashlytics configurations transmit device identifiers), and ad or analytics SDKs.
  - Store progress locally only, with no names or photos. If the child enters a name or drawing, keep it on the device.
  - With nothing collected or transmitted, GDPR/COPPA obligations are minimal. Still publish a short privacy policy stating "no data collected," which both stores require for kids apps.
  - Put the parent area (settings, links, "rate this app") behind a parental gate.
- Recording audio (e.g. a "say the word" mechanic) brings microphone permission and potentially personal data (voice). Keep processing on-device and never upload.

### Gaps
- Google's Families policy page could not be fetched, so exact current wording, and whether "precise" or all location is barred, should be checked directly.
- No Datatilsynet guidance found specifically on children's apps or games.
- Whether the Danish 15-year limit has changed after 2024: not checked against retsinformation.dk.
- Exact wording of Apple's guideline "last updated" date not found on the page.

## 4. Accessibility and inclusivity (colour-blindness, dyslexia, left-handedness, language)

### Takeaway
General game-accessibility guidelines apply, but I found no child-specific evidence base. The most important rules: never convey essential information by colour alone (add shape, pattern or icon), keep text optional and large with high contrast and audio alternatives, make settings (volume, speed, contrast) adjustable, and support Danish narration first. Evidence for special "dyslexia fonts" is weak.

### Cited Findings
- Game Accessibility Guidelines: "Ensure no essential information is conveyed by a colour alone." They are organised into basic, intermediate and advanced tiers. — [gameaccessibilityguidelines.com](https://gameaccessibilityguidelines.com/?p=12)
- IGDA GA-SIG checklist: check that all menu and gameplay colours are colour-blind friendly. Games such as FTL and Hue add optional patterns to coloured areas. — [IGDA GA-SIG guidelines](https://igda-gasig.org/get-involved/sig-initiatives/resources-for-game-developers/sig-guidelines/); [Alan Zucconi: Accessibility in videogames](https://www.alanzucconi.com/2021/05/24/accessibility-in-videogames/)
- Subtitles and captions should be large, high contrast and customisable, with an optional background box and adjustable size. — [Games for Change tips (PDF)](https://gamesforchange.org/studentchallenge/wp-content/uploads/2022/01/Tips_Resources_for-Considering-the-Needs-of-Disabled-Gamers-in-Design.pdf); [Tencent accessible game design guide (PDF)](https://static.www.tencent.com/img/game-jam-4-all/A%20Guide%20to%20Accessible%20Game%20Design_GJ_v19.pdf)
- Dyslexia fonts (e.g. OpenDyslexic) have only "preliminary research" support. Clear sans-serif fonts with adjustable size, colour and background are recommended instead. — [Alan Zucconi](https://www.alanzucconi.com/2021/05/24/accessibility-in-videogames/)
- PBS KIDS Games offers audio, playback-speed and contrast settings as accessibility features. — [PBS KIDS flyer 2026](https://www.wxxi.org/wp-content/uploads/2026/01/PBS-KIDS-Free-App-Accessibility-Features.pdf)
- PBS KIDS style guide: colour pairings must pass contrast guidelines on digital screens. — [PBS KIDS style guide (PDF)](https://pbs-kids-brand.pbskids.org/downloads/pbs-kids-style-guide.pdf)

### Inferences
- Left-handedness: keep the main interaction area centred, and either avoid fixed right-side controls or mirror them. Drag paths should work in either direction. This is a design inference; no source found.
- Language: Danish narration recorded by a native speaker (or a high-quality TTS voice). Structure all strings and audio for localisation from day one if store publication is planned. If letters and phonics are taught, use Danish letter sounds (æ, ø, å).
- Include respectful, diverse representation in characters. Do not rely on cultural knowledge outside a Danish child's world.
- Respect iOS/Android system settings (Reduce Motion, larger text, mono audio, VoiceOver/TalkBack labels on parent-facing UI).

### Gaps
- No peer-reviewed source found specifically on accessibility for 5-7-year-olds, colour-blind children's game performance, or left-handed children and touch UI.
- Prevalence data for colour vision deficiency (commonly cited as about 8% of males of Northern European descent) not sourced in this session.
- IDC (Interaction Design and Children) conference papers on these topics were not retrieved.
