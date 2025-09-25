// Tipos para el sistema de clientes (simplificado)

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
}

export interface RegisterRequest {
    mail: string;
    password: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    domicilio?: string;
}