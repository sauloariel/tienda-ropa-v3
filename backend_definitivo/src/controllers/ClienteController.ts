import { Request, Response } from "express";
import { Clientes } from "../models/Clientes.model";
import bcrypt from "bcrypt";

// Crear cliente
export const createCliente = async (req: Request, res: Response) => {
  try {
    const { password, ...clienteData } = req.body;

    // Hash de la contraseña si se proporciona
    let hashedPassword: string | undefined;
    if (password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    const cliente = await Clientes.create({
      ...clienteData,
      password: hashedPassword
    });

    res.status(201).json(cliente);
  } catch (error: any) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los clientes
export const getClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await Clientes.findAll({
      attributes: { exclude: ['password'] } // Excluir contraseñas de la respuesta
    });
    res.status(200).json(clientes);
  } catch (error: any) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener cliente por ID
export const getClienteById = async (req: Request, res: Response) => {
  try {
    const cliente = await Clientes.findByPk(req.params.id, {
      attributes: { exclude: ['password'] } // Excluir contraseña de la respuesta
    });
    if (cliente) {
      res.status(200).json(cliente);
    } else {
      res.status(404).json({ error: "Cliente no encontrado" });
    }
  } catch (error: any) {
    console.error("Error al obtener cliente:", error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar cliente por ID
export const updateCliente = async (req: Request, res: Response) => {
  try {
    const { password, ...clienteData } = req.body;

    const cliente = await Clientes.findByPk(req.params.id);
    if (cliente) {
      // Hash de la nueva contraseña si se proporciona
      let hashedPassword: string | undefined;
      if (password) {
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(password, saltRounds);
      }

      await cliente.update({
        ...clienteData,
        ...(hashedPassword && { password: hashedPassword })
      });

      // Retornar cliente sin contraseña
      const clienteActualizado = await Clientes.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      });

      res.status(200).json(clienteActualizado);
    } else {
      res.status(404).json({ error: "Cliente no encontrado para actualizar" });
    }
  } catch (error: any) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar cliente por ID
export const deleteCliente = async (req: Request, res: Response) => {
  try {
    const deleted = await Clientes.destroy({ where: { id_cliente: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Cliente no encontrado para eliminar" });
    }
  } catch (error: any) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({ error: error.message });
  }
};

// Función auxiliar para verificar contraseña (útil para login)
export const verifyPassword = async (clienteId: number, password: string): Promise<boolean> => {
  try {
    const cliente = await Clientes.findByPk(clienteId);
    if (cliente && cliente.password) {
      return await bcrypt.compare(password, cliente.password);
    }
    return false;
  } catch (error) {
    console.error("Error verificando contraseña:", error);
    return false;
  }
};
