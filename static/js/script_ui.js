{
    var xhr= new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/navbar.html', true);
    xhr.onreadystatechange= function() {
        if (this.readyState!==4) return;
        if (this.status!==200) return;

        docbody = document.getElementsByClassName('sidebar-left')[0].innerHTML = this.responseText;
    };
    xhr.send();

    let user;

    function getUserData() {
        fetch('http://localhost:3000/users/data')
            .then((response) => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                    return;
                }
        
                // Examine the text in the response
                response.json().then((user) => {
                    renderUserData(user);
                });
            })
            .catch((err) => {
                console.log('Fetch Error :-S', err);
            });
    }

    let options = { year: 'numeric', month: "short", day: "numeric"};

    getUserData();
    function renderUserData(user) {
        let textNode = document.createTextNode(user.name);
        document.getElementsByClassName("name")[0].appendChild(textNode);

        let dropdownMenuItems = document.getElementsByClassName("dropdown-menu-item");
        if (dropdownMenuItems[0].textContent === "") {
            dropdownMenuItems[0].textContent = user.username;
        }
        if (dropdownMenuItems[1].textContent === "") {
            dropdownMenuItems[1].textContent = user.email;
        }
        let date;
        date = new Date(user.joined);
        if (dropdownMenuItems[2].textContent === "Joined on ") {
            dropdownMenuItems[2].textContent += date.toLocaleDateString(undefined, options);
        }
    }

    function getUserSize() {
        fetch('http://localhost:3000/dumps/total_size')
            .then((response) => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                    return;
                }
        
                // Examine the text in the response
                response.json().then((size_obj) => {
                    renderProgressBar(size_obj.size);
                });
            })
            .catch((err) => {
                console.log('Fetch Error :-S', err);
            });
    }

    const magnitude = [' ', ' K', ' M', ' G'];
    function renderProgressBar(size) {
        const percentage = size / Math.pow(1024, 3) * 100;
        let magn = 0;
        while (size >= 1024) {
            magn++;
            size /= 1024;
        }        
        document.getElementsByClassName("bar-progress")[0].style.width = percentage + "%";
        document.getElementsByClassName("bar-progress-description")[0].textContent = Math.floor(size * 100) / 100 + magnitude[magn] + "B / 1 GB"
    }

    getUserSize();
}
