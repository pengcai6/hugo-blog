# Hugo Blog Development Guidelines

## Commands
- **Dev Server**: `hugo server -D` (drafts enabled)
- **Build**: `hugo --minify` (production build)
- **Deps**: `hugo mod tidy` (manage Go modules/Hugo themes)
- **Encrypt**: `go install github.com/hugomods/encrypt/commands/encrypt@latest && encrypt` (post-build)

## Code & Content Style
- **Frontmatter**: YAML format. Required: `date`, `title`, `slug`, `categories`.
- **Images**: Prefer WebP format. Store in `static/images/posts/<post-slug>/`. Use absolute paths `/images/posts/...`.
- **Markdown**: GFM. No HTML in content unless necessary.
- **Components**: Use Hugo shortcodes for complex elements.
- **Theme**: PaperMod (in `themes/PaperMod` or as module). Respect overrides in `layouts/`.
- **Config**: Main config in `hugo.toml`. Environment specific in `config/<env>/`.
- **CI/CD**: GitHub Actions uses Hugo Extended & Dart Sass.
