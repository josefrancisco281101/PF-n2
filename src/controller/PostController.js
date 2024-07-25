import pool from "../bd/Pool.js";


const index = async (req, res) => {
  // #swagger.tags = ['Posts']
  try {
    const { headers, query,  } = req;

 
      

      if (query.title) {
         const titleSql = "SELECT * FROM posts WHERE title LIKE ?"
    const [titles] = await pool.execute(titleSql, [`%${query.title}%`])

      res.status(200).json(titles)
      }
      if (query.category_id) {
         const titleSql = "SELECT * FROM categories WHERE category_id = ?"
    const [categories] = await pool.execute(titleSql, [query.category_id])

      res.status(200).json(categories)
      }
    
     
    
    
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const show = async (req, res) => {
  // #swagger.tags = ['Posts']

   try {
    const { params } = req;

    
    const sql = "SELECT * FROM posts WHERE post_id = ?"
    const [[response]] = await pool.execute(sql, [params.id])
    
    if (!response) { 
       res.status(404).json({ error: "publicacion no encontrado" });
      return;
    }
    res.status(200).json(response)
  } catch (error) {
    res.status(error.status || 500).json({error: error.message})
  }
};

const store = async (req, res) => {
  // #swagger.tags = ['Posts']

  const required = ["user_id", "email", "password", "role"];

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
  // #swagger.tags = ['Posts']

  try {
    const { body, headers, params } = req;

    if (!headers.user_id) {
      throw { message: "user_id en los encabezados es necesario", status: 400 };
    }

    if (!params.id || !body.role) {
      throw { message: "user_id y role son necesarios", status: 400 };
    }
    await validateRole(headers.user_id, params.id);

    const sql = "UPDATE users SET role = ? WHERE user_id = ?";

    await pool.execute(sql, [body.role, params.id]);
    res.status(201).json({ message: " Role updated successfully" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const destroy = async (req, res) => {
  // #swagger.tags = ['Posts']
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
