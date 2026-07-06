# Keepsake — a vinyl & photograph scrapbook

A single-page, no-build website: a vintage record player and a photograph
gallery, wrapped in one small scrapbook. Built with plain HTML, CSS, and
JavaScript, so it runs as-is on GitHub Pages.

## Running it

Just open `index.html` in a browser, or push the whole folder to a GitHub
repository and turn on GitHub Pages (Settings → Pages → deploy from the
main branch). No build step, no dependencies to install.

## Adding your own content

Everything you'll want to change lives in one place: the `CONFIG` object,
the `playlist` array, and the `photos` array at the very top of
`script.js`.

**1. Songs.** Fill in each song's title and YouTube video id:

```js
const playlist = [
  { title: "Our Song", youtubeId: "dQw4w9WgXcQ" },
  ...
];
```

The id is the part of a YouTube URL after `v=`. For
`https://www.youtube.com/watch?v=dQw4w9WgXcQ` the id is `dQw4w9WgXcQ`.
There must be exactly 13 entries — leave `youtubeId` blank for any track
you haven't chosen yet, and the playlist will still display, it just
won't play until an id is added.

**2. Photographs.** Drop 13 images into `assets/images/` named
`photo1.jpg` through `photo13.jpg` (or update the `src` paths in the
`photos` array to match whatever filenames you use). Add an optional
`caption` for the text shown under each photo in the fullscreen viewer.

**3. Vinyl artwork.** Replace `assets/images/album.jpg` with a square
image — it's used as the label on both the small icon and the turntable.

**4. Title & background.** Change `siteTitle` in `CONFIG`, and optionally
set `backgroundImage` to a path like `assets/images/background.jpg` for a
photo behind the home screen instead of the default paper-toned gradient.

## Structure

```
index.html      the three screens: home, record player, gallery
style.css       all visual styling, fully commented, responsive
script.js       CONFIG + playlist + photos at the top, logic below
assets/
  images/       album art, gallery photos, optional background
  music/        placeholder — songs stream from YouTube, not local files
  icons/        placeholder — all icons are inline SVG in index.html
```

## Notes

- The record player uses the YouTube IFrame API to stream audio; the
  video itself stays hidden and only the sound (plus your custom player
  UI) is shown.
- The gallery uses a CSS-columns masonry layout, so no layout library is
  needed. Photos lazy-load automatically.
- Keyboard: arrow keys move through the lightbox, `Esc` closes it. Touch
  swipe works the same way on mobile.
- Reduced-motion preferences are respected throughout.
