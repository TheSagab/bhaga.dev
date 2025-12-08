# CLAUDE.md for bhaga.dev

## Project Overview
This project is an Astro website built for personal website. It utilizes Tailwind CSS for styling and vanilla JavaScript for interactive components.

## Technologies
- Astro
- Tailwind CSS
- MDX (for blog posts)

## File Structure
- `src/components/`: Reusable Astro components.
- `src/layouts/`: Layout components for different page types.
- `src/pages/`: Astro pages for routing.
- `src/content/blog/`: Markdown files for blog posts (using content collections).
- `public/`: Static assets.

## Astro Instructions
- Use Astro components for static content and page layouts.
- Integrate `@astrojs/tailwind` for styling.
- Use `@astrojs/mdx` for blog post content.
- Blog posts should be defined within content collections and rendered using a dedicated layout.

## Best Practices
- Ensure semantic HTML is used throughout.
- Optimize images for web performance.
- Write clear and concise component code.
- Follow Tailwind CSS utility-first approach for styling.

## Styling Guide
- The styles are stored in `src/styles/global.css`.
- Follow Tailwind CSS utility-first approach for styling.
- For colors, custom colors are used instead of the default Tailwind colors. Use cyan as the primary color, slate as the tinted gray color, and gray as the neutral color.
- There are 12 steps in the color palette, following the guideline from Radix Colors.

## Color Steps Guide
- 1: App background
- 2: Subtle background
- 3: UI element background
- 4: Hovered UI element background
- 5: Active / Selected UI element background
- 6: Subtle borders and separators
- 7: UI element border and focus rings
- 8: Hovered UI element border
- 9: Solid backgrounds
- 10: Hovered solid backgrounds
- 11: Low-contrast text
- 12: High-contrast text
