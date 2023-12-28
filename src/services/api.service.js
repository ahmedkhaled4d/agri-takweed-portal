// const baseUrl = 'https://us-central1-takweed-eg.cloudfunctions.net/admin';

// const baseUrl = 'http://localhost:3002/admin';
const baseUrl = process.env.REACT_APP_BASE_URL_FETCH;
// const baseUrl =
// 'https://68fd-197-49-238-52.ngrok-free.app/takweed-eg/us-central1/admin';
// console.log(process.env);
// const baseUrl =
//   'https://0c2a-197-49-4-228.ngrok-free.app/takweed-eg/us-central1/admin';

const token = localStorage.getItem('token');

const fetchData = (route, method, body = null, headers = null) => {
  return fetch(baseUrl + route, {
    method: method,
    headers: new Headers({
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      // 'ngrok-skip-browser-warning': true,
      'Content-Type': 'application/json',
      ...headers,
    }),
    body: body === null ? null : JSON.stringify(body),
  });
};
export { fetchData };
