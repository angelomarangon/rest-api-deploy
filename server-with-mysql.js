import { createApp } from "./app.js";
import { MovieModel } from './model/mysql/movie.mysql.js'

createApp({movieModel: MovieModel})