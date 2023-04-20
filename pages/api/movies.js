// pages/api/movies.js
import clientPromise from "../../lib/mongodb";

/**
* @swagger
* /api/movies:
*   get:
*       description: Retourne tous les films
*       responses:
*           200:
*               description: Ok
*   post:
*       responses:
*           400:
*               description: Ko
*/
export default async function handler(req, res) {

    switch (req.method) {

        case "POST":
            res.json({ status: 400, data: "Pas de POST possible ici" }); //Retour inutile mais il existe
        break;

        case "GET":
            const client = await clientPromise;
            const db = client.db("sample_mflix");
            const movies = await db.collection("movies").find({}).limit(10).toArray(); //Trouve les 10 premiers films de la BDD
            res.json({ status: 200, data: movies });
        break;

    }

}