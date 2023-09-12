import * as OneSignal from '@onesignal/node-onesignal'

const app_key_provider = {
    getToken() {
        return process.env.ONESIGNAL_API_KEY;
    }
};

const configuration = OneSignal.createConfiguration({
    authMethods: {
        app_key: {
            tokenProvider: app_key_provider as any
        }
    }
})

export const oneSignalClient = new OneSignal.DefaultApi(configuration)