// Helper utilities for the print view. Keep small and dependency-free.
(function(){
  window.printUtils = {
    safeJoin: function(arr, sep){ return Array.isArray(arr) ? arr.join(sep||', ') : '' }
  }
})();
