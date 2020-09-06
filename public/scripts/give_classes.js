function cloneField() {
    var newFieldContainer = document.querySelector('.schedule-item').cloneNode(true);
    newFieldContainer.querySelectorAll('input').forEach(item => {
        item.value = '';
    });
    document.querySelector('#schedule-items').appendChild(newFieldContainer);
}