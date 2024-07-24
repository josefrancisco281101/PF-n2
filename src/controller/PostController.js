import pool from "../bd/Pool.js"

const validateRole = async (requestingUserId, targetUserId = null) => {
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
  // #swagger.tags = ['Posts']
  try {
    const { headers, params} = req;

    
    const userSql = "SELECT * FROM users WHERE user_id = ?";
    const [userResult] = await pool.execute(userSql, [headers.user_id]);

    if (userResult.length === 0) {
      throw { message: "El usuario no existe", status: 401 };
    }

   
    const postSql = "SELECT * FROM posts";
    const [response] = await pool.execute(postSql);

    res.status(200).json(response);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const show = async (req, res) => {
  // #swagger.tags = ['Posts']

    try {
    const { headers, params } = req;

    // Verificar si el usuario existe
    const userSql = 'SELECT * FROM users WHERE user_id = ?';
    const [userResult] = await pool.execute(userSql, [headers.user_id]);

    if (userResult.length === 0) {
      throw { message: "El usuario no existe", status: 401 };
    }

    const postsql = "SELECT * FROM posts WHERE user_id = ?";
    const [response] = await pool.execute(postsql, [params.id]);

    if (response.length === 0) {
      throw { message: "Publicación no encontrada", status: 404 };
    }

      
      
    res.status(200).json(response);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }

};


const store = async (req, res) => { 
  // #swagger.tags = ['Posts']

  const required = ["username", "email", "password", "role"]
  
  try {
    const { body } = req
    const validate = required.filter(field => !(field in body))

    if (validate.length !== 0) { 
      throw {message: `el campo ${validate.join (',')} se requiere`, status: 400}
    }
    const sql = "INSERT INTO users (username, email, password, role) VALUES (?,?,?,?)"

    await pool.execute(sql, [body.username, body.email, body.password, body.role,])

    res.status(201).json({message: "User created successfylly"})
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

const update = async (req, res) => { 
  // #swagger.tags = ['Posts']
  
  try {
    const { body, headers, params } = req
    
      if (!headers.user_id) {
      throw { message: "user_id en los encabezados es necesario", status: 400 };
    }


    if (!params.id || !body.role) {
       throw { message: "user_id y role son necesarios", status: 400 };
    }
     await validateRole(headers.user_id, params.id)

    const sql = "UPDATE users SET role = ? WHERE user_id = ?"

    await pool.execute(sql, [body.role ,params.id])
    res.status(201).json({ message: " Role updated successfully" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }

}

const destroy = async (req, res) => {
  // #swagger.tags = ['Posts']
 try {
    const { params, headers } = req;

   await validateRole(headers.user_id, params.id)
   
    const sql = "DELETE FROM  users WHERE user_id = ? ";

    await pool.execute(sql, [ params.id]);

    res.status(201).json({ message: " User deleted successfully" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

export { index, show, store, update, destroy };