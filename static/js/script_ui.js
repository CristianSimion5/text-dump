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
}
