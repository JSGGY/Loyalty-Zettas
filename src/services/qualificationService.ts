import prisma from '../utils/prismaClient';

export const getQualificationsIDs = async () => {
  try {
    return await prisma.qualification.findMany({
      select: { id: true },
    });
  } catch (error: any) {
    console.error('Error al obtener las IDs de qualifications:', error);
    throw new Error('No se pudieron obtener las IDs de qualifications');
  }
};

export const getQualificationsByID = async (id: number) => {
  try {
    const qualification = await prisma.qualification.findUnique({
      where: { id },
      include: {
        qualityCalification: true,
      },
    });

    if (!qualification) {
      return null;
    }

    return qualification;
  } catch (error: any) {
    console.error('Error al obtener las calificaciones por ID:', error);
    throw new Error('No se pudieron obtener las calificaciones por ID');
  }
};

export const getAllQualifications = async () => {
  return await prisma.qualification.findMany({
    include: {
      qualityCalification: true,
    },
  });
};

export const getAverageQualificationByCompanyId = async (companyId: string) => {
  return await prisma.qualification.findMany({
    where: { companyId },
    include: {
      qualityCalification: true,
    },
  });
}

export const createQualifications = async (data: any) => {
  try {
    // Función para validar que el puntaje esté entre 0 y 5
    const validateScore = (score: number): number => {
      return Math.min(Math.max(score, 0), 5);
    };

    // Asegúrate de que los valores sean números válidos
    const generalScore = validateScore(Number(data.generalScore) || 0);
    const qualityScore = validateScore(Number(data.qualityCalification.score) || 0);

    // Crea la calificación en la base de datos
    const qualification = await prisma.qualification.create({
      data: {
        donationId: data.donationId,
        companyId: data.companyId,
        organizationId: data.organizationId,
        generalScore: generalScore,
        notes: data.notes || "",
        qualityCalification: {
          create: {
            score: qualityScore, // Asegúrate de que este valor sea el correcto
            comments: data.qualityCalification.comments || "",
          },
        },
      },
      include: {
        qualityCalification: true, // Incluye la relación para verificar los datos creados
      },
    });

    return qualification;
  } catch (error: any) {
    console.error("Error al crear la calificación: ", error);
    throw new Error("No se pudo crear la calificación. Verifique los datos e intente nuevamente.");
  }
};

// export const updateQualifications = async (id: number, data: any) => {
//   const qualification = await getQualificationsByID(id);
//   if (!qualification) {
//     return null;
//   }

//   const updatedQualification = await prisma.qualification.update({
//     where: { id },
//     data: {
//       ...data,
//       qualityCalification: {
//         update: data.qualityCalification ? {
//           where: { id: data.qualityCalification.id },
//           data: data.qualityCalification
//         } : undefined
//       },
//       include: {
//         qualityCalification: true
//       },
//     });
//   return updatedQualification;
// };

export const updateQualifications = async (id: number, data: any) => {
  const qualification = await getQualificationsByID(id);
  if (!qualification) {
    return null;
  }

  const updatedQualification = await prisma.qualification.update({
    where: { id },
    data: {
      ...data,
      qualityCalification: data.qualityCalification
        ? {
          update: {
            where: { id: data.qualityCalification.id },
            data: data.qualityCalification,
          },
        }
        : undefined,
    },
    include: {
      qualityCalification: true,
    },
  });

  return updatedQualification;
};

export const deleteQualification = async (id: number) => {
  const qualification = await getQualificationsByID(id);
  if (!qualification) {
    return null;
  }

  return await prisma.qualification.delete({
    where: { id },
    include: {
      qualityCalification: true,
    },
  });
};
