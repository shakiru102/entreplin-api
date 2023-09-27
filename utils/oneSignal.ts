import axios from 'axios';

export interface OneSignalMetaDataProps {
    contents?: {
        en?: string;
    };
    headings?: {
        en?: string;
    };
    subtitle?: {
        en?: string;
    };
    template_id?: string;
    content_available?: boolean;
    target_content_identifier?: string;
    big_picture?: string;
}

export const sendNotification = async (
    deviceIds: string[],
    oneSignaleMetaData: OneSignalMetaDataProps
) => {
    try {
        const notification = await axios.post(
            'https://onesignal.com/api/v1/notifications',
            {
                app_id: process.env.ONESIGNAL_APP_ID,
                include_subscription_ids: deviceIds,
                ...oneSignaleMetaData,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
                },
            }
        );
        console.log(notification.data, 'success');
        return notification.data;
    } catch (error: any) {
        console.log(error, 'error');
        //  throw error;
    }
};

