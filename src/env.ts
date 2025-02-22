let API_URL = localStorage.getItem('API_URL');
const env = {
    API_URL: API_URL ? API_URL : (process.env.NODE_ENV === 'production' ? window.location.origin : 'http://192.168.138.190:8000'),
    debug: true
};

export default env;