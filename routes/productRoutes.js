import { addNewProduct, deleteProduct, getProducts, getProductWithId, updateProduct } from "../controllers/productController.js";

const routes = (app) => {
    app.route('/products')
        .get(getProducts)
        .post(addNewProduct);

    app.route('/products/:productId')
        .get(getProductWithId)
        .put(updateProduct)
        .delete(deleteProduct);
}

export default routes;