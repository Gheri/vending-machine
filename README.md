Prereq To run the project
1. NodeJs
2. VSCode or any Code editor or terminal
3. Mongo running on localhost (mongodb://localhost:27017/vending)

Steps to Run the Project
1. Open folder in VS Code
2. npm install
3. node ./index.js


Summary:
1. Created two collections in mongodb products & orders to track products and orders.
2. Order document has products array as well to track the products for that order.
3. Whenever user create order, order is created with status as InProgress and empty array of products.
5. When user cancels, response would returned with balance same as initial credit money and order status is Cancelled.
6. When user add product to order, balance is reduced and product is being added to order document.
7. When user confirm the order, the order status is changed to Confirmed and product quantity is deducted from products documents.

Improvements:
1. Only USD is supported as of now. Would need to support other currencies.
2. Need to create Product Service which would be used by both product Conrtoller and order controller.
3. Failure Mode need to be handled while confirming the order.
4. Confirm Order is api needs to be performant as its doing single updated to products for quantity reduction.

Scenario Tested  with minimal data
On local box its running on PORT: 4000 so can be accessed on http://localhost:4000
Create Product using 
POST /v1/products
Sample Request Body:
{
        "name": "X Company Chocolate",
        "description": "Sugar Free X Choclate",
        "priceInUSD": 50,
        "company": "X",
        "sellerId": "1010",
        "quantity": 50
}
Sample Response Body:
{
    "_id": "60b3c8b4ac1f3cb2eab721aa",
    "name": "X Company Chocolate",
    "description": "Sugar Free X Choclate",
    "priceInUSD": 50,
    "company": "X",
    "sellerId": "1010",
    "quantity": 50,
    "createdAt": "2021-05-30T17:17:40.402Z",
    "createdBy": "Admin",
    "modifiedBy": "Admin",
    "modifiedAt": "2021-05-30T17:17:40.405Z",
    "__v": 0
}

Create Another product
POST v1/products
Sample Request Body:
{
        "name": "Y Company Juice",
        "description": "Coconut Y Juice",
        "priceInUSD": 30,
        "company": "Y",
        "sellerId": "1010",
        "quantity": 30
}
Sample Response Body:
{
    "_id": "60b3c8f0ac1f3cb2eab721ab",
    "name": "Y Company Juice",
    "description": "Coconut Y Juice",
    "priceInUSD": 30,
    "company": "Y",
    "sellerId": "1010",
    "quantity": 30,
    "createdAt": "2021-05-30T17:18:40.175Z",
    "createdBy": "Admin",
    "modifiedBy": "Admin",
    "modifiedAt": "2021-05-30T17:18:40.175Z",
    "__v": 0
}

List all products
GET /v1/products
Sample Response Body:
[
    {
        "_id": "60b3c8b4ac1f3cb2eab721aa",
        "name": "X Company Chocolate",
        "description": "Sugar Free X Choclate",
        "priceInUSD": 50,
        "company": "X",
        "sellerId": "1010",
        "quantity": 50,
        "createdAt": "2021-05-30T17:17:40.402Z",
        "createdBy": "Admin",
        "modifiedBy": "Admin",
        "modifiedAt": "2021-05-30T17:17:40.405Z"
    },
    {
        "_id": "60b3c8f0ac1f3cb2eab721ab",
        "name": "Y Company Juice",
        "description": "Coconut Y Juice",
        "priceInUSD": 30,
        "company": "Y",
        "sellerId": "1010",
        "quantity": 30,
        "createdAt": "2021-05-30T17:18:40.175Z",
        "createdBy": "Admin",
        "modifiedBy": "Admin",
        "modifiedAt": "2021-05-30T17:18:40.175Z"
    }
]

Create Order
POST v1/orders
Sample Request Body:
{
    "initialCredit": 100,
    "initialCreditCurrencyType": "USD"
}

Sample Response Body:
{
    "description": "",
    "status": "InProgress",
    "products": [],
    "_id": "60b3c946ac1f3cb2eab721ac",
    "initialCredit": 100,
    "initialCreditCurrencyType": "USD",
    "balance": 100,
    "createdAt": "2021-05-30T17:20:06.088Z",
    "createdBy": "Admin",
    "modifiedBy": "Admin",
    "modifiedAt": "2021-05-30T17:20:06.089Z",
    "__v": 0
}

Add product to order
PATCH v1/orders/60b3c946ac1f3cb2eab721ac
Sample Request Body:

    "product": "60b3c8b4ac1f3cb2eab721aa"
}

Sample Response
{
    "description": "",
    "status": "InProgress",
    "products": [
        {
            "productId": "60b3c8b4ac1f3cb2eab721aa",
            "name": "X Company Chocolate"
        }
    ],
    "_id": "60b3c946ac1f3cb2eab721ac",
    "initialCredit": 100,
    "initialCreditCurrencyType": "USD",
    "balance": 50,
    "createdAt": "2021-05-30T17:20:06.088Z",
    "createdBy": "Admin",
    "modifiedBy": "Admin",
    "modifiedAt": "2021-05-30T17:21:04.854Z",
    "__v": 0
}

Add one more product
PATCH v1/orders/60b3c946ac1f3cb2eab721ac
Sample Request Body:
{
    "product": "60b3c8f0ac1f3cb2eab721ab"
}

Sample Response Body:
{
    "description": "",
    "status": "InProgress",
    "products": [
        {
            "productId": "60b3c8b4ac1f3cb2eab721aa",
            "name": "X Company Chocolate"
        },
        {
            "productId": "60b3c8f0ac1f3cb2eab721ab",
            "name": "Y Company Juice"
        }
    ],
    "_id": "60b3c946ac1f3cb2eab721ac",
    "initialCredit": 100,
    "initialCreditCurrencyType": "USD",
    "balance": 20,
    "createdAt": "2021-05-30T17:20:06.088Z",
    "createdBy": "Admin",
    "modifiedBy": "Admin",
    "modifiedAt": "2021-05-30T17:21:55.113Z",
    "__v": 0
}

Confirm Order
POST v1/orders/60b3c946ac1f3cb2eab721ac/confirm

Sample Response Body:
{
    "description": "",
    "status": "Confirmed",
    "products": [
        {
            "productId": "60b3c8b4ac1f3cb2eab721aa",
            "name": "X Company Chocolate"
        },
        {
            "productId": "60b3c8f0ac1f3cb2eab721ab",
            "name": "Y Company Juice"
        }
    ],
    "_id": "60b3cb3e2a7a1ab351c965a6",
    "initialCredit": 100,
    "initialCreditCurrencyType": "USD",
    "balance": 20,
    "createdAt": "2021-05-30T17:28:30.193Z",
    "createdBy": "Admin",
    "modifiedBy": "Admin",
    "modifiedAt": "2021-05-30T17:29:19.525Z",
    "__v": 0
}

