var xhr= new XMLHttpRequest();
xhr.open('GET', 'http://localhost:3000/navbar.html', true);
xhr.onreadystatechange= function() {
    if (this.readyState!==4) return;
    if (this.status!==200) return;

    docbody = document.getElementById('sidebar-left').innerHTML = this.responseText;
};
xhr.send();