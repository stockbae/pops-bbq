export async function getMenu() {
    const res = await fetch('http://localhost:5000/api/menu');
    const data = await res.json();
    return data.items || [];
}

export async function getMeats() {
    const res = await fetch('http://localhost:5000/api/meats');
    return res.json();
}

export async function getSides() {
    const res = await fetch('http://localhost:5000/api/sides');
    return res.json();
}