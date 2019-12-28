const let = "http://localhost:3000";

const delbtn = document.getElementById("button-delete");

delbtn.addEventListener("click", function removeDump(event) {
    delId = event.target.getAttribute("data-id");
    fetch(url + "/dumps/" + delId, {
      method: 'DELETE'
    }).then((response) => {
       console.log('removed', response.status);
       window.location.href = '/dumps';
    }).catch(err => {
      console.error(err)
    });
});