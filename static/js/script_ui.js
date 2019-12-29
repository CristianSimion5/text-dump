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

getUserData();
function renderUserData(user) {
    let textNode = document.createTextNode(user.name);
    document.getElementsByClassName("name")[0].appendChild(textNode);
}

