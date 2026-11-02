# Stremio Duo

Forked from Stremio/stremio-web development at `c34935cc36e28c00ec15f066c38bbc6f6f59f716` on 2026-11-02. Upstream GPL-2.0 license and notices are retained. This is a separate web/PWA build, not a patch to the official native iOS IPA.

## Navigation

Touch navigation fades after 36 points of downward travel and returns after 12 points upward. Small reversals do not flicker it. Elastic bounce is clamped. Nested horizontal poster scrolling is ignored. The bar returns at the top, on route changes, resize/orientation changes, keyboard navigation and menu focus. Hidden controls cannot receive taps and leave keyboard/accessibility navigation once the fade completes. Reduced Motion uses immediate visibility changes.

Wide touch layouts use a right rail; narrow layouts retain the upstream bottom tabs. Desktop keeps its original left rail. Space remains reserved during the fade so catalog cards and scroll position do not jump. The top search/account bar stays visible.

## Build and checks

Node 24.14.0; pnpm 11.25.0; frozen upstream lockfile. No additional runtime dependencies.

```sh
pnpm install --frozen-lockfile
pnpm test --runInBand
pnpm run lint
pnpm run build
git diff --check
```

The 70 upstream tests pass. Full lint passes with 263 upstream warnings and no errors. Production build passes with upstream bundle-size warnings. Full `tsc --noEmit` reports existing errors in upstream files/dependency declarations; the changed navigation files have no reported type errors. The production webpack pipeline uses the upstream transpilation configuration.

Browser verification uses an isolated, signed-out context: touch widths 390, 669 and 951 CSS pixels, reduced motion and a desktop control. Check downward hiding, upward/top restoration, keyboard restoration, resize restoration and rail placement. Screenshots and results belong in the task output folder, not in the app bundle. This does not establish physical Duo behavior, iOS codec support, memory, battery or playback performance. No account login, stream playback, preloading or downloads were tested.

Measured local production output is approximately 44 MiB including source maps; the unchanged upstream entry JavaScript is about 9.2 MiB uncompressed. Installed PWA/cache size varies. Phone runtime memory is unmeasured. No media assets are bundled.

## Native source audit

The existing official Stremio 2.1.0 build 24 IPA has no editable native navigation source in the available local artifacts. Its original IPA and signing/phone material remain unchanged.

The older public `yvdjee/stremiox` fork has an open native engine, but is based on June 2026 source. Its maintained upstream became [VortX](https://github.com/VortXTV/VortX). At revision `147390ef7af555c07e56d6095362518e4bc38b54`, [VortX's build documentation](https://github.com/VortXTV/VortX/blob/147390ef7af555c07e56d6095362518e4bc38b54/docs/BUILDING.md) explicitly requires private engine source/approved artifacts for a complete build. The source audit therefore did not produce a custom native IPA, and this fork does not claim native-client parity.

The web/PWA has the upstream browser playback limits. Existing Stremio accounts/addons can be used through its normal sign-in flow, but this build has not accessed Matt's account. Credentials and private addon URLs must never be committed or placed in deployment files.
