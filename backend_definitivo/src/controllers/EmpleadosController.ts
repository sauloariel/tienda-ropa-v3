import { Request, Response } from "express";
import { Empleados } from "../models/Empleados.model";
import { Loguin } from "../models/Loguin.model";
import { Roles } from "../models/Roles.model";

// Crear empleado
export const createEmpleado = async (req: Request, res: Response) => {
  try {
    const empleado = await Empleados.create(req.body);
    res.status(201).json(empleado);
  } catch (error: any) {
    console.error("Error al crear empleado:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los empleados
export const getEmpleados = async (req: Request, res: Response) => {
  try {
    const empleados = await Empleados.findAll({
      include: [
        {
          model: Loguin,
          as: 'logines',
          include: [
            {
              model: Roles,
              as: 'rol',
              attributes: ['id_rol', 'descripcion']
            }
          ],
          attributes: ['id_loguin', 'usuario', 'id_rol']
        }
      ]
    });

    // Transformar los datos para incluir el rol en el nivel principal
    const empleadosConRoles = empleados.map(empleado => {
      const empleadoData = empleado.toJSON() as any;
      const loginData = empleadoData.logines?.[0];

      return {
        ...empleadoData,
        rol: loginData?.rol?.descripcion || null,
        id_rol: loginData?.id_rol || null,
        usuario: loginData?.usuario || null
      };
    });

    res.status(200).json(empleadosConRoles);
  } catch (error: any) {
    console.error("Error al obtener empleados:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener empleado por ID
export const getEmpleadoById = async (req: Request, res: Response) => {
  try {
    const empleado = await Empleados.findByPk(req.params.id, {
      include: [
        {
          model: Loguin,
          as: 'logines',
          include: [
            {
              model: Roles,
              as: 'rol',
              attributes: ['id_rol', 'descripcion']
            }
          ],
          attributes: ['id_loguin', 'usuario', 'id_rol']
        }
      ]
    });

    if (empleado) {
      // Transformar los datos para incluir el rol en el nivel principal
      const empleadoData = empleado.toJSON() as any;
      const loginData = empleadoData.logines?.[0];

      const empleadoConRol = {
        ...empleadoData,
        rol: loginData?.rol?.descripcion || null,
        id_rol: loginData?.id_rol || null,
        usuario: loginData?.usuario || null
      };

      res.status(200).json(empleadoConRol);
    } else {
      res.status(404).json({ error: "Empleado no encontrado" });
    }
  } catch (error: any) {
    console.error("Error al obtener empleado:", error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar empleado por ID
export const updateEmpleado = async (req: Request, res: Response) => {
  try {
    const empleado = await Empleados.findByPk(req.params.id);
    if (empleado) {
      // Separar los datos del empleado de los datos de login/rol
      const { id_rol, ...empleadoData } = req.body;

      // Actualizar datos del empleado
      await empleado.update(empleadoData);

      // Si se proporciona un nuevo rol, actualizar en la tabla loguin
      if (id_rol !== undefined) {
        const loginData = await Loguin.findOne({
          where: { id_empleado: req.params.id }
        });

        if (loginData) {
          await loginData.update({ id_rol });
        }
      }

      // Obtener el empleado actualizado con su información de rol
      const empleadoActualizado = await Empleados.findByPk(req.params.id, {
        include: [
          {
            model: Loguin,
            as: 'logines',
            include: [
              {
                model: Roles,
                as: 'rol',
                attributes: ['id_rol', 'descripcion']
              }
            ],
            attributes: ['id_loguin', 'usuario', 'id_rol']
          }
        ]
      });

      // Transformar los datos para incluir el rol en el nivel principal
      const empleadoDataFinal = empleadoActualizado?.toJSON() as any;
      const loginDataFinal = empleadoDataFinal?.logines?.[0];

      const empleadoConRol = {
        ...empleadoDataFinal,
        rol: loginDataFinal?.rol?.descripcion || null,
        id_rol: loginDataFinal?.id_rol || null,
        usuario: loginDataFinal?.usuario || null
      };

      res.status(200).json(empleadoConRol);
    } else {
      res.status(404).json({ error: "Empleado no encontrado para actualizar" });
    }
  } catch (error: any) {
    console.error("Error al actualizar empleado:", error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar empleado por ID
export const deleteEmpleado = async (req: Request, res: Response) => {
  try {
    const deleted = await Empleados.destroy({ where: { id_empleado: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Empleado no encontrado para eliminar" });
    }
  } catch (error: any) {
    console.error("Error al eliminar empleado:", error);
    res.status(500).json({ error: error.message });
  }
};
