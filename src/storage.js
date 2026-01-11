const STORAGE_KEY = 'math_fun_history';

export const saveResult = (result) => {
    const history = getHistory();
    history.unshift({
        id: Date.now(),
        date: new Date().toLocaleString(),
        ...result
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 50))); // Keep last 50
};

export const getHistory = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
};
