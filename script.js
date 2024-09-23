let settings;

if (!localStorage.getItem('scribe-settings')) {
    settings = {
        'theme': 'dark'
    };
    localStorage.setItem('scribe-settings', JSON.stringify(settings));
} else {
    settings = JSON.parse(localStorage.getItem('scribe-settings'));
}

const theme = {
    set: function(x) {
        if (x) {
            document.body.className = '';
            document.body.classList.add(x);
            settings.theme = x;
        } else {
            document.body.className = '';
        }
        localStorage.setItem('scribe-settings', JSON.stringify(settings));
    },
    
    toggle: function() {
        if (settings.theme === 'dark') {
            document.body.className = '';
            document.body.classList.add('light');
            this.set('light');
        } else {
            document.body.className = '';
            document.body.classList.add('dark');
            this.set('dark');
        }
        localStorage.setItem('scribe-settings', JSON.stringify(settings));
    }
};

theme.set(settings.theme);

const menuItems = document.querySelectorAll('.menu-item-wrapper');

function openDropdown(menuItem) {
    document.querySelectorAll('.menu-drop').forEach(dropdown => { dropdown.style = ''; });
    document.querySelectorAll('.menu-item-wrapper').forEach(item => item.classList.remove('active'));
    const dropdown = menuItem.querySelector('.menu-drop');
    if (dropdown) {
        dropdown.style.display = 'flex';
        menuItem.classList.add('active');
    }
}

menuItems.forEach(item => {
    item.addEventListener('click', (event) => {
        event.stopPropagation();
        openDropdown(item);
    });

    item.addEventListener('mouseover', () => {
        const anyDropdownOpen = Array.from(menuItems).some(item => {
            const dropdown = item.querySelector('.menu-drop');
            return dropdown && dropdown.style.display === 'flex';
        });
        if (anyDropdownOpen) {
            openDropdown(item);
        }
    });
});

document.querySelectorAll('.menu-drop-item').forEach(dropItem => {
    dropItem.addEventListener('click', (event) => {
        event.stopPropagation();
        document.querySelectorAll('.menu-drop').forEach(dropdown => { dropdown.style = ''; });
        document.querySelectorAll('.menu-item-wrapper').forEach(item => item.classList.remove('active'));
    });
});

document.addEventListener('click', event => {
    document.querySelectorAll('.menu-drop').forEach(dropdown => { dropdown.style = ''; });
    document.querySelectorAll('.menu-item-wrapper').forEach(item => item.classList.remove('active'));
});

// Modal

function openModal(data) {
    const modalOuter = document.querySelector(".modal-outer");
    const modalInner = document.querySelector(".modal");
    const bodyInner = document.querySelector(".body-inner");

    if (data) {
        if (data.small) {
            modalInner.classList.add("small");
        }

        document.querySelector(".modal-inner").innerHTML = `
        <span class="modal-header">${data.title}</span>
        <span class="modal-body">${data.body}</span>
        `;
        document.querySelector(".modal-options").innerHTML = `
        <button class="modal-button" onclick="closeModal()">Close</button>
        `;
    }
    modalOuter.style.visibility = "visible";
    modalOuter.classList.add("open");
    bodyInner.classList.add("fade");
}

function closeModal() {
    const modalOuter = document.querySelector(".modal-outer");
    const modalInner = document.querySelector(".modal");
    const bodyInner = document.querySelector(".body-inner");

    bodyInner.classList.remove("fade");
    modalOuter.classList.remove("open");

    setTimeout(() => {
        modalOuter.style.visibility = "hidden";
        modalInner.classList.remove("small");
        document.querySelector(".modal-inner").innerHTML = ``;
        document.querySelector(".modal-options").innerHTML = ``;
    }, 500);
}

function aboutModal() {
    const modalOuter = document.querySelector(".modal-outer");
    const modalInner = document.querySelector(".modal");
    const bodyInner = document.querySelector(".body-inner");

    modalInner.classList.add("small");
    document.querySelector(".modal-inner").innerHTML = `
    <span class="modal-header">About Scribe</span>
    <span class="modal-body">Beta version</span>
    `;
    document.querySelector(".modal-options").innerHTML = `
     <button class="modal-button" onclick="closeModal()">Close</button>
    `;
    modalInner.classList.add("small");
    modalOuter.style.visibility = "visible";
    modalOuter.classList.add("open");
    bodyInner.classList.add("fade");
}

function editModal() {
    const modalOuter = document.querySelector(".modal-outer");
    const modalInner = document.querySelector(".modal");
    const bodyInner = document.querySelector(".body-inner");

    modalInner.classList.add("small");
    document.querySelector(".modal-inner").innerHTML = `
    <span class="modal-header">Copying and pasting</span>
    <span class="modal-body">These actions are unavailable using the Edit menus, but you can still use:</span>
    <div style='display: flex; gap: 50px;'>
        <div style='display: flex; flex-direction: column;gap: 5px;'>
            <span style='font-weight: bold;font-size: 24px;'>Ctrl + C</span>
            <span>For copy</span>
        </div>
        <div style='display: flex; flex-direction: column;gap: 5px;'>
            <span style='font-weight: bold;font-size: 24px;'>Ctrl + V</span>
            <span>For paste</span>
        </div>
        <div style='display: flex; flex-direction: column;gap: 5px;'>
            <span style='font-weight: bold;font-size: 24px;'>Ctrl + X</span>
            <span>For cut</span>
        </div>
    </div>
    `;
    document.querySelector(".modal-options").innerHTML = `
     <button class="modal-button" onclick="closeModal()">Close</button>
    `;
    modalInner.classList.add("small");
    modalOuter.style.visibility = "visible";
    modalOuter.classList.add("open");
    bodyInner.classList.add("fade");
}

function newModal() {
    const modalOuter = document.querySelector(".modal-outer");
    const modalInner = document.querySelector(".modal");
    const bodyInner = document.querySelector(".body-inner");

    modalInner.classList.add("small");
    document.querySelector(".modal-inner").innerHTML = `
    <span class="modal-header">New Document</span>
    <span class="modal-body">Are you sure you want to create a new document? All unsaved changes will be lost.</span>
    `;
    document.querySelector(".modal-options").innerHTML = `
     <button class="modal-button" onclick="menu.new();closeModal()">Confirm</button>
     <button class="modal-button" onclick="closeModal()">Cancel</button>
    `;
    modalInner.classList.add("small");
    modalOuter.style.visibility = "visible";
    modalOuter.classList.add("open");
    bodyInner.classList.add("fade");
}