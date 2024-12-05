import mysql from 'mysql2/promise';

const config = {
    host: 'localhost',
    user: 'root',
    poer: 3306,
    password: '',
    database: 'moviesdb'
}

const connection = await mysql.createConnection(config);

export class MovieModel {

    static async getAll({ genre }) {

        //! todo
        // const [genres] = await connection.query(
        //     'SELECT id, name FROM genre WHERE LOWER(name) = ?;', [lowerCaseGenre]
        // );

        // if (genres.length === 0) return [];

        // const [{id}] = genres

        // get all movies ids from database table
        // la query a movie_genres
        // join
        // y devolver resultados..
        // return []


        const [movies, tableInfo] = await connection.query(
            'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie;'
        );

        return movies
    }

    static async getById({ id }) {
        const [movies] = await connection.query(
            `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);`, [id]
        )

        if (movies.length === 0) return null

        return movies[0];
    }

    static async create({ input }) {
        const {
            genre: genreInput, // genre is an array
            title,
            year,
            duration,
            director,
            rate,
            poster
        } = input

        const [uuidResult] = await connection.query('SELECT UUID() uuid;')
        const [{ uuid }] = uuidResult;

        try {
            await connection.query(
                `INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)`, [uuid, title, year, director, duration, poster, rate]
            )
        } catch (error) {
            throw new Error('Error creating movie');
        }

        const [movies] = await connection.query(
            `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);`, [uuid]
        )

        return movies[0]
    }

    static async delete({ id }) {
        const [result] = await connection.query(
            `DELETE FROM movie WHERE id = UUID_TO_BIN(?);`,
            [id]
        );

        return result.affectedRows > 0; // Devuelve `true` si se eliminó algo, `false` de lo contrario
    }

    static async update({ id, input }) {
        // Obtiene las claves y valores del objeto `input`
        const fields = Object.keys(input); // Ejemplo: ['title', 'year']
        const values = Object.values(input); // Ejemplo: ['Nuevo Título', 2024]

        // Si no hay campos para actualizar, lanza un error o devuelve un resultado apropiado
        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        // Construye dinámicamente la parte `SET` de la consulta
        const setClause = fields.map(field => `${field} = ?`).join(', '); // Ejemplo: 'title = ?, year = ?'

        // Agrega el `id` al final de los valores para la cláusula `WHERE`
        values.push(id);

        // Ejecuta la consulta
        try {
            await connection.query(
                `UPDATE movie SET ${setClause} WHERE id = UUID_TO_BIN(?);`,
                values
            );    
        } catch (error) {
            throw new Error('Error update movie')
        }

        const [movies] = await connection.query(
            `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);`, [id]
        )

        return movies
    }
}