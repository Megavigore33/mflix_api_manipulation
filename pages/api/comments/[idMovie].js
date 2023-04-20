// pages/api/comments/[idMovie].js
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

/**
* @swagger
* /api/comments/[idMovie]:
*   get:
*       description: Retourne les commentaires liés à un film
*       responses:
*           200: 
*               description: Ok
*/
export default async function handler(req, res) {
    const idMovie = req.query.idMovie
    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const comments = await db.collection("comments").find({ "movie_id" : new ObjectId(idMovie) }).toArray(); //Trouve le(s) commentaire(s) lié(s) à un film
    res.json({ status: 200, data: comments });
}