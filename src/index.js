import { PublicClientApplication, InteractionType } from '@azure/msal-browser'
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';

const makeAuthClient = async (msalConfig, msalRequest) => {
    const msalClient = await PublicClientApplication.createPublicClientApplication(msalConfig);
    const account = msalClient.getActiveAccount();
    if (!account) {
        const authResult = await msalClient.loginPopup(msalRequest);
        msalClient.setActiveAccount(authResult.account);
    }

    return msalClient;
};

const makeGraphClient = (authClient, scopes) => {
    const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(authClient, {
        account: authClient.getActiveAccount(),
        interactionType: InteractionType.Popup,
        scopes
    });
    return Client.initWithMiddleware({authProvider});
};


export const makePowerClient = async ({ redirectUri, clientId, scopes, tenantId }) => {
    const msalConfig = {
        auth: {
            clientId,
            redirectUri,
            authority: `https://login.microsoftonline.com/${tenantId}`,
        }
    };
    const msalRequest = { scopes };
    const authClient = await makeAuthClient(msalConfig, msalRequest);
    const graphClient = makeGraphClient(authClient, scopes);
    return {
        async getUser() {
            return await graphClient.api("/me")
                .select("id,displayName")
                .get();
        }
    };
};

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
