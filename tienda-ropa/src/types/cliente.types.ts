// Tipos para el sistema de clientes

export interface Cliente {
    id_cliente: number;
    dni: string;
    cuit_cuil: string;
    nombre: string;
    apellido: string;
    domicilio: string;
    telefono: string;
    mail: string;
    estado?: string;
}

export interface LoginRequest {
    mail: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    cliente?: Cliente;
    token?: string;
}

export interface RegisterRequest {
    dni: string;
    cuit_cuil: string;
    nombre: string;
    apellido: string;
    domicilio: string;
    telefono: string;
    mail: string;
    password: string;
}


