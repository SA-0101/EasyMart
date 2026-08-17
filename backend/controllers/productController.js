const pool = require("./../db/db");

const getProductById = async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    err = {
      status: 400,
      message: "provide product id",
    };
    return next(err);
  }
  const result = await pool.query("SELECT * FROM products WHERE id=$1", [id]);
  if (result.rows.length == 0) {
    err = {
      status: 404,
      message: "details not found",
    };
    return next(err);
  }
  res.status(200).json(result.rows[0]);
};

const getProductsByName = async (req, res, next) => {
  try {
    const name = req.query.name;
    if (!name) {
      err = {
        status: 400,
        message: "provide product name",
      };
      return next(err);
    }
    const searchTerm = `%${name}%`;
    console.log("name of query parameter is ", name);
    const result = await pool.query(
      "SELECT * FROM products WHERE name LIKE $1",
      [searchTerm],
    );
    if (result.rows.length == 0) {
      err = {
        status: 404,
        message: "no products found",
      };
      return next(err);
    }
    res.json(result.rows);
  } catch (err) {
    return next(err);
  }
};
module.exports = { getProductById, getProductsByName };
