import { Router } from "express";
import { MovieController } from "../controllers/movies.controllers.js";

export const createMovieRouter = ({ movieModel }) => {

    const routerMovies = Router();

    const movieController = new MovieController({ movieModel });

    routerMovies.get('/', movieController.getAll);

    routerMovies.get('/:id', movieController.getById);

    routerMovies.post('/', movieController.create);

    routerMovies.delete('/:id', movieController.delete);

    routerMovies.patch('/:id', movieController.update);

    return routerMovies;
}

