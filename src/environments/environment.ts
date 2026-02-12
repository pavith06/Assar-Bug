type EnvKey = 'local' | 'qc' | 'prod';

const ENV: EnvKey = 'local'; 

const CONFIG = {
  local:
  {
    production: false,
    API_BASE_URL: 'http://192.168.1.35:6060',
    AUTH_URL: 'http://192.168.1.35:6060',
    WEB_SOCKET_URL: 'http://192.168.1.35:6063/digital-paper/ws'
  },
  qc:
  {
    production: false,
    API_BASE_URL: 'https://connect.afnicinsursa.co:6060',
    AUTH_URL: 'https://connect.afnicinsursa.co:6060',
    WEB_SOCKET_URL: 'https://connect.afnicinsursa.co:6063/digital-paper/ws'
  },
  prod:
  {
    production: true,
    API_BASE_URL: 'https://digimi.assar-insursaconnect.co.rw:6060',
    AUTH_URL: 'https://digimi.assar-insursaconnect.co.rw:6060',
    WEB_SOCKET_URL: 'https://digimi.assar-insursaconnect.co.rw:6063/digital-paper/ws'
  }
};

export const environment = CONFIG[ENV];
