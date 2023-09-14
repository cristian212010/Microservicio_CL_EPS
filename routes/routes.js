import express from 'express';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const router = express.Router();

const client = new MongoClient(process.env.DDBB);

const db = client.db('microservicioEps');
const usuario = db.collection('usuario');
const cita = db.collection('cita');
const medico = db.collection('medico');

// 1. Obtener todos los pacientes de manera alfabética.
router.get('/endpoint1', async (req, res) => {
    try {
        await client.connect();
        //se aplico el sort para ordenarlo alfabeticamente indicandole el 1 (si se indica -1 lo hace al contrario)
        const result = await usuario.find().sort({usu_nombre: 1}).toArray(); 
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

// 2. Obtener las citas de una fecha en específico , donde se ordene los pacientes de manera alfabética.
/* router.get('/endpoint2', async (req, res) => {
    try {
        await client.connect();
        const result = await cita.find({cit_fecha: "2023-09-15"}).toArray();
        const pacientes = await usuario.find({usu_id: result.cit_datosUsuario}).toArray();
        res.json(pacientes);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}); */

// 3. Obtener todos los médicos de una especialidad en específico (por ejemplo, ‘Cardiología’).
router.get('/endpoint3', async (req, res) => {
    try {
        await client.connect();
        const result = await medico.aggregate([
            {
                $lookup: {
                  from: 'especialidad', // se referencia la colleccion la cual se va a traer el dato
                  localField: 'med_especialidad',  // referencio la llave la cual se va a relacionar con la otra tabla
                  foreignField: 'esp_id', // referencio la llave la cual se relacionara con la tra tabla
                  as: 'esp_nombre', // indico el nombre que va a recibir la llave que va a almacenar el dato que traemos
                },
            }
        ]).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    } 
});

// 4. Encontrar la próxima cita para un paciente en específico (por ejemplo, el paciente con user_id 1).
router.get('/endpoint4', async (req, res) => {
    try {
        await client.connect();
        // el .limit indicandole el 1 solo me trae el primer dato 
        const result = await cita.find({cit_datosUsuario: 1}).sort({cit_fecha: 1}).limit(1).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

/* //5
router.get('/endpoint5', async (req, res) => {
    try {
        await client.connect();
        const result = await cita.find({cit_medico: 1}).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}); */



// 6. Encontrar todas las citas de un día en específico (por ejemplo, ‘2023-07-12’).
router.get('/endpoint6', async (req, res) => {
    try {
        await client.connect();
        // filtro por la fecha indicada
        const result = await cita.find({cit_fecha: "2023-09-15"}).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

//7 Obtener todos los médicos con sus consultorios correspondientes.
router.get('/endpoint7', async (req, res) => {
    try {
        await client.connect();
        const result = await medico.aggregate([
            {
              $lookup: {
                from: 'consultorio',
                localField: 'med_consultorio', 
                foreignField: 'cons_codigo', 
                as: 'cons_nombre', 
              },
            }
        ]).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});


// 8. Contar el número de citas que un médico tiene en un día específico (por ejemplo, el médico con med_numMatriculaProfesional 1 en ‘2023-07-12’).
router.get('/endpoint8', async (req, res) => {
    try {
        await client.connect();
        // el $and indica que se tienen que cumplir los dos parametros
        const result = await cita.find({$and: [{cit_medico: 1}, {cit_fecha: "2023-09-15"}]}).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

//9
/* router.get('/endpoint9', async (req, res) => {
    try {
        await client.connect();
        const result = await citas.aggregate([
        ]).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}); */

// 12. Mostrar todas las citas que fueron rechazadas de un mes en específico. Dicha consulta deberá mostrar la fecha de la cita, el nombre del usuario y el médico designado.
router.get('/endpoint12', async (req, res) => {
    try {
        await client.connect();
        const result = await cita.find({$and: [{cit_estadoCita: 4}, {cit_fecha: {$regex:"-09-"}}]}).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

export default router;