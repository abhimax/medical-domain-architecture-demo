// Async boundary required by Module Federation so shared deps (react, react-dom)
// can negotiate versions before any module that uses them is evaluated.
import('./bootstrap');
