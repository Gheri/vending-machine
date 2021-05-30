import { addNewOrder, cancelOrder, confirmOrder, getOrders, getOrderWithId, updateOrder } from "../controllers/orderController.js";

const routes = (app) => {
    app.route('/orders')
        .get(getOrders)
        .post(addNewOrder);

    app.route('/orders/:orderId')
        .get(getOrderWithId)
        .patch(updateOrder)
    
    app.route('/orders/:orderId/cancel')
         .post(cancelOrder)
    
    app.route('/orders/:orderId/confirm')
         .post(confirmOrder)
}

export default routes;