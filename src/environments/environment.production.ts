// TODO: deploy to production
export const environment = {
  API_BASE: 'http://localhost:3000',
  STUN_SERVERS: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun.l.google.com:5349' },
      { urls: 'stun:stun1.l.google.com:3478' },
      { urls: 'stun:stun1.l.google.com:5349' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:5349' },
      { urls: 'stun:stun3.l.google.com:3478' },
      { urls: 'stun:stun3.l.google.com:5349' },
      { urls: 'stun:stun4.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:5349' },
    ],
  },
};
