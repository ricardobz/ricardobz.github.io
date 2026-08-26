# ricardobz.github.io

**[My personal website...](https://ricardobz.github.io)**

A terminal-style page: `index.js` fetches `ricardobz.txt` and types it out
character by character into `#console`.

## Running it locally

**It must be served over HTTP.** Opening `index.html` directly by
double-clicking it (a `file://` URL) shows a blank black page:

```
Access to fetch at 'file:///.../ricardobz.txt' from origin 'null'
has been blocked by CORS policy
```

Under `file://` every file is its own opaque origin, so the page is not
allowed to read `ricardobz.txt` next to it, and there is nothing to type.
This is a browser rule, not a bug in the page — GitHub Pages serves over
HTTPS, so production is unaffected.

Start any static server from the project root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> — not the file path.

## Editing the content

The page text lives in `ricardobz.txt`, not in `index.html`.

The junk HTML comments in that file (`<!-- laglaglag... -->`) are
intentional. They are invisible when rendered, but the typewriter still
walks through them character by character, so they act as **pauses**.
Removing them changes the typing rhythm; keep them when editing text.
