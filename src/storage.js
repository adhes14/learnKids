const STORAGE_BASE_KEY = 'math_fun_history_';
const USER_KEY = 'math_fun_user';
const USERS_LIST_KEY = 'math_fun_users_list';

export const saveUserName = (name) => {
    localStorage.setItem(USER_KEY, name);
    const users = getUsersList();
    if (!users.includes(name)) {
        users.push(name);
        localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
    }
};

export const getUserName = () => {
    return localStorage.getItem(USER_KEY);
};

export const getUsersList = () => {
    const data = localStorage.getItem(USERS_LIST_KEY);
    return data ? JSON.parse(data) : [];
};

export const logoutUser = () => {
    localStorage.removeItem(USER_KEY);
};

export const saveResult = (result) => {
    const name = getUserName();
    if (!name) return;

    const key = `${STORAGE_BASE_KEY}${name}`;
    const history = getHistory();
    history.unshift({
        id: Date.now(),
        date: new Date().toLocaleString(),
        userName: name,
        ...result
    });
    localStorage.setItem(key, JSON.stringify(history.slice(0, 50)));
};

export const getHistory = () => {
    const name = getUserName();
    if (!name) return [];

    const key = `${STORAGE_BASE_KEY}${name}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};

export const clearHistory = () => {
    const name = getUserName();
    if (!name) return;

    const key = `${STORAGE_BASE_KEY}${name}`;
    localStorage.removeItem(key);
};

