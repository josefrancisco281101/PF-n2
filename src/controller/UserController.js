import pool from "../bd/Pool.js";

export const validateRole = async (requestingUserId, targetUserId = null) => {
  const userSql = "SELECT role FROM users WHERE user_id = ?";

  const [rs] = await pool.execute(userSql, [requestingUserId]);

  if (rs.length === 0) {
    throw { message: "Usuario no encontrado", status: 404 };
  }

  const { role } = rs[0];

  if (role !== "admin" && requestingUserId !== targetUserId) {
    throw { message: "Usuario no autorizado", status: 401 };
  }
};

const index = async (req, res) => {
  // #swagger.tags = ['Users']

  try {
    await validateRole(req.headers.user_id);

    const sql = "SELECT * FROM users";
    const [response] = await pool.execute(sql);
    res.status(200).json(response);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const show = async (req, res) => {
  // #swagger.tags = ['Users']

  try {
    const { params, headers } = req;

    await validateRole(headers.user_id, params.id);
    const sql = "SELECT * FROM users WHERE user_id = ?";
    const [[response]] = await pool.execute(sql, [params.id]);

    if (!response) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const store = async (req, res) => {
  // #swagger.tags = ['Users']

  const required = ["username", "email", "password", "role"];

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
      "INSERT INTO users (username, email, password, role) VALUES (?,?,?,?)";

    await pool.execute(sql, [
      body.username,
      body.email,
      body.password,
      body.role,
    ]);

    res.status(201).json({ message: "User created successfylly" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  // #swagger.tags = ['Users']

  try {
    const { body, headers, params } = req;

    if (!headers.user_id) {
      throw { message: "user_id en los encabezados es necesario", status: 400 };
    }

    if (!params.id || !body.role) {
      throw { message: "user_id y role son necesarios", status: 400 };
    }
    await validateRole(headers.user_id, params.id);

    const sql =
      "UPDATE users SET username = ?, email = ?, password = ?, role = ? WHERE user_id = ?";

    await pool.execute(sql, [
      body.username,
      body.email,
      body.password,
      body.role,
      params.id,
    ]);
    res
      .status(201)
      .json({
        message: " username, email, password y/o Role updated successfully",
      });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const destroy = async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const { params, headers } = req;

    await validateRole(headers.user_id, params.id);

    const sql = "DELETE FROM  users WHERE user_id = ? ";

    await pool.execute(sql, [params.id]);

    res.status(201).json({ message: " User deleted successfully" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

export { index, show, store, update, destroy };
