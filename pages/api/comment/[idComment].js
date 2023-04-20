// pages/api/comment/[idMovie]/[idComment].js
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

/**
* @swagger
* /api/comment/[idComment]:
*   get:
*       description: Retourne les informations d'un commentaire
*       responses:
*           200: 
*               description: Ok
*   post:
*       description: Créer un faux commentaire si id égale à 'null'
*       responses:
*           200: 
*               description: Ok
*           400:
*               description: Ko
*   put:
*       description: Ajoute un like ou si le commentaire n'en a pas, créer le compteur de like à 0
*       responses:
*           200: 
*               description: Ok
*   delete:
*       description: Supprime un commentaire
*       responses:
*           200: 
*               description: Ok
*/
export default async function handler(req, res) {

    const idComment = req.query.idComment
    const client = await clientPromise;
    const db = client.db("sample_mflix");

    const FakeCommentToAdd = {
        "name": "Super Commenteur",
        "email": "scommentor@fakegmail.com",
        "movie_id": "573a1390f29313caabcd4eaf",
        "text": "Super commenteur a vu ce film",
        "date": "2012-12-21T05:54:02.000Z",
        "like": 0
    }

    switch (req.method) {

        //ajouter
        case "POST":
            if(idComment == "null"){
                const dbAddComment = await db.collection("comments").insertOne( FakeCommentToAdd ); //Ajoute le faux commentaire
                res.json({status: 200, data: {comment: dbAddComment} });
            }else {
                res.json({ status: 400, data: "Interdit" });
            }
        break;

        //récupérer
        case "GET":
            const dbComments = await db.collection("comments").findOne({ _id : new ObjectId(idComment) }); //Trouve le commentaire lié à l'id
            res.json({status: 200, data: {comment: dbComments} });
        break;

        //modifier
        case "PUT":
            const commenthavelike = await db.collection("comments").findOne({_id : new ObjectId(idComment), like: { $exists: true } }); //Vérifie si l'attribut "like" existe
            if(!commenthavelike){
                const dbEditComments = await db.collection("comments").updateOne({ _id : new ObjectId(idComment) }, { $set: { like: 0 } }); //Créé l'attribut "like"
                res.json({ status: 200, data: {comment: dbEditComments } });
            } else {
                const dbEditComments = await db.collection("comments").updateOne({ _id : new ObjectId(idComment) }, { $inc: { like: 1 } }); //Ajoute un like
                res.json({ status: 200, data: {comment: dbEditComments } });
            }

        break;

        //supprimer
        case "DELETE":
            const dbDelComments = await db.collection("comments").deleteOne({ _id : new ObjectId(idComment) }) //Supprime le commentaire lié à l'id
            res.json({ status: 200, data: { comment: dbDelComments } });
        break;

    }

}