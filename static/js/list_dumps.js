let url = "http://localhost:3000";

function getDumps() {
    fetch(url + '/dumps/get')
        .then(
            (response) => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                    return;
                }
        
                // Examine the text in the response
                response.json().then((dumps) => {
                    showDumps(dumps);
                });
            }
        )
        .catch((err) => {
            console.log('Fetch Error :-S', err);
        });

}

const magnitude = [' ', ' K', ' M', ' G'];
const options = { year: 'numeric', month: "short", day: "numeric"};

function showEntry(dump) {
    const trow = document.createElement("tr");

    let tcell = [];
    for (let i = 0; i < 4; i++) {
        tcell.push(document.createElement("td"));
    }

    const alink = document.createElement("a");
    alink.href = "/dumps/" + dump._id;
    alink.textContent = dump.title;
    tcell[0].appendChild(alink);

    let size = dump.size, magn = 0;
    while (size >= 1024) {
        magn++;
        size /= 1024;
    }

    tcell[1].textContent = Math.floor(size * 100) / 100 + magnitude[magn] + 'B';
    let date;
    if (dump.created) {
        date = new Date(dump.created);
        tcell[2].textContent = date.toLocaleDateString(undefined, options);
    }
    if (dump.modified) {
        date = new Date(dump.modified);
        tcell[3].textContent = date.toLocaleDateString(undefined, options);
    }

    for (let i = 0; i < 4; i++) {
        trow.appendChild(tcell[i]);
    }

    document.getElementsByClassName("dumps-table")[0].appendChild(trow);
}

function showDumps(dumps) {
    const table = document.createElement("table");
    table.className = "dumps-table";

    const theader = document.createElement("tr");
    table.append(theader);

    const th1 = document.createElement('th');
    th1.textContent = "Name";
    theader.appendChild(th1);

    const th2 = document.createElement('th');
    th2.textContent = "Size";
    theader.appendChild(th2);

    const th3 = document.createElement('th');
    th3.textContent = "Created";
    theader.appendChild(th3);
    
    const th4 = document.createElement('th');
    th4.textContent = "Modified";
    theader.appendChild(th4);
    
    document.getElementById('dumps-list-section').appendChild(table);
    
    dumps.forEach(dump => {
        showEntry(dump);
    });
}

window.onload = () => {
    getDumps();
};