# Video Portfolio Analysis Prompt — Mitchell Williams Video Archive

**Workflow:** Get a transcript first (whisper locally, or AssemblyAI API for long-form files), then paste it here with this prompt. Do NOT use this in Descript — Descript is a video editor, not an LLM. This prompt goes to Claude.

**Input format:** Paste the transcript below this prompt, then send. Claude will return the full structured analysis block.

---

## CONTEXT: Who Made These Videos

You are analyzing the archived video portfolio of **Mitchell Williams**, a communications lead and AI builder currently at Google xGE. These videos are organized chronologically across two distinct career phases:

**Phase 1 — Editorial / Journalism (2010–2018):**
- Al Jazeera English / The Stream (2010–2011) — founding AP on social-first live news
- CCTV America (2011–2012) — daily live news production
- HuffPost Live (2012–2013) — award-winning live video launch era
- Fusion / America With Jorge Ramos (2013–2015) — cable + digital, underserved demographics
- CNN "New Day" (2016) — morning show, US presidential election cycle
- AJ+ (2016–2018) — viral social video, 50M+ view campaigns, Senior Producer

**Phase 2 — Google (2018–present):**
- Google Corporate Engineering / CorpEng (2018–2024) — enterprise comms, 75K+ new hires, COVID provisioning
- Google xGE (2024–present) — AI systems for 1,000+ senior engineers (Principal/Distinguished/Fellow tiers)

**Filename key:**
- `AJE-STREAM_` = Al Jazeera English / The Stream (founding era 2010–2011; social-first live news)
- `FUSION_` = Fusion / America With Jorge Ramos (ABC/Univision JV)
- `AJP_` = AJ+ (Al Jazeera digital social video)
- `AJP-OR-FUSION_` = Confirmed journalism era, platform uncertain (check opening credits in transcript)
- `HUFFPOST_` or `HUFFPOST-OR-AJE_` = HuffPost Live (live video launch era 2012–2013)
- `GOOGLE-CORPENG_` = Google Corporate Engineering internal
- `GOOGLE-XGE_` = Google xGE internal / conferences

**IMPORTANT — Archive mislabeling known issues (verified by transcript analysis 2026-05-06):**
- Some files labeled `AJE-STREAM_` are actually HuffPost Live broadcasts — confirm by checking host name and show format in transcript opening
- `GOOGLE-CORPENG_2022_Internal-Content-Social-Share` is an AJ+ Puerto Rico field piece (2017), NOT a Google clip — do not analyze as Google internal content
- When platform is ambiguous, look for: show name in lower thirds, host identification, opening title cards, network branding mentioned on-air

---

## INSTRUCTIONS FOR EACH VIDEO

For each video file, generate a complete structured analysis. The output will be used to update Mitchell's CV, career profile, and portfolio documentation. Be as specific as possible — pull verbatim phrases, actual screen text, names, titles, and visible metrics from the video.

Output the following for each file:

---

### 1. IDENTIFICATION

- **File name:** (exact filename as uploaded)
- **Detected title:** (what appears on screen or in opening frames, if any)
- **Estimated platform:** (Fusion, AJ+, CNN, HuffPost Live, Google internal, conference, etc.)
- **Estimated year:** (based on visual cues, on-screen text, cultural references, technology visible)
- **Runtime:** (HH:MM:SS)
- **Format:** (broadcast package / social cut / full episode / internal presentation / interview / showreel)

---

### 2. FULL TRANSCRIPT

Provide a complete verbatim transcript, speaker-labeled where multiple speakers appear. Include:
- On-screen text / lower thirds / chyrons
- Any visible titles, headlines, or graphic text
- Opening and closing credits if present

---

### 3. SHOT LIST

Describe each distinct shot or segment in sequence:

