import axios from 'axios';
import { config } from '../config/config';

export async function login(email: string, password: string) {
    const { data } = await axios.post(`${config.api.baseURL}/auth/login`, {
        usuario: email,
        password: password
    });
    return data; // { token, user: { id, nombre, rol } }
}
