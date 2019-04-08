import { stringify } from 'qs';
import SITE_URL from './setting';
import request from '@/utils/request';

export async function submitNoticeForm(params, token) {
  return request(`${SITE_URL.SERVER_API}/api/notices`, {
    method: 'POST',
    body: params,
    headers: {
      Authorization: token,
    },
  });
}

export async function queryNotices() {
  return request(`${SITE_URL.SERVER_API}/api/notices`, {
    method: 'GET',
  });
}

export async function querySingleNotice(id) {
  return request(`${SITE_URL.SERVER_API}/api/notices/${id}`, {
    method: 'GET',
  });
}

export async function deleteNotice(params, token) {
  return request(`${SITE_URL.SERVER_API}/api/notices/${params.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: token,
    },
  });
}

export async function updateNotice(params, token) {
  return request(`${SITE_URL.SERVER_API}/api/notices/${params.id}`, {
    method: 'PUT',
    body: params,
    headers: {
      Authorization: token,
    },
  });
}

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

// export async function fakeAccountLogin(params) {
//   return request('/api/login/account', {
//     method: 'POST',
//     body: params,
//   });
// }

export async function fakeAccountLogin(params) {
  return request('http://localhost:5000/api/users/login', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
