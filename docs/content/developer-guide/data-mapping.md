# Data Mapping

While mapping <span style="font-family:Courier New;">CSV</span> payloads is straightforward, bi(OS) simplifies mapping a <span style="font-family:Courier New;">JSON</span> payload (especially with nested
objects / arrays) using an <span style="font-family:Courier New;">Attribute Search Path</span> parameter.  Defining an <span style="font-family:Courier New;">Attribute Search Path</span> tells bi(OS)
how to look for and process attributes within a JSON payload.  Here are some examples.

Leave the <span style="font-family:Courier New;">search path</span> unset for a flat <span style="font-family:Courier New;">JSON</span> payload -
```json
search path: ""
{
  "id": 101,           # mapped to -> id
  "amount": 20.5,      # mapped to -> amount
}
```
Leave the <span style="font-family:Courier New;">search path</span> unset and specify complete nested paths for attributes in a nested object. Such flattening
works for arbitrary levels of nesting[^41]  -
```json
search path: ""
{
  "id": 101,           # mapped to -> id
  "amount": 20.5,      # mapped to -> amount
  "item": {
      "id" : 200,      # mapped to -> itemId
      "type": "shirt", # mapped to -> itemType
      "quantity": 1,   # mapped to -> itemQuantity
  }
}
```
Another way to specify attributes in a nested object is to set <span style="font-family:Courier New;">search path</span> at the nested object and specify attributes directly. Attributes outside of the <span style="font-family:Courier New;">search path</span> can be specified by using absolute path using with "/"
```json
search path: "item"
{
  "id": 101,           # mapped to -> /id
  "amount": 20.5,      # not required
  "item": {
      "id" : 200,      # mapped to -> id
      "type": "shirt", # mapped to -> type
      "quantity": 1,   # mapped to -> quantity
  }
}
```
If there are nested objects with a scalar array, the entries in the array will be stringified. In the example below, the mapping for “subCategories” will stringify the array and produce a single string - "<span style="font-family:Courier New;">['Kitchen', 'School Supplies', 'Books', 'Footwear']</span>" -
```json
search path: ""
{
  "categoryId": 101,     # mapped to -> categoryId
  "name": "Home",        # mapped to -> name
  "subCategories": [     # mapped to -> subCategories
  	"Kitchen",
  	"School Supplies",
  	"Books",
  	"Footwear"
  ]
}
```
Use an asterisk in the <span style="font-family:Courier New;">search path</span> to pick up items in an array. The data mapping of the following example will produce two rows,
one for each entry in the <span style="font-family:Courier New;">items</span> array and each having the same value of parent level attribute id.
```json
search path: "items/*"
{
  "id": 101,           # mapped to -> /id
  "amount": 20.5,
  "items": [
    {                  # ROW 1
      "id": 200,       # mapped to -> id
      "type": "shirt", # mapped to -> type
      "quantity": 1    # mapped to -> quantity
    },
    {                  # ROW 1
      "id": 300,       # mapped to -> id
      "type": "cap",   # mapped to -> type
      "quantity": 1    # mapped to -> quantity
    }
  ]
}
```
If there are multiple arrays in a source data record, each array should be ingested into a separate <span style="font-family:Courier New;">signal</span> or <span style="font-family:Courier New;">context</span>.

Following is an example of an order record by a customer that includes ordered items and discounts applied in a record:
```json
{
  "order_id": 1234,
  "created_at": "2022-10-07 00:00:00",
  "customer_id": 100,
  "total_amount": 10.99,
  "items": [
    {
      "id": 500,
      "product_id": "5008798",
      "price": 5.99,
      "quantity": 1,
      "discounts_applied": [
        {
          "item_id": 500,
          "type": "coupon",
          "amount": 1
        },
        {
          "item_id": 500,
          "type": "festival_sale",
          "amount": 1
        }
      ]
    },
    {
      "id": 501,
      "product_id": "5008799",
      "price": "8",
      "quantity": "1",
      "discounts_applied": [
        {
          "item_id": 501,
          "type": "festival_sale",
          "amount": 1
        }
      ]
    }
  ]
}
```
The above example has three entities -
* <span style="font-family:Courier New;">orders</span>
* <span style="font-family:Courier New;">orderItems</span>
* <span style="font-family:Courier New;">orderItemDiscounts</span>

The data mapping for <span style="font-family:Courier New;">orders</span> would look like below  and would result in a single row in <span style="font-family:Courier New;">orderSignal</span>.
```json
search path: ""
{
    "order_id": 1234,       # mapped to -> orderId
    "customer_id": 100,     # mapped to -> customerId
    "total_amount": 10.99   # mapped to -> totalAmount
    "created_at": "2022-10-07 00:00:00", # mapped to -> createdAt

    ... NESTED ARRAYS ARE NOT VISIBLE WITH THIS SEARCH PATH ...
}
```
The data mapping for <span style="font-family:Courier New;">orderItems</span> would look like below.  The <span style="font-family:Courier New;">orderItems signal</span> would contain two rows, and both would
have the same values for parent attributes such as <span style="font-family:Courier New;">order_id, created_at, customer_id, and total_amount</span>.
```json
search path: "items/*"
{
  "order_id": 1234,    # mapped to -> /orderId
  "created_at": "2022-10-07 00:00:00", # mapped to -> /createdAt
  "customer_id": 100,     # mapped to -> /customerId
  "total_amount": 10.99,  # mapped to -> /totalAmount
  "items": [
    {
      "id": 500,          # mapped to -> itemsId
      "product_id": "5008798", # mapped to -> itemsProductId
      "price": 5.99,      # mapped to -> itemsPrice
      "quantity": 1,      # mapped to -> itemsPrice

      ... DISCOUNTS APPLIED ARE NOT VISIBLE WITH THIS SEARCH PATH ...
    },
    {
      "id": 501,          # mapped to -> itemsId
      "product_id": "5008799", # mapped to -> itemsProductId
      "price": "8",       # mapped to -> itemsPrice
      "quantity": "1",     # mapped to -> itemsPrice

      ... DISCOUNTS APPLIED ARE NOT VISIBLE WITH THIS SEARCH PATH ...
    }
  ]
}
```
The data mapping for <span style="font-family:Courier New;">discountsApplied</span> would look like below.  The <span style="font-family:Courier New;">discountsApplied signal</span> would contain three rows
for the two order items connected by <span style="font-family:Courier New;">orderId</span> and <span style="font-family:Courier New;">itemId</span>.
```json
search path: "items/*/discounts_applied/*"

{
  "order_id": 1234,
  "created_at": "2022-10-07 00:00:00",
  "customer_id": 100,
  "total_amount": 10.99,
  "items": [
      ... ITEM DATA IS NOT VISIBLE WITH THIS SEARCH PATH ...
      "discounts_applied": [
        {
          "item_id": 500,
          "type": "coupon",
          "amount": 1
        },
        {
          "item_id": 500,
          "type": "festival_sale",
          "amount": 1
        }
      ]
    },
    {
      ... ITEM DATA IS NOT VISIBLE WITH THIS SEARCH PATH ...
      "discounts_applied": [
        {
          "item_id": 501,
          "type": "festival_sale",
          "amount": 1
        }
      ]
    }
  ]
}
```

[^41]: Validated till three levels. <br/>
