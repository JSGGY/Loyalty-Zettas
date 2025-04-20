import { Request, Response } from "express";
import { z } from 'zod';
import {
  getAllQualifications as fetchAllQualifications,
  createQualifications as addNewQualifications,
  updateQualifications as modifyQualifications,
  deleteQualification as removeQualification,
  getQualificationsIDs as fetchAllQualificationsIDs,
  getQualificationsByID as fetchAllQualificationsByID,
  getAverageQualificationByCompanyId as fetchAverageQualificationByCompanyId,
} from '../services/qualificationService';

// Esquemas para validar el ID, lo transforma de string a número
const idSchema = z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), {
  message: 'El ID proporcionado no es válido',
});

// Define el qualificationSchema
const qualificationSchema = z.object({
  donationId: z.string(),
  companyId: z.string(),
  organizationId: z.string(),
  generalScore: z.number().min(0).max(5),
  notes: z.string(),
  qualityCalification: z.object({
    score: z.number().min(0).max(5),
    comments: z.string(),
  }),

});

export const getAverageQualificationByCompanyId = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;

    const qualifications = await fetchAverageQualificationByCompanyId(companyId);
    if (qualifications.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No se encontraron calificaciones para esta compañía',
      });
    }

    // Calcula el promedio de generalScore
    const totalGeneralScore = qualifications.reduce((sum, q) => sum + q.generalScore, 0);
    const averageGeneralScore = totalGeneralScore / qualifications.length;

    // Calcula el promedio de qualityCalification.score
    const totalQualityScore = qualifications.reduce((sum, q) => sum + (q.qualityCalification?.score || 0), 0);
    const averageQualityScore = totalQualityScore / qualifications.length;

    // Devuelve los promedios
    res.status(200).json({
      status: 200,
      message: 'Promedios calculados correctamente',
      data: {
        averageGeneralScore,
        averageQualityScore,
      },
    });
  } catch (error: any) {
    console.error('Error al calcular los promedios:', error);
    res.status(500).json({
      status: 500,
      message: 'Error al calcular los promedios',
      error: error.message || 'Error interno del servidor',
    });
  }
};

export const getQualificationsIDs = async (res: Response) => {
  try {
    const qualificationsIDs = await fetchAllQualificationsIDs();

    res.status(200).json({
      status: 200,
      message: 'IDs de calificaciones obtenidos correctamente',
      response: qualificationsIDs,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 500,
      message: 'Error al obtener los IDs',
      error: error.message || 'Error interno del servidor',
    });
  }
};


export const getQualificationsByID = async (req: Request, res: Response) => {
  try {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const id = url.pathname.split('/').pop() || '';
    const parsedId = idSchema.parse(id);

    const qualifications = await fetchAllQualificationsByID(parsedId);
    if (!qualifications) {
      res.status(404).json({
        status: 404,
        message: 'No se encontró la calificación',
      });

    } else {
      res.status(200).json({
        status: 200,
        message: 'Todas las calificaciones obtenidas correctamente',
        response: qualifications,
      });
    }

  } catch (error: any) {
    res.status(500).json({
      status: 500,
      message: 'Error al obtener las calificaciones',
      error: error.message || 'Error interno del servidor',
    });
  }
};

export const getAllQualifications = async (res: Response) => {
  try {
    const qualifications = await fetchAllQualifications();
    res.status(200).json({
      status: 200,
      message: 'Todas las calificaciones obtenidas correctamente',
      response: qualifications,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 500,
      message: 'Error al obtener las calificaciones',
      error: error.message || 'Error interno del servidor',
    });
  }
};

export const createQualifications = async (req: Request, res: Response) => {
  try {
    const parsedData = qualificationSchema.parse(req.body);
    const newQualifications = await addNewQualifications(parsedData);

    if (!newQualifications) {
      return res.status(400).json({ message: "Los datos no pudieron ser procesados correctamente" });
    }
    res.status(200).json({
      status: 200,
      message: 'Calificación creada correctamente',
      response: newQualifications,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const simplifiedErrors = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: `${err.path.join('.')} es incorrecta`,
      }));

    } else {
      res.status(500).json({
        status: 500,
        message: 'Error al crear las calificaciones',
        error: error.message || 'Error interno del servidor',
      });
    }
  }
};

export const updateQualifications = async (req: Request, res: Response) => {
  try {
    // Obtener el ID desde los parámetros de la URL
    const id = req.params.id;
    const parsedId = idSchema.parse(id);

    // Validar el cuerpo de la solicitud
    const parsedData = qualificationSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        status: 400,
        message: "Datos de actualización no válidos",
        errors: parsedData.error.format(),
      });
    }

    // Actualizar la calificación
    const updatedQualification = await modifyQualifications(parsedId, parsedData.data);
    if (!updatedQualification) {
      return res.status(404).json({
        status: 404,
        message: "No se encontró la calificación con ese ID",
      });
    }

    res.status(200).json({
      status: 200,
      message: 'La calificación ha sido actualizada correctamente',
      response: updatedQualification,
    });

  } catch (error: any) {
    res.status(500).json({
      status: 500,
      message: 'Error al actualizar la calificación',
      error: error.message || 'Error interno del servidor',
    });
  }
};

export const deleteQualification = async (req: Request, res: Response) => {
  try {
    // Obtener el ID desde los parámetros de la URL
    const id = req.params.id;
    const parsedId = idSchema.safeParse(id);

    if (!parsedId.success) {
      return res.status(400).json({
        status: 400,
        message: "ID no válido",
        errors: parsedId.error.format(),
      });
    }

    // Intentar eliminar la calificación
    const deletedQualification = await removeQualification(parsedId.data);
    if (!deletedQualification) {
      return res.status(404).json({
        status: 404,
        message: "No se encontró la calificación con ese ID",
      });
    }

    res.status(200).json({
      status: 200,
      message: 'La calificación ha sido eliminada correctamente',
      response: deletedQualification,
    });

  } catch (error: any) {
    res.status(500).json({
      status: 500,
      message: 'Error al eliminar la calificación',
      error: error.message || 'Error interno del servidor',
    });
  }
};

const parseRequestBody = (req: Request): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
};
