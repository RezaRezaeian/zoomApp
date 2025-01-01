import jwt from 'jsonwebtoken';

export const generateSignature = (sdkKey, meetingNumber, role = 0) => {
    try {
        // The SDK JWT app secret should be stored in environment variables
        const sdkSecret = process.env.REACT_APP_ZOOM_SDK_SECRET;

        if (!sdkSecret) {
            throw new Error('Zoom SDK secret is not configured');
        }

        const iat = Math.round(new Date().getTime() / 1000);
        const exp = iat + 60 * 60 * 2; // Token expires in 2 hours

        const payload = {
            sdkKey: sdkKey,
            mn: meetingNumber,
            role: role,
            iat: iat,
            exp: exp,
        };

        const token = jwt.sign(payload, sdkSecret);
        console.log(token);
        return token;
    } catch (error) {
        console.error('Failed to generate Zoom signature:', error);
        throw error;
    }
};

// Helper function to validate meeting credentials
export const validateMeetingCredentials = (sdkKey, meetingNumber, password) => {
    if (!sdkKey || !meetingNumber || !password) {
        throw new Error('Missing required meeting credentials');
    }

    if (typeof meetingNumber !== 'string' && typeof meetingNumber !== 'number') {
        throw new Error('Invalid meeting number format');
    }

    return true;
};

// Additional helper to format meeting number if needed
export const formatMeetingNumber = (meetingNumber) => {
    return String(meetingNumber).replace(/\s+/g, '');
};