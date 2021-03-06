const editForm = document.getElementsByClassName("form-edit")[0];

if (editForm) {
  const editId = editForm.getAttribute("data-id");
  editForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const searchParams = new URLSearchParams();

    for (const pair of formData) {
      searchParams.append(pair[0], pair[1]);
    }

    fetch("http://localhost:3000/dumps/edit/" + editId, {
      method: "put",
      body: searchParams
    }).then((response) => {
      window.location.href = '/dumps/success';
    }).catch(err => {
      console.log(err);
    })
  });
}

const addForm = document.getElementsByClassName("form-add")[0];

if (addForm) {
  addForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const searchParams = new URLSearchParams();

    for (const pair of formData) {
      searchParams.append(pair[0], pair[1]);
    }
    fetch("http://localhost:3000/dumps/add", {
      method: "post",
      body: searchParams
    }).then((response) => {
      window.location.href = '/dumps/success';
    }).catch(err => {
      console.log(err);
    })
  });
}

const delbtn = document.getElementsByClassName("btn-delete")[0];

if (delbtn) {
  delbtn.addEventListener("click", function removeDump(event) {
      const delId = event.target.getAttribute("data-id");
      fetch("http://localhost:3000/dumps/" + delId, {
        method: 'DELETE'
      }).then((response) => {
         window.location.href = '/dumps/success';
      }).catch(err => {
        console.error(err);
      });
  });
}

const restbtn = document.getElementsByClassName("btn-restore")[0];

if (restbtn) {
  restbtn.addEventListener("click", function restoreDump(event) {
      const restId = event.target.getAttribute("data-id");
      fetch("http://localhost:3000/dumps/restore/" + restId)
      .then((response) => {
        window.location.href = '/dumps/success';
      }).catch(err => {
        console.error(err)
      });
  });
}

const starbtn = document.getElementsByClassName("btn-star")[0];

if (starbtn) {
  const starId = starbtn.getAttribute("data-id");
  starbtn.addEventListener("click", function starDump(event) {
    fetch("http://localhost:3000/dumps/star/" + starId)
    .then((response) => {
      starbtn.classList.toggle('starred');
    }).catch(err => {
      console.error(err)
    });
  });
}