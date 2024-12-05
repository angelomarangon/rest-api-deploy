import { createApp } from "./app.js";
import { MovieModel } from './model/local-file-system/movie.fs.js'

createApp({movieModel: MovieModel})