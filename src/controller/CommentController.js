import pool from "../bd/Pool.js";
import { validateRole } from "./UserController.js";

const index = async (req, res) => {
  // #swagger.tags = ['Comments']
  try {
    const { headers, query } = req;

    if (query.post_id) {
      const postSql = "SELECT * FROM comments WHERE post_id = ?";
      const [comments] = await pool.execute(postSql, [query.post_id]);

      if (comments.length === 0) {
        return res
          .status(404)
          .json({ message: "No se encontró ninguncomentario con ese ID" });
      }

      return res.status(200).json(comments);
    }
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const show = async (req, res) => {
  // #swagger.tags = ['Comments']

  try {
    const { params } = req;

    const sql = "SELECT * FROM comments WHERE comment_id = ?";
    const [[response]] = await pool.execute(sql, [params.id]);

    if (!response) {
      res.status(404).json({ error: "comentario no encontrado" });
      return;
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const store = async (req, res) => {
  // #swagger.tags = ['Comments']

  const required = ["user_id", "post_id", "content"];

  try {
    const { body } = req;
    const validate = required.filter((field) => !(field in body));

    if (validate.length !== 0) {
      throw {
        message: `el campo ${validate.join(",")} se requiere`,
        status: 400,
      };
    }
    const sql =
      "INSERT INTO comments (user_id, post_id, content) VALUES (?,?,?)";

    await pool.execute(sql, [body.user_id, body.post_id, body.content]);

    res.status(201).json({ message: "comment created successfylly" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  // #swagger.tags = ['Comments']

  try {
    const { body, headers, params } = req;

    if (!headers.user_id) {
      throw { message: "user_id en los encabezados es necesario", status: 400 };
    }

    if (!params.id) {
      throw { message: "comment_id, es necesario", status: 400 };
    }
    await validateRole(headers.user_id, params.id);

    const sql =
      "UPDATE comments SET post_id = ?, content = ? WHERE comment_id = ? AND user_id = ?";

    await pool.execute(sql, [
      body.post_id,
      body.content,
      params.id,
      headers.user_id,
    ]);
    res
      .status(201)
      .json({ message: " post or/end content updated successfully" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const destroy = async (req, res) => {
  // #swagger.tags = ['Comments']
  try {
    const { params, headers } = req;

    await validateRole(headers.user_id, params.id);

    const sql = "DELETE FROM  comments WHERE comment_id = ? AND user_id = ?  ";

    await pool.execute(sql, [params.id, headers.user_id]);

    res.status(201).json({ message: " comment deleted successfully" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

export { index, show, store, update, destroy };
