import { makePowerClient } from "../../src/power";

const scopes = [
    'user.read',
    'user.readbasic.all'
];

const power = await makePowerClient({
    redirectUri: "http://localhost:8080",
    clientId: "de036b52-45b3-42c1-823e-b5fa36d637bd",
    tenantId: "652aacac-e3a4-4568-8ff5-5d230f3032dd",
    scopes
});

// const users = await power.getUsers();
const users = (await power.api("/users").select("displayName", "id").get()).value;

const makeUserTable = users => {
    console.log(users);
    const table = document.createElement("table");
    const headerRow = document.createElement("tr")
    headerRow.replaceChildren(...Object.keys(users[0]).map(key => {
        const header = document.createElement("th");
        header.innerText = key;
        header.scope = "col";
        return header;
    }));
    table.replaceChildren(...users.map(user => {
        const row = document.createElement("tr");
        const dataFields = Object.keys(user).map(key => {
            const tableData = document.createElement("td")
            tableData.innerText = user[key];
            return tableData;
        })
        row.replaceChildren(...dataFields);
        return row;
    }));
    table.prepend(headerRow);
    return table;
}

const table = makeUserTable(users);
document.body.appendChild(table);
