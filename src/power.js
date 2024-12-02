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
        graphClient,
        api: graphClient.api.bind(graphClient),
        async getUser() {
            return await graphClient.api("/me")
                .select("id,displayName")
                .get();
        },
        async getUsers() {
            return (await graphClient.api("/users")
            .select("id", "displayName")
            .get()).value;
        }
    };
};
