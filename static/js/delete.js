const delbtn = document.getElementsByClassName("btn-delete")[0];

delbtn.addEventListener("click", function removeDump(event) {
    delId = event.target.getAttribute("data-id");
    fetch("http://localhost:3000/dumps/" + delId, {
      method: 'DELETE'
    }).then((response) => {
       window.location.href = '/dumps/success';
    }).catch(err => {
      console.error(err)
    });
});