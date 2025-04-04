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
        timeCalification: true,
        packagingCalification: true,
        communicationCalification: true,
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
      timeCalification: true,
      packagingCalification: true,
      communicationCalification: true,
    },
  });
};

export const createQualifications = async (data: any) => {
  try {
    const validateScore = (score: number): number => {
      return Math.min(Math.max(score, 0), 5);
    };

    const generalScore = validateScore(parseFloat(data.generalScore.text) || 0);
    const qualityScore = validateScore(parseInt(data.qualityCalification.text, 10) || 0);
    const timeScore = validateScore(parseInt(data.timeCalification.text, 10) || 0);
    const packagingScore = validateScore(parseInt(data.packagingCalification.text, 10) || 0);
    const communicationScore = validateScore(parseInt(data.communicationCalification.text, 10) || 0);

    const qualification = await prisma.qualification.create({
      data: {
        donationId: data.donationId,
        donatorId: data.donatorId,
        organizationId: data.organizationId,
        generalScore: generalScore,
        notes: data.notes || "",

        qualityCalification: {
          create: {
            score: qualityScore,
            comments: data.qualityCalification.comments || "",
          }
        },

        timeCalification: {
          create: {
            score: timeScore,
            comments: data.timeCalification.comments || "",
          }
        },

        packagingCalification: {
          create: {
            score: packagingScore,
            comments: data.packagingCalification.comments || "",
          }
        },

        communicationCalification: {
          create: {
            score: communicationScore,
            comments: data.communicationCalification.comments || "",
          }
        }
      }
    });

    return qualification;
  } catch (error: any) {
    console.error("Error al crear la calificación: ", error);
    throw new Error("No se pudo crear la calificación. Verifique los datos e intente nuevamente.");
  }
};

export const updateQualifications = async (id: number, data: any) => {
  const qualification = await getQualificationsByID(id);
  if (!qualification) {
    return null;
  }

  const updatedQualification = await prisma.qualification.update({
    where: { id },
    data: {
      ...data,
      qualityCalification: {
        update: data.qualityCalification ? {
          where: { id: data.qualityCalification.id },
          data: data.qualityCalification
        } : undefined
      },
      timeCalification: {
        update: data.timeCalification ? {
          where: { id: data.timeCalification.id },
          data: data.timeCalification
        } : undefined
      },
      packagingCalification: {
        update: data.packagingCalification ? {
          where: { id: data.packagingCalification.id },
          data: data.packagingCalification
        } : undefined
      },
      communicationCalification: {
        update: data.communicationCalification ? {
          where: { id: data.communicationCalification.id },
          data: data.communicationCalification
        } : undefined
      }
    },
    include: {
      qualityCalification: true,
      timeCalification: true,
      packagingCalification: true,
      communicationCalification: true,
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
      timeCalification: true,
      packagingCalification: true,
      communicationCalification: true,
    },
  });
};
