/* MODAL */
var Modal = document.createElement('div');
Modal.className = "app-modal-container";
document.body.insertBefore(Modal, document.body.childNodes[0]);

Modal.open = openModal;
Modal.close = closeModal;
Modal.visible = false;
Modal.show = showModal;
Modal.persist = false;

function openModal() {
    this.className = "app-modal-container open";
    this.visible = true;
}

function closeModal() {
    this.className = "modal";
    this.visible = false;
}

function showModal(_content, _header, _persist) {

    if (typeof _header === "undefined") _header = '';
    if (typeof _content === "undefined") _content = '';
    typeof _persist === "undefined" ? this.persist = false : this.persist = true;

    _html = '<div class="app-modal">' +
                '<h3 id="modal-header">' + _header + ' </h3>' +
                '<h5 id="moda-text">' + _content + ' </h5>' 
            '</div>';

    this.innerHTML = _html;
    this.open();
}

// Dismiss modals
Modal.addEventListener('click', function () {
    if (Modal.persist == false && Modal.visible == true) {
        Modal.close();
    }
});