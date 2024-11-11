// src/utils/toastHelper.js
import { toast } from 'react-toastify';

// Generic toast function
const showToast = (message, type = 'info') => {
    switch (type) {
        case 'success':
            toast.success(message);
            break;
        case 'error':
            toast.error(message);
            break;
        case 'info':
            toast.info(message);
            break;
        case 'warning':
            toast.warn(message);
            break;
        default:
            toast(message);
    }
};

export default showToast;
