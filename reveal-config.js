Reveal.initialize({
  controls: false,
  progress: true,
  history: true,
  center: true,
  transition: 'fade', // none/fade/slide/convex/concave/zoom
  // Optional reveal.js plugins
  dependencies: [{
    src: 'lib/js/classList.js',
    condition: function() {
      return !document.body.classList;
    }
  }, {
    src: 'node_modules/reveal.js/plugin/highlight/highlight.js',
    async: true,
    condition: function() {
      return !!document.querySelector('pre code');
    },
    callback: function() {
      hljs.initHighlightingOnLoad();
    }
  }
    //{ src: 'plugin/zoom-js/zoom.js', async: true },
    //{ src: 'plugin/notes/notes.js', async: true }
  ]
});
