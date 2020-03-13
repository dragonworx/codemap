const editor = CodeMirror.fromTextArea(document.getElementById('code'), {
   lineNumbers: true,
   styleSelectedText: true,
   theme: 'monokai',
   viewportMargin: Infinity,
});

window.setEditorValue = function(src) {
   editor.setValue(src);
   const height = document.querySelector('.CodeMirror').clientHeight;
   let width = 0;
   document.querySelectorAll('span[role=presentation]').forEach(node => {
      width = Math.round(Math.max(width, node.getBoundingClientRect().width));
   });
   return { width, height, gutterSize };
}
//editor.markText({line: 1, ch: 1}, {line: 1, ch: 100}, {className: "styled-background"});