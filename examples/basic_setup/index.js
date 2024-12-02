import { makePowerClient } from "../../src/power";

const scopes = [
    'user.read',
    'mailboxsettings.read',
    'calendars.readwrite'
];

const power = await makePowerClient({
    redirectUri: "http://localhost:8080",
    clientId: "de036b52-45b3-42c1-823e-b5fa36d637bd",
    tenantId: "652aacac-e3a4-4568-8ff5-5d230f3032dd",
    scopes
});

const user = await power.getUser();
user_id.innerText = `ID: ${user.id}`;
user_name.innerText = `Display name: ${user.displayName}`;
