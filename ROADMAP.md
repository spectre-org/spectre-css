# Roadmap

This document sets out the planned release sequence for Spectre CSS, and records the triage of the
outstanding upstream backlog.

The guiding principle is to ship every non-breaking improvement first, across a series of patch and
minor releases, then bundle everything that is already known to be breaking into a single major
release — so users absorb the upgrade cost once rather than repeatedly.

## Release plan

### v1.2.1 — patch — Housekeeping

Bug fixes only, no API or visual redesign.

| Item | Source |
| --- | --- |
| Include `dist/` builds in GitHub releases | [#52](https://github.com/spectre-org/spectre-css/issues/52) |
| Fix experimental Meter component | [#42](https://github.com/spectre-org/spectre-css/issues/42) |
| Fix `form-select` inheriting the wrong text colour | upstream [#660](https://github.com/picturepan2/spectre/pull/660) |
| Fix `.loading` spinner position when combined with other positioning | upstream [#650](https://github.com/picturepan2/spectre/pull/650) |
| Hide child text of `.loading` elements, not just direct text | upstream [#400](https://github.com/picturepan2/spectre/pull/400) |
| Replace deprecated `::-webkit-details-marker` with `::marker` | upstream [#674](https://github.com/picturepan2/spectre/pull/674) |
| Fix `:visited` colour on buttons and button variants | upstream `0.5.10` |

### v1.3.0 — minor — Small UI additions and RTL

Additive only — new classes, variables and icons. Nothing existing is renamed or restyled.

| Item | Source |
| --- | --- |
| Hover effect on pagination | [#40](https://github.com/spectre-org/spectre-css/issues/40) |
| More built-in colours, with `light-` / `dark-` variants | [#53](https://github.com/spectre-org/spectre-css/issues/53) |
| Expand utilities — core tier (margin, padding, flex) | [#17](https://github.com/spectre-org/spectre-css/issues/17) |
| `.table-stack` responsive table option | upstream [#653](https://github.com/picturepan2/spectre/pull/653) |
| `.card-shadow` card variant | upstream `0.5.10` |
| Column ordering utilities (`.order-*`) | upstream `0.5.10` |
| New icons — `show`, `hide`, `heart`, `home` | upstream `0.5.10`, [#677](https://github.com/picturepan2/spectre/pull/677) |
| Complete RTL support | upstream [#505](https://github.com/picturepan2/spectre/pull/505), [#553](https://github.com/picturepan2/spectre/pull/553), [#362](https://github.com/picturepan2/spectre/pull/362) |
| Accordion and menu keyboard / screen-reader accessibility | upstream [#437](https://github.com/picturepan2/spectre/pull/437), [#590](https://github.com/picturepan2/spectre/pull/590) |

RTL is listed here rather than as a fix because the framework already ships a partial implementation —
`$rtl` exists in `_variables.scss` and is honoured by `_tables.scss` and `_off-canvas.scss`, but is not
wired through the remaining components. This release finishes that work.

### v1.4.0 — minor — Pure CSS tabs

| Item | Source |
| --- | --- |
| Pure CSS tabs, removing the JS requirement | [#31](https://github.com/spectre-org/spectre-css/issues/31) |

Released on its own because it rewrites `_tabs.scss` wholesale and carries a configurable tab-count
limit that warrants its own documentation and testing pass.

### v1.5.0 — minor — Native CSS variables (non-colour)

| Item | Source |
| --- | --- |
| CSS custom properties for typography, spacing / units and radii | [#19](https://github.com/spectre-org/spectre-css/issues/19) (partial) |

These are 1:1 mirrors of the existing Sass variables, so the change is purely additive and existing
Sass overrides continue to work unchanged. Colour is deliberately excluded — see v2.0.0.

### v2.0.0 — major — Module system, structure and visual baseline

Every change already known to be breaking, bundled into one release.

| Item | Source | Why it breaks |
| --- | --- | --- |
| Move files into category folders | [#48](https://github.com/spectre-org/spectre-css/issues/48), PR [#49](https://github.com/spectre-org/spectre-css/pull/49) | Direct imports of `src/_file.scss` paths change |
| Migrate `@import` to `@use` / `@forward` | [#54](https://github.com/spectre-org/spectre-css/issues/54) | Variable overrides move from global assignment to `@use ... with (...)` |
| Grouped partial imports as `@forward` bundles | [#29](https://github.com/spectre-org/spectre-css/issues/29) | New public entry points, built on the above |
| Reinstate deferred `modern-normalize` rules | PR [#45](https://github.com/spectre-org/spectre-css/pull/45) | Adds `tab-size` and table border colour inheritance |
| CSS variables for colour | [#19](https://github.com/spectre-org/spectre-css/issues/19), PR [#38](https://github.com/spectre-org/spectre-css/pull/38) | Native colour maths differs subtly from Sass |
| Review padding and margins framework-wide | [#4](https://github.com/spectre-org/spectre-css/issues/4) | Changes default visual output broadly |
| Modal header padding rework | upstream [#640](https://github.com/picturepan2/spectre/pull/640) | Visual redesign, folded into #4 |
| Off-canvas content padding | upstream [#657](https://github.com/picturepan2/spectre/pull/657) | Visual change, folded into #4 |
| Soften shadow opacity `.3` → `.15` | upstream `0.5.10` | Changes every shadowed component |
| Mobile-first grid system | upstream [#182](https://github.com/picturepan2/spectre/pull/182) | Inverts grid breakpoint semantics |
| Fix `.show-*` breaking flex children | upstream [#424](https://github.com/picturepan2/spectre/pull/424) | Needs a redesigned fix — see notes |

Suggested order within the release: #49, then #54, then #29 — the module migration rewrites every
relative import path, so the folder move must land first or those paths get written twice. PRs #45 and
#38 are independent and can land either side of that. #4 goes last, so spacing is judged against the
final structure.

#### On the cost of the folder move

The folder move is worth being deliberate about, because its benefit is largely to maintainers while
its cost falls on users and on future upstream ports.

The flat paths it changes are a documented public API — `get-started/build.md` tells people to write
`@import ".../src/buttons"` for selective imports. Moving the files silently breaks every one of those.
It also makes cherry-picking from `picturepan2/spectre` permanently harder, since every future port
needs its paths remapped; #48 anticipates this and asks for the upstream backlog to be cleared first,
which the v1.2.1 and v1.3.0 releases above do.

If the break turns out to be unwelcome, it can be avoided almost entirely: leave each old flat path in
place as a one-line forward, so `src/_buttons.scss` becomes `@forward "elements/buttons";`. Every
documented import keeps working, the folder structure still happens, and the shims can be dropped in a
later major with a deprecation notice. The cost is around fifty one-line files, which is not free but
is cheap next to breaking a documented API.

### v2.1.0 — minor — Dark mode

| Item | Source |
| --- | --- |
| Dark mode | [#18](https://github.com/spectre-org/spectre-css/issues/18) |

Depends on the colour custom properties landing in v2.0.0; implemented as a class or attribute that
redefines the `--*` values, so the default light theme is untouched.

### Unscheduled — needs a design spike

| Item | Source |
| --- | --- |
| Spectre Raw — automatic styling of native HTML elements | [#51](https://github.com/spectre-org/spectre-css/issues/51) |
| Dash docset configuration | upstream [#689](https://github.com/picturepan2/spectre/pull/689) |

## Documentation

Documentation lives in the separate [`spectre-docs`](https://github.com/spectre-org/spectre-docs)
repository, as a VitePress site. Three things about how it is wired up determine how much work each
release needs.

**The sidebar is generated, not written.** `.vitepress/config.mts` uses `vitepress-sidebar` to scan
`docs/`, taking titles and ordering from each page's `title` and `order` frontmatter. So a new page is
just a new `.md` file with frontmatter, and a new section is just a folder with an `index.md`. Neither
needs a config change.

**The JS badges are hard-coded.** The same config holds a manual list of pages that get a "JS" badge in
the sidebar. It is the one place that must be edited by hand when a component's JS requirement changes.

**Styles are pushed from this repo.** The `buildDocs` gulp task compiles, namespaces and copies the
stylesheet into the docs theme, and rewrites the version tagline on the home page. Restyling work needs
no manual docs step beyond re-running that task.

The existing sections — `get-started`, `elements`, `layout`, `components`, `utilities`, `experimentals`
— already cover most of what is planned. Only two releases need genuinely new structure.

### Per release

**v1.2.1** — no new pages. The Meter fix may need its screenshot refreshed on
`experimentals/meters`.

**v1.3.0** — new pages within existing sections: `.table-stack` on `elements/tables`, `.card-shadow` on
`components/cards`, `.order-*` on `layout` or `utilities/position`, and the new icons on
`elements/icons`. Pagination hover and the expanded colour palette are updates to existing pages.

RTL is the exception and needs a new page, most likely `get-started/rtl`, since it is a build-time
`$rtl` flag rather than a class — it belongs with the other build and customisation material rather
than in a component section.

**v1.4.0** — `components/tabs` needs rewriting for the pure CSS implementation, including the tab-count
limit. This is also the one release that must edit `.vitepress/config.mts`, to remove `'tabs'` from the
JS badge list — the whole point of the change is that tabs no longer need JS.

**v1.5.0** — needs a new `get-started/theming` page covering the CSS custom properties, kept separate
from `customisation`, which documents the Sass variables. The two override mechanisms coexist and
should be explained side by side, with guidance on when to reach for each.

**v2.0.0** — the largest documentation task in the plan, and it is a rewrite rather than an addition.
Two pages currently document the things this release breaks:

- `get-started/build.md` shows the `@import` plus global variable override pattern under "User
  variables", and flat `src/buttons` paths under "Selective imports". Both become wrong.
- `get-started/customisation.md` describes overriding `!default` variables and links to the flat source
  layout.

Both need rewriting for `@use ... with (...)` and the new folder paths. This release also needs a new
`get-started/migrating` page — a v1 to v2 upgrade guide covering the changed override syntax, the moved
paths, and the visual differences from the spacing review and the colour maths change. That page is
what makes the major version tolerable for existing users, so it should be treated as part of the
release rather than a follow-up.

**v2.1.0** — a new `get-started/dark-mode` page. Note that the docs site currently sets
`appearance: false` and forces the `github-light` code theme, both of which disable VitePress's own
dark mode. Shipping dark mode means reversing those settings, and then checking every page renders
correctly in both themes — a larger job than writing the page itself.

**Spectre Raw**, if it goes ahead, would need its own top-level section rather than a page, since it is
a parallel way of using the framework rather than a feature within it.

### One salvageable item from the old docs

The documentation PRs listed in #5 target the old bundled Pug docs and cannot be merged. One is still
worth reproducing by hand in the current site: upstream
[#663](https://github.com/picturepan2/spectre/pull/663) documents `.flex-centered`, which the framework
ships but the docs do not currently cover.

## Backlog triage

[#5](https://github.com/spectre-org/spectre-css/issues/5) and
[#14](https://github.com/spectre-org/spectre-css/issues/14) are not changes in themselves — they are
lists of unreviewed work from the original `picturepan2/spectre` repository. Every item has been
checked against the current source; the outcome is recorded below and folded into the releases above.

### Recommended as won't-fix

These should be closed on the upstream tracker rather than ported.

| Upstream PR | Reason |
| --- | --- |
| [#599](https://github.com/picturepan2/spectre/pull/599) Range slider styles in IE | IE support already dropped via `modern-normalize` |
| [#591](https://github.com/picturepan2/spectre/pull/591) Modal scroll in IE | As above |
| [#425](https://github.com/picturepan2/spectre/pull/425) Tab display fix | Patches `layout.less`; this project is Sass-only. Duplicate of #424 |
| [#645](https://github.com/picturepan2/spectre/pull/645) New icons | Already closed upstream; icon additions come from `0.5.10` instead |
| [#236](https://github.com/picturepan2/spectre/pull/236) Drop sections to experimental | Already done — the project ships `spectre-exp.scss`, and PR #49 adds an `experimentals/` folder |
| [#669](https://github.com/picturepan2/spectre/pull/669) Dart Sass `@use` migration | A pre-fork attempt at #54 across 92 files. Too stale to merge, but worth reading as reference when doing #54 |

### Out of scope for this repository

Documentation PRs [#663](https://github.com/picturepan2/spectre/pull/663),
[#570](https://github.com/picturepan2/spectre/pull/570),
[#560](https://github.com/picturepan2/spectre/pull/560) and
[#524](https://github.com/picturepan2/spectre/pull/524) target the old bundled docs. They belong on the
`spectre-docs` backlog, not here.

### Needs a redesigned fix

[#424](https://github.com/picturepan2/spectre/pull/424) describes a real bug — `.show-*` forces
`display: block`, which breaks `.column` and other flex children. The proposed fix changes every
`.show-*` to `display: flex`, which simply moves the breakage onto block content. A correct fix
probably scopes the display value to the element type or uses `revert`. Scheduled for v2.0.0 so the
behaviour change can be documented properly.

### Notes on porting the `0.5.10` changes

None of the `0.5.10` branch has been merged. When porting the column ordering utilities, three things
need cleaning up rather than copying verbatim:

- `-ms-flex-order` prefixes should be dropped, in line with dropping IE support.
- `$columns-count` is declared without `!default`, so it cannot be overridden.
- The `.order-#{$i}` rules are re-emitted inside every breakpoint, which is redundant.