| Time | Shot type | Description | Audio |
|------|-----------|-------------|-------|
| 00:00 | [Wide/Medium/Close/B-roll/Graphics] | [what's visible] | [narration/interview/music/silence] |

---

### 4. MUSIC & AUDIO DETECTION

- **Background music:** identify any music used (song title, artist, genre, mood if unidentified)
- **Licensed or original:** note if music appears to be licensed production music vs. commercial tracks
- **Audio treatment:** narration style (formal/conversational/documentary/social media), sound design notes, pacing
- **Tone:** the overall audio mood (urgent, investigative, optimistic, dry, activist, corporate, etc.)

---

### 5. TOPIC & THEME CLASSIFICATION

- **Primary topic:** (1 sentence)
- **Secondary themes:** (bullet list)
- **Audience:** (who this was made for — general public, social media, cable news viewers, internal Google employees, conference attendees, etc.)
- **Story type:** (explainer, human interest, political, social issue, corporate, investigative, celebrity, data-driven, documentary)
- **Cultural moment:** (what was happening in the world when this was likely made — what context made this story relevant)

---

### 6. PRODUCTION ROLE SIGNALS

Based on what you can observe in the video, identify which production responsibilities Mitchell likely held. Flag what's visible:

- [ ] Field producing (subject selection, interview setup, location)
- [ ] Writing / scripting (narration, script style)
- [ ] Line producing (rundown, segment sequencing, live broadcast control)
- [ ] Editing / post-production (cut style, pacing, graphics integration)
- [ ] Social / platform optimization (aspect ratio, caption style, hook structure, length)
- [ ] Talent coaching (interview conduct, on-camera direction)
- [ ] Content strategy (topic selection, framing, audience targeting)
- [ ] Live broadcast production (real-time elements, breaking news pivots)

---

### 7. SKILLS DEMONSTRATED

Based on what is visible and audible in the video, list the specific professional skills this piece demonstrates. Format as CV-ready bullet fragments:

Example format:
- Produced [X] minute [format] for [platform/audience] covering [topic] — [notable outcome or technique if visible]

Be specific. Pull real details from the video where possible.

---

### 8. PROOF POINTS (CV-READY)

Extract any quantifiable or quotable proof points that could support a job application or CV entry. Examples:
- On-screen metrics ("50 million views" / "40 million households" / "top-10 cable launch")
- Named people visible (executives, hosts, subjects)
- Named companies or programs visible
- Awards or recognitions shown
- Dates visible on screen

---

### 9. PORTFOLIO POSITIONING

How should this video be described in a professional portfolio aimed at AI-native companies seeking communications, editorial, or builder talent?

- **One-line portfolio caption:** (under 20 words)
- **Recommended context note:** (1–2 sentences explaining what this demonstrates to a technical or AI-native hiring manager who may not know journalism)
- **Tags:** (list 5–8 tags for indexing: platform, era, skill, topic, format)

---

## OUTPUT FORMAT FOR KNOWLEDGE BASE UPDATE

After processing all videos, produce a consolidated summary in this format so it can be passed directly back to update career artifact files:

```
=== CAREER KNOWLEDGE BASE UPDATE ===

## Pre-Google Video Work — Verified Details

### Platform: [e.g. AJ+]
**Years:** XXXX–XXXX
**Role confirmed:** [title]
**Verified proof points:**
- [bullet]
- [bullet]
**Verified topics covered:** [list]
**Skills confirmed by footage:** [list]

### Platform: [Fusion / America With Jorge Ramos]
...

## New CV Bullets (ready to add to cv.md)
- [formatted bullet]
- [formatted bullet]

## New Profile Notes (ready to add to config/profile.yml)
[YAML-formatted additions]

## Article Digest Additions (ready to add to article-digest.md)
- [formatted proof point]
```

---

## THE STREAM — SPECIFIC ANALYSIS GUIDANCE

The Stream (Al Jazeera English, 2010–2011) was a social-first live news program. Mitchell was on the founding Associate Producer team. Key things to watch for in any `AJE-STREAM_` file:

- **Social media integration signals:** references to TweetDeck, Trendsmap, "The Stream Box," Twitter hashtags discussed on air, live follower counts graphed, SMS audience participation, Skype interviews with social-media figures
- **Real-time production pivots:** rundown changes announced on air, breaking news integrations, control room IFB moments captured on tape
- **Social media as primary source:** when a Twitter account, blog post, or YouTube video IS the news story (not just supplementary) — this is The Stream's editorial signature
- **Named AP/producer credits:** unusual for The Stream's format; more likely in pre-show or credits than live broadcast
- **Show identification:** opening theme, "The Stream" lower third, Al Jazeera English logo/chyron, host names (Ahmed Shihab Al Din, Malika Bilal, Femi Oke)

**NEW files added 2026-05-06 (pending Whisper transcription):**
- `AJE-STREAM_2011_Lilianne-Khalil-Twitter-Hoax-Wenzhou-Train-Crash_Live-Panel_24m59s.mp4` — The Lilianne Khalil Twitter hoax (false reports about a French journalist) intersecting with the July 2011 Wenzhou high-speed rail crash. Watch for: social media verification discussion, live Twitter sourcing, crowdsourced reporting critique, Chinese social media (Weibo) references
- `AJE-STREAM_2011-2012_Chinese-Micro-Blogging-Crowd-Sourced-Epidemiology_Panel-Discussion_45m6s.mp4` — Chinese social media (Weibo/微博) used for crowd-sourced disease/epidemic tracking. Watch for: Weibo usage data, public health applications of social data, comparison to Western platforms, expert guests in epidemiology or Chinese internet research
- `AJE-STREAM_2011-2012_What-Is-The-Way-Forward-In-Bahrain_Panel-Discussion_39m4s.mp4` (added 2026-05-06, ~307MB, renamed from "What is the way forward in Bahrain.mp4") — Panel discussion on the Bahrain political situation during Arab Spring. Watch for: social media references to Bahrain protests, live Twitter/blog sourcing, Maryam Al-Khawaja or Nabeel Rajab references, activist guest voices, Al Jazeera stream format markers
- `AJE-STREAM_2010-2013_Is-Isolating-Iran-The-Answer_Panel-Discussion_34m39s.mp4` (in folder since morning, not yet queued for transcription) — Panel discussion on Iran sanctions/isolation policy. Watch for: geopolitical social media signals, region-specific expert guests, social media as political commentary tool
- `AJE-STREAM_2010-2013_A-Look-Into-Islams-Holy-Pilgrimage_Documentary-Segment_37m25s.mp4` (in folder since morning, not yet queued for transcription) — Documentary-style segment on the Hajj/Islamic pilgrimage. Watch for: social media documentation of religious events, crowd-sourced imagery, platform coverage of underreported religious/cultural content

**NEW files added 2026-05-06 — Google XGE (large files, prioritize last):**
- `GOOGLE-XGE_2023_All-Hands-Googler_Full-Presentation_41m28s.mp4` (3.4GB) — Major internal all-hands presentation. Watch for: xGE program scope, AI systems described, Mitchell's role or credit, audience size indicators, engineering leadership context
- `GOOGLE-XGE_2023_SVP-Interview-Grace-Hopper-Conference_Conference-Interview_34m21s.mp4` (4.1GB) — SVP-level interview at Grace Hopper Conference (largest women in computing conference globally). High visibility external appearance. Watch for: AI/engineering diversity framing, Google xGE program description, any production credit or role identification

---

## PROCESSING ORDER

Process files in this recommended order (journalism era first, Google era last):

**The Stream (process first — earliest era, highest historical significance):**
1. `AJE-STREAM_2011_Global-Reactions-Bin-Laden-Death-Bahrain_Live-Coverage_45m11s.mp4` ← ALREADY TRANSCRIBED
2. `AJE-STREAM_2011_Lilianne-Khalil-Twitter-Hoax-Wenzhou-Train-Crash_Live-Panel_24m59s.mp4` ← WHISPER RUNNING (PID 13593)
3. `AJE-STREAM_2011-2012_Chinese-Micro-Blogging-Crowd-Sourced-Epidemiology_Panel-Discussion_45m6s.mp4` ← WHISPER RUNNING (PID 13594)
4. `AJE-STREAM_2011-2012_What-Is-The-Way-Forward-In-Bahrain_Panel-Discussion_39m4s.mp4` ← NEW (renamed 2026-05-06; queue for Whisper after PIDs 13593/13594 complete)
5. `AJE-STREAM_2010-2013_Is-Isolating-Iran-The-Answer_Panel-Discussion_34m39s.mp4` ← PENDING (in folder; queue for transcription)
6. `AJE-STREAM_2010-2013_A-Look-Into-Islams-Holy-Pilgrimage_Documentary-Segment_37m25s.mp4` ← PENDING (in folder; queue for transcription)

**HuffPost Live:**
7. `HUFFPOST_2013-2014_HIV-Prevention-Pill-Truvada-In-Stores_Panel-Interview_29m26s.mp4` ← ALREADY TRANSCRIBED
8. `HUFFPOST_2012-2013_Sarah-Michelle-Gellar-New-Fight_Celebrity-Interview_23m14s.mp4` ← ALREADY TRANSCRIBED
9. `HUFFPOST-OR-AJE_2012-2014_Jazz-Growing-Up-Trans-Youth_Full-Episode_58m43s.mp4` ← ALREADY TRANSCRIBED
10. `HUFFPOST_2012-2013_Kim-Kardashian-Milkshake-Bahrain_Entertainment-Segment_27m52s.mp4` ← ALREADY TRANSCRIBED
11. `HUFFPOST_2012-2013_Jada-Pinkett-Smith-Style-And-Success_Celebrity-Interview_29m3s.mp4` ← ALREADY TRANSCRIBED
12. `HUFFPOST_2012-2013_Kelly-Rowland-Talk-A-Good-Game_Celebrity-Interview_15m19s.mp4` ← ALREADY TRANSCRIBED
13. `HUFFPOST_2012-2013_Is-Minimum-Wage-Not-Enough_Panel-Discussion_30m58s.mp4` ← ALREADY TRANSCRIBED

**Fusion:**
14. `FUSION_2013_America-With-Jorge-Ramos-December-5_Full-Episode_43m50s.mp4` ← TRANSCRIBED (Mandela special)
15. `FUSION_2013-2015_America-With-Jorge-Ramos_Showreel_43m50s.mp4` ← TRANSCRIBED
16. `FUSION_2014_America-With-Jorge-Ramos-October-7_Full-Episode_43m6s.mp4` ← TRANSCRIBED (Netanyahu)
17. `FUSION_2014_Soccer-Gods-World-Cup-Coverage_Full-Episode_43m1s.mp4` ← TRANSCRIBED
18. `FUSION_2014_America-With-Jorge-Ramos-October-28_Full-Episode-Part-1_26m22s.mp4` ← TRANSCRIBED
19. `FUSION_2014_America-With-Jorge-Ramos-October-28_Full-Episode-Part-2_17m28s.mp4` ← TRANSCRIBED
20. `FUSION_2014_Midterm-Mayhem-October-12-Election-Coverage_Full-Episode_21m55s.mp4` ← TRANSCRIBED
21. `FUSION_2013-2015_America-With-Jorge-Ramos-Macing-It_Segment_5m8s.mp4` ← PENDING
22. `FUSION_2014_Colorado-Pot-Dealers-More-Money-More-Problems_Segment_5m5s.mp4` ← PENDING
23. `FUSION_2014_Pot-Tourism-In-Colorado_Segment_6m26s.mp4` ← PENDING

**AJ+:**
24. `AJP_2017_The-Few-The-Proud-The-Trans-Military-Ban_Documentary-Short_31m20s.mp4` ← TRANSCRIBED
25. `AJP-OR-FUSION_2014_Hong-Kong-OccupyCentral-Live-Coverage_Live-Coverage_15m7s.mp4` ← TRANSCRIBED
26. `AJP_2017_San-Juan-Mayor-Speaks-Out-Hurricane-Maria_Social-Video_1m16s.mp4` ← TRANSCRIBED
27. `AJP_2017_Hurricane-Maria-Puerto-Rico-Aftermath_Social-Video_2m57s.mp4` ← TRANSCRIBED
28. `AJP_2016-2018_Criminalizing-BDS_Social-Video_2m51s.mp4` ← TRANSCRIBED
29. `AJP_2017_Measles-Outbreaks-USA-VIRAL-50M-Views_Social-Video_2m5s.mp4` ← TRANSCRIBED
30. `AJP-OR-FUSION_2015-2016_HIV-Prevention-Pill-Truvada-Nobody-Talking_Segment_8m43s.mp4` ← PENDING
31. `AJP_2017_Truvada-PrEP-Not-Just-For-Gay-Men_Social-Video_7m26s.mp4` ← PENDING
32. `AJP_2016-2018_Bill-Nye-Curbing-Climate-Change_Interview-Segment_3m2s.mp4` ← PENDING
[+ 17 additional AJ+ short-form files — all PENDING; see data/portfolio-analysis-master.md Section 7]

**Google:**
33. `GOOGLE-CORPENG_2022_Working-On-CorpEng_Internal-Clip_2m9s.mp4` ← TRANSCRIBED
33. `GOOGLE-CORPENG_2022_Internal-Content-Social-Share_Short-Clip_2m57s.mp4` ← NOTE: AJ+ Puerto Rico field piece (2017), mislabeled. Analyze as AJ+ field journalism, not Google content.
34. `GOOGLE-XGE_2023_Honey-I-Shrunk-The-Population_Internal-Presentation_5m31s.mp4` ← PENDING
35. `GOOGLE-XGE_2023_All-Hands-Googler_Full-Presentation_41m28s.mp4` ← NEW (3.4GB; added 2026-05-06; large file — transcribe last)
36. `GOOGLE-XGE_2023_SVP-Interview-Grace-Hopper-Conference_Conference-Interview_34m21s.mp4` ← NEW (4.1GB; added 2026-05-06; large file — transcribe last; Grace Hopper Conference external appearance)

---

*Generated by career-ops pipeline — 2026-05-06. After Descript processes these files, paste the "=== CAREER KNOWLEDGE BASE UPDATE ===" block back to Claude Code at `/Users/mitchellwilliams/Documents/career-ops` to update cv.md, config/profile.yml, and article-digest.md.*
