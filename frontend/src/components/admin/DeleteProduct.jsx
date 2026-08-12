import { useState } from "react";
// import axios from "axios";

const DeleteProduct = () => {
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      await axios.delete(`http://localhost:3000/products/${id}`);

      setMessage("Product deleted successfully!");
      setId("");
    } catch (error) {
      console.error(error);
      setError("Failed to delete product");
    }
  };

  return (
    <section className="max-w-2xl">
      <h2 className="mb-6 text-3xl font-bold">Delete Product</h2>

      <div className="rounded-xl bg-white p-6 shadow">
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
          Deleting a product is permanent. Make sure the product ID is correct.
        </div>

        <form onSubmit={handleDelete} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">Product ID</label>

            <input
              type="number"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter product ID"
              required
              className="w-full rounded-lg border p-3"
            />
          </div>

          {message && <p className="text-green-600">{message}</p>}

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            className="rounded-lg bg-red-600 px-6 py-3 text-white hover:bg-red-700"
          >
            Delete Product
          </button>
        </form>
      </div>
    </section>
  );
};

export default DeleteProduct;
