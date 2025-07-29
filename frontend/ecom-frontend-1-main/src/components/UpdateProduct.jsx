import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [image, setImage] = useState();
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    release_date: "",         // ← changed
    availability: false,      // ← changed
    quantity: "",             // ← changed
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/${id}`
        );

        setProduct(response.data);

        const responseImage = await axios.get(
          `http://localhost:8080/api/product/${id}/image`,
          { responseType: "blob" }
        );
        const imageFile = await converUrlToFile(responseImage.data, response.data.imageName);
        setImage(imageFile);
        setUpdateProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const converUrlToFile = async (blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = new FormData();
    updatedProduct.append("imageFile", image);
    updatedProduct.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
    );

    axios
      .put(`http://localhost:8080/api/product/${id}`, updatedProduct, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("Product updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        alert("Failed to update product. Please try again.");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({
      ...updateProduct,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="update-product-container">
      <div className="center-container">
        <h1>Update Product</h1>
        <form className="row g-3 pt-5" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label"><h6>Name</h6></label>
            <input type="text" className="form-control" placeholder={product.name} value={updateProduct.name} onChange={handleChange} name="name" />
          </div>

          <div className="col-md-6">
            <label className="form-label"><h6>Brand</h6></label>
            <input type="text" name="brand" className="form-control" placeholder={product.brand} value={updateProduct.brand} onChange={handleChange} />
          </div>

          <div className="col-12">
            <label className="form-label"><h6>Description</h6></label>
            <input type="text" className="form-control" placeholder={product.description} name="description" value={updateProduct.description} onChange={handleChange} />
          </div>

          <div className="col-5">
            <label className="form-label"><h6>Price</h6></label>
            <input type="number" className="form-control" name="price" placeholder={product.price} value={updateProduct.price} onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label className="form-label"><h6>Category</h6></label>
            <select className="form-select" value={updateProduct.category} onChange={handleChange} name="category">
              <option value="">Select category</option>
              <option value="laptop">Laptop</option>
              <option value="headphone">Headphone</option>
              <option value="mobile">Mobile</option>
              <option value="electronics">Electronics</option>
              <option value="toys">Toys</option>
              <option value="fashion">Fashion</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label"><h6>Quantity</h6></label>
            <input type="number" className="form-control" name="quantity" placeholder={product.quantity} value={updateProduct.quantity} onChange={handleChange} />
          </div>

          <div className="col-md-8">
            <label className="form-label"><h6>Image</h6></label>
            <img src={image ? URL.createObjectURL(image) : "Image unavailable"} alt={product.imageName} style={{ width: "30%", height: "50px", objectFit: "cover", padding: "5px", margin: "0" }} />
            <input className="form-control" type="file" onChange={handleImageChange} name="imageFile" />
          </div>

          <div className="col-12">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="availability" id="gridCheck" checked={updateProduct.availability} onChange={(e) => setUpdateProduct({ ...updateProduct, availability: e.target.checked })} />
              <label className="form-check-label">Product Available</label>
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label"><h6>Release Date</h6></label>
            <input type="date" className="form-control" name="release_date" value={updateProduct.release_date ? updateProduct.release_date.split('T')[0] : ''} onChange={handleChange} />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
