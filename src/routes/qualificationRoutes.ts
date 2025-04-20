// src/routes/qualificationRoutes.ts
import express from 'express';
import { getQualificationsByID, createQualifications, updateQualifications, deleteQualification, getQualificationsIDs, getAllQualifications, getAverageQualificationByCompanyId } from '../controllers/qualificationController';
import { validateCreate } from '../validators/qualificationValidator';

const router = express.Router();



/**
 * @swagger
 * tags:
 *   name: Qualifications
 *   description: Operaciones relacionadas con calificaciones
 */

/**
 * @swagger
 * /api/qualificationsIDs:
 *   get:
 *     summary: Obtiene todos los IDs de calificaciones
 *     tags: [Qualifications]
 *     responses:
 *       200:
 *         description: Lista de IDs de calificaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: No se encontraron los IDs de calificaciones
 */
router.get('/qualificationsIDs', getQualificationsIDs);

/**
 * @swagger
 * /api/qualifications/average/{companyId}:
 *   get:
 *     summary: Obtiene 2 promedios de calificaciones por ID de compañía, tanto  general como de calidad
 *     tags: [Qualifications]
 *     parameters:
 *       - name: companyId
 *         in: path
 *         required: true
 *         description: ID de la compañía para calcular el promedio de calificaciones
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promedio de calificaciones obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageGeneralScore:
 *                   type: number
 *                 averageQualityScore:
 *                   type: number
 */
router.get('/qualifications/average/:companyId', getAverageQualificationByCompanyId)

/**
 * @swagger
 * /api/qualifications/{id}:
 *   get:
 *     summary: Obtiene una calificación por ID
 *     tags: [Qualifications]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la calificación a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Calificación obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getQualification'
 *       404:
 *         description: No se encontró la calificación
 */
router.get('/qualifications/:id', getQualificationsByID);

/**
 * @swagger
 * /api/qualificationsAll:
 *   get:
 *     summary: Obtiene todas las calificaciones
 *     tags: [Qualifications]
 *     responses:
 *       200:
 *         description: Todas las calificaciones obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/getQualification'
 *       500:
 *         description: Error al obtener las calificaciones
 */
router.get('/qualificationsAll', getAllQualifications);

/**
 * @swagger
 * /api/qualifications:
 *   post:
 *     summary: Crea una nueva calificación
 *     tags: [Qualifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Qualification'
 *     responses:
 *       201:
 *         description: Calificación creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Qualification'
 */
router.post('/qualifications', validateCreate, createQualifications);

/**
 * @swagger
 * /api/qualifications/{id}:
 *   put:
 *     summary: Actualiza una calificación existente
 *     tags: [Qualifications]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la calificación a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Qualification'
 *     responses:
 *       200:
 *         description: Calificación actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Qualification'
 *       404:
 *         description: No se encontró la calificación
 */
router.put('/qualifications/:id', validateCreate, updateQualifications);

/**
 * @swagger
 * /api/qualifications/{id}:
 *   delete:
 *     summary: Elimina una calificación por ID
 *     tags: [Qualifications]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la calificación a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Calificación eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Calificación eliminada correctamente"
 *       404:
 *         description: No se encontró la calificación
 */
router.delete('/qualifications/:id', deleteQualification);


/**
 * @swagger
 * components:
 *   schemas:
 *     Qualification:
 *       type: object
 *       properties:
 *         donationId:
 *           type: string
 *         donatorId:
 *           type: string
 *         organizationId:
 *           type: string
 *         generalScore:
 *           type: integer
 *         notes:
 *           type: string
 *         qualityCalification:
 *           type: object
 *           properties:
 *             score:
 *               type: integer
 *             comments:
 *               type: string
 *         timeCalification:
 *           type: object
 *           properties:
 *             score:
 *               type: integer
 *             comments:
 *               type: string
 *         packagingCalification:
 *           type: object
 *           properties:
 *             score:
 *               type: integer
 *             comments:
 *               type: string
 *         communicationCalification:
 *           type: object
 *           properties:
 *             score:
 *               type: integer
 *             comments:
 *               type: string
 *     getQualification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         donationId:
 *           type: string
 *         donatorId:
 *           type: string
 *         organizationId:
 *           type: string
 *         qualityCalificationId:
 *           type: integer
 *         timeCalificationId:
 *           type: integer
 *         packagingCalificationId:
 *           type: integer
 *         communicationCalificationId:
 *           type: integer
 *         generalScore:
 *           type: integer
 *         notes:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         qualityCalification:
 *           $ref: '#/components/schemas/CalificationDetail'
 *         timeCalification:
 *           $ref: '#/components/schemas/CalificationDetail'
 *         packagingCalification:
 *           $ref: '#/components/schemas/CalificationDetail'
 *         communicationCalification:
 *           $ref: '#/components/schemas/CalificationDetail'
 *     CalificationDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         score:
 *           type: integer
 *         comments:
 *           type: string
 */

export default router;
