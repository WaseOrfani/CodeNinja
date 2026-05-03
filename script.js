(function () {
  const details = document.querySelectorAll('details');
  details.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        details.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });
})();
