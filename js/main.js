const selectElement = document.querySelector('.file_inputSelect');

selectElement.addEventListener('change', (event) => {
  const fileSelected = event.target.value;
  if (fileSelected.endsWith(".tsv")) {
    processTSVData(fileSelected);
  }
});