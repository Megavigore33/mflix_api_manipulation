// pages/api/movie/[id].js
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

/**
* @swagger
* /api/movie/[idMovie]:
*   get:
*       description: Retourne les informations d'un film
*       responses:
*           200: 
*               description: Ok
*   post:
*       description: Ajoute un film si id égale a 'null'
*       responses:
*           200: 
*               description: Ok
*           400 : 
*               description: Ko
*   put:
*       description: Ajoute Tristan R. dans la liste des directeurs d'un film s'il n'y est pas
*       responses:
*           200: 
*               description : Ok
*           420:
*               description: Ko
*   delete:
*       description: Supprime un film
*       responses:
*           200: 
*               description: Ok
*/
export default async function handler(req, res) {

    const idMovie = req.query.idMovie;
    const client = await clientPromise;
    const db = client.db("sample_mflix");

    const FakeMovieToAdd = {
        "plot": "UN FILM INCROYAAAAAABLE DE CRIMINEL",
        "genres": [
            "Crime",
            "Drama"
        ],
        "runtime": 88,
        "cast": [
            "Jean Onche",
            "John Doe",
            "La panthère rose"
        ],
        "num_mflix_comments": 1,
        "poster": "https://images7.alphacoders.com/857/thumb-1920-857882.jpg",
        "title": "Le caca criminel",
        "lastupdated": "2015-09-15 02:07:14.247000000",
        "languages": [
            "Francais"
        ],
        "released": "1913-11-24T00:00:00.000Z",
        "directors": [
            "Tristan R."
        ],
        "rated": "TV-PG",
        "awards": {
            "wins": 666,
            "nominations": 0,
            "text": "1 win."
        },
        "year": 1969,
        "imdb": {
            "rating": 6,
            "votes": 371,
            "id": 3471
        },
        "countries": [
            "France"
        ],
        "type": "movie",
        "tomatoes": {
            "viewer": {
                "rating": 3,
                "numReviews": 85,
                "meter": 57
            },
            "dvd": "2008-08-26T00:00:00.000Z",
            "lastUpdated": "2015-08-10T18:33:55.000Z"
        }
    }

    switch (req.method) {
        
        //ajouter
        case "POST":
            if(idMovie == "null"){
                const dbAddMovie = await db.collection("movies").insertOne( FakeMovieToAdd ); //Ajoute le faux film
                res.json({status: 200, data: {movie: dbAddMovie} });
            }else {
                res.json({ status: 400, data: "Interdit" });
            }
        break;
    
        //récupérer
        case "GET":
            const dbMovie = await db.collection("movies").findOne({ _id : new ObjectId(idMovie) }); //Trouve le film lié à l'id
            res.json({status: 200, data: {movie: dbMovie} });
        break;

        //modifier
        case "PUT":
            const dbEditMovie = await db.collection("movies").findOne({ _id : new ObjectId(idMovie) }); //Cherche le film
            if(dbEditMovie) { //Vérifie si il existe
                const movieHaveMyselfAsDirector = await db.collection("movies").findOne({$and: [{ _id : new ObjectId(idMovie) }, { directors: { $in: ["Tristan R."] } }]}); //Vérifie si Tristan R. est dans les directeurs du film
                console.log(movieHaveMyselfAsDirector);
                if(movieHaveMyselfAsDirector == null){
                    const dbEditMovie = await db.collection("movies").updateOne({ _id : new ObjectId(idMovie) }, { $push: { directors: "Tristan R." } }); //Ajoute Tristan R. dans les directeurs du film
                    res.json({ status: 200, data: {comment: dbEditMovie } });
                } else {
                    res.json({ status: 420, data: "Tristan R. est déjà directeur de ce film" });
                }
            }
        break;

        //supprimer
        case "DELETE":
            const dbDelMovie = await db.collection("movies").deleteOne({ _id : new ObjectId(idMovie) }); //Supprime le film lié à l'id
            res.json({status: 200, data: {movie: dbDelMovie} });
        break;
    }



}