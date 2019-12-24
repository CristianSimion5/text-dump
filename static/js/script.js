// test fetch, will update with user only dumps
const url = "http://localhost:3000";

function getDumps() {
    fetch(url + '/dumps/global')
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

    function showDumps(dumps) {
        const table = document.createElement("table");
        table.className = "dumps-table";

        const theader = document.createElement("tr");
        table.append(theader);

        const th1 = document.createElement('th');
        th1.textContent = "Name";
        theader.appendChild(th1);

        const th2 = document.createElement('th');
        th2.textContent = "Author";
        theader.appendChild(th2);

        const th3 = document.createElement('th');
        th3.textContent = "Body (WIP)";
        theader.appendChild(th3);

        dumps.forEach(dump => {
            const trow = document.createElement("tr");
            
            for (const key in dump) {
                if (key[0] == "_")  continue;
                const tcell = document.createElement("td");
                if (dump.hasOwnProperty(key)) {
                    if (key == "title") {
                        const alink = document.createElement("a");
                        alink.href = "/dumps/" + dump._id;
                        alink.textContent = dump[key];
                        tcell.appendChild(alink);
                    }
                    else
                        tcell.textContent = dump[key];
                }
                trow.append(tcell);
            }

            table.append(trow);
        });

        document.getElementById('dumps-list-section').append(table);
    }
}

window.onload = () => {
    getDumps();
};