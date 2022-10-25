// API endpoints

import Env from './env';

const makeURL = (url, version = Env.version) => {
  return `${Env.baseURL}/v${version}/${url}`;
};
const url = {
  // guestLogin: makeURL('user/guest_login'),
};

export default url;
