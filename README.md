<a href="https://spectre-org.github.io/spectre-css">
  <img src="https://spectre-org.github.io/spectre-docs/img/spectre-logo.svg" width="72" height="72">
</a>

## Spectre CSS

[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)

> This version of Spectre CSS has been forked from the [original repo](https://github.com/picturepan2/spectre); see the [organisation readme](https://github.com/spectre-org) for rationale.

Spectre is a lightweight, responsive and modern CSS framework.

- Lightweight (~10KB gzipped) starting point for your projects
- Flexbox-based, responsive and mobile-friendly layout
- Elegantly designed and developed elements and components

Spectre is a side project based on years of CSS development work on a large web service project.

Spectre only includes modern base styles, responsive layout system, CSS components and utilities, and it can be modified for your project using standard build tools.

## Documentation

New documentation is available at:

- [spectre-org.github.io/spectre-docs](https://spectre-org.github.io/spectre-docs)

Getting started:

- [Installation](https://spectre-org.github.io/spectre-docs/docs/introduction/installation.html)
- [Build](https://spectre-org.github.io/spectre-docs/docs/introduction/build.html)

Content:

- [Elements](https://spectre-org.github.io/spectre-docs/docs/elements/index.html)
- [Layout](https://spectre-org.github.io/spectre-docs/docs/layout/index.html)
- [Components](https://spectre-org.github.io/spectre-docs/docs/components/index.html)
- [Experimentals](https://spectre-org.github.io/spectre-docs/docs/experimentals/index.html)
- [Utilities](https://spectre-org.github.io/spectre-docs/docs/utilities/index.html)

Related content:

- [Original Spectre.css issues](https://github.com/picturepan2/spectre/issues)
- [Original Spectre.css docs](https://picturepan2.github.io/spectre/)
- [Spectre.css on Twitter](https://twitter.com/spectrecss)

## Contributing

Clone this repo locally with:

```bash
git clone https://github.com/spectre-org/spectre-css.git
```

Spectre uses [Gulp](http://gulpjs.com/) to compile CSS:

```bash
# compile SCSS to CSS and minify files
gulp build    

# watch file changes and re-compile
gulp watch    
```

To work with Spectre CSS source files live in another project, you can use NPM link.

In the Spectre CSS repo, create the global reference:

```bash
npm link
```

In your project repo, create the link:

```bash
npm link @spectre-org/spectre-css
```

The existing `node_modules/@spectre-org/spectre-css` folder will be replaced with a symlink to the local repository, and any changes there will be reflected immediately in your project.
