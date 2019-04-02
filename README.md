# Gist browser from React Router demo

This code was transcribed (and slightly modified) from the [React Router Introduction](https://reacttraining.com/react-router/) at the React Training site.

Besides showing the basics of how to use react-router-dom, this also has some interesting code such as:

- **dynamically fetching data in a component (LoadFile) with state to trigger a new render once fetched**
- inline styles as components in the jsx file (such as Main, Sidebar...).  This keeps the main HTML/JSX code from being cluttered by the inline styles, and thus is easier to read.
- passing props along so components can serve as wrappers (such as the style components)
- keeping small child components in the same file (nice for demo code to keep in everything in one file, but not so good for promoting component reuse)
- URL parameters for routes - In this case the end of the URL is the id of the Gist selected in the sidebar.