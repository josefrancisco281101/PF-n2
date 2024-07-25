import pool from "../bd/Pool.js";
import { validateRole } from "./UserController.js";

const index = async (req, res) => {
  // #swagger.tags = ['Posts']
  try {
    const { headers, query } = req;

    if (query.title) {
      const titleSql = "SELECT * FROM posts WHERE title LIKE ?";
      const [titles] = await pool.execute(titleSql, [`%${query.title}%`]);
      if (titles.length === 0) {
        return res.status(404).json({ message: 'No se encontró ningún post con ese título' });
      }

        return res.status(200).json(titles);
    }

    if (query.category_id) {
      const titleSql = "SELECT * FROM categories WHERE category_id = ?";
      const [categories] = await pool.execute(titleSql, [query.category_id]);
       
      if (categories.length === 0) {
         return res.status(404).json({ message: 'No se encontró ninguna categoría con ese ID' });
      }

     return res.status(200).json(categories);
    }
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const show = async (req, res) => {
  // #swagger.tags = ['Posts']

  try {
    const { params } = req;

    const sql = "SELECT * FROM posts WHERE post_id = ?";
    const [[response]] = await pool.execute(sql, [params.id]);

    if (!response) {
      res.status(404).json({ error: "publicacion no encontrado" });
      return;
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const store = async (req, res) => {
  // #swagger.tags = ['Posts']

  const required = ["user_id", "title", "content"];

  try {
    const { body } = req;
    const validate = required.filter((field) => !(field in body));

    if (validate.length !== 0) {
      throw {
        message: `el campo ${validate.join(",")} se requiere`,
        status: 400,
      };
    }
    const sql = "INSERT INTO posts (user_id, title, content) VALUES (?,?,?)";

    await pool.execute(sql, [body.user_id, body.title, body.content]);

    res.status(201).json({ message: "User created successfylly" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  // #swagger.tags = ['Posts']

  try {
    const { body, headers, params } = req;

    if (!headers.user_id) {
      throw { message: "user_id en los encabezados es necesario", status: 400 };
    }

    if (!params.id) {
      throw { message: "post_id, es necesario", status: 400 };
    }
    await validateRole(headers.user_id, params.id);

    const sql =
      "UPDATE posts SET title = ?, content = ? WHERE post_id = ? AND user_id = ?";

    await pool.execute(sql, [
      body.title,
      body.content,
      params.id,
      headers.user_id,
    ]);
    res
      .status(201)
      .json({ message: " title or/end content updated successfully" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const destroy = async (req, res) => {
  // #swagger.tags = ['Posts']
  try {
    const { params, headers } = req;

    await validateRole(headers.user_id, params.id);

    const sql = "DELETE FROM  posts WHERE post_id = ? AND user_id = ?  ";

    await pool.execute(sql, [params.id, headers.user_id]);

    res.status(201).json({ message: " User deleted successfully" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

export { index, show, store, update, destroy };
