const txtBtn = document.querySelector('.txt-upload');
const txtTitle = document.querySelector('.form-title');
const txtArea = document.querySelector('.textarea');

txtBtn.addEventListener('input', () => {
    const file = txtBtn.files[0];
    txtTitle.setAttribute("value", file.name);
    file.text().then(text => { txtArea.textContent = text; });
});