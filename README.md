
# Products SKU and Stocking

This backend application is created to allow the management of product stock. We store products and all the transactions, differentiating if they are from selling or re-stocking.

Next, yo uare going to see how you can execute all the requests:




## API Reference

#### Record a selling transaction

```http
  POST /sell
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `cost_per_unit` | `float` | **Required**. in how much money each element was sold |
| `sku` | `string` | **Required**. ID of the product to sell|
| `amount` | `integer` | **Required**. how many products were sold |

#### Record a stocking transaction

```http
  POST /receive
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `cost_per_unit` | `float` | **Required**. in how much money each element was bought |
| `sku` | `string` | **Required**. ID of the product to stock|
| `amount` | `integer` | **Required**. how many products were received |

#### Get a report of all the specified data

```http
  GET /report
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `sku` | `string` | **Required**. ID of the product to get the report|

---

#### In order to execute those requests, you need to specify the parameters as a JSON form in the body of the request. For example:


```
{
    "cost_per_unit": 2.50,
    "sku": "CORNFLAKES",
    "amount": 2
}
```

Is gonna be the body of the POST request of the hostname `http://localhost:3001/sell`

This was tested in **Postman**.
## Authors

- [@pedroaro](https://www.github.com/pedroaro)

