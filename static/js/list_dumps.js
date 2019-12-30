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
let options = { year: 'numeric', month: "short", day: "numeric" };

function showEntry(dump) {
    const trow = document.createElement("tr");
    trow.className = "dump-row"

    let tcell = [];
    for (let i = 0; i < 4; i++) {
        tcell.push(document.createElement("td"));
    }

    const alink = document.createElement("a");
    alink.href = "/dumps/" + dump._id;
    if (dump.title.length > 20)
        alink.textContent = dump.title.slice(0, 17) + "...";
    else
        alink.textContent = dump.title;
    alink.className = "dump-link";
    tcell[0].appendChild(alink);
    tcell[0].className = "dump-cell dump-title";

    let size = dump.size, magn = 0;
    while (size >= 1024) {
        magn++;
        size /= 1024;
    }

    tcell[1].textContent = Math.floor(size * 100) / 100 + magnitude[magn] + 'B';
    tcell[1].className = "dump-cell dump-size";
    
    let date;
    date = new Date(dump.created);
    tcell[2].textContent = date.toLocaleDateString(undefined, options);
    tcell[2].className = "dump-cell dump-created";

    date = new Date(dump.modified);
    tcell[3].textContent = date.toLocaleDateString(undefined, options);
    tcell[3].className = "dump-cell dump-modified";

    for (let i = 0; i < 4; i++) {
        trow.appendChild(tcell[i]);
    }

    document.getElementsByClassName("dump-table")[0].appendChild(trow);
}

function showDumps(dumps) {
    const table = document.createElement("table");
    table.className = "dump-table";

    const theader = document.createElement("tr");
    theader.className = "dump-header";
    table.append(theader);

    const th1 = document.createElement('th');
    th1.textContent = "Name";
    th1.className = "dump-cell"
    theader.appendChild(th1);

    const th2 = document.createElement('th');
    th2.textContent = "Size";
    th2.className = "dump-cell";
    theader.appendChild(th2);

    const th3 = document.createElement('th');
    th3.textContent = "Created";
    th3.className = "dump-cell";
    theader.appendChild(th3);
    
    const th4 = document.createElement('th');
    th4.textContent = "Modified";
    th4.className = "dump-cell";
    theader.appendChild(th4);
    
    document.getElementsByClassName('main-container')[0].appendChild(table);
    
    dumps.forEach(dump => {
        showEntry(dump);
    });
}

window.onload = () => {
    getDumps();
};