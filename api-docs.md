# Product API Documentation

**Base URL:** `http://example.com/api/v1/`
**Content-Type:** `application/json` — except image uploads, use `multipart/form-data`

---

## Response Envelope

```json
{
  "success": true,
  "message": "Request successful",
  "data": {},
  "errors": null,
  "meta": { "timestamp": "2024-01-01T00:00:00Z" }
}
```

---

## Brands

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/brands/` | List all brands |
| POST | `/brands/` | Create a brand |
| GET | `/brands/<slug>/` | Get a brand |
| PUT | `/brands/<slug>/` | Update a brand |
| DELETE | `/brands/<slug>/` | Delete a brand |
| GET | `/brands/<slug>/products/` | List products under a brand |

**POST /brands/ — Payload** `multipart/form-data`
```
name        string   required
icon        file     optional
```

**GET /brands/ — Response**
```json
[
  {
    "id": "uuid",
    "name": "Pran",
    "slug": "pran",
    "icon": "http://example.com/media/brands/icons/pran.png"
  }
]
```

---

## Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories/` | List all categories |
| POST | `/categories/` | Create a category |
| GET | `/categories/<slug>/` | Get a category |
| PUT | `/categories/<slug>/` | Update a category |
| DELETE | `/categories/<slug>/` | Delete a category |

**POST /categories/ — Payload** `multipart/form-data`
```
name        string   required
icon        file     optional
```

**GET /categories/ — Response**
```json
[
  {
    "id": "uuid",
    "name": "Rice & Grains",
    "slug": "rice-grains",
    "icon": "http://example.com/media/categories/icons/rice.png"
  }
]
```

---

## Tags

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tags/` | List all tags |
| POST | `/tags/` | Create a tag |
| GET | `/tags/<uuid>/` | Get a tag |
| PUT | `/tags/<uuid>/` | Update a tag |
| DELETE | `/tags/<uuid>/` | Delete a tag |

**POST /tags/ — Payload** `application/json`
```json
{ "name": "Organic" }
```

**GET /tags/ — Response**
```json
[
  { "id": "uuid", "name": "Organic" }
]
```

---

## Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products/` | List all products |
| POST | `/products/` | Create a product |
| GET | `/products/<slug>/` | Get a product |
| PUT | `/products/<slug>/` | Update a product |
| DELETE | `/products/<slug>/` | Delete a product |

**GET /products/ — Query Params**
```
brand         slug     Filter by brand slug
category      slug     Filter by category slug
search        string   Search in name and description
in_stock      boolean  true or false
sort          string   price_low | price_high | best_sell | top_review
```

**POST /products/ — Payload** `multipart/form-data`
```
name                    string     required
price                   decimal    required
brand                   uuid       optional
category                uuid       optional
tag_ids                 uuid[]     optional  (repeat field or JSON string)
images                  file[]     optional  (repeat field for multiple)
description             html       optional
sku                     string     optional
discount_amount         decimal    optional  default 0
unit                    string     optional  e.g. per kg, per liter
in_stock                boolean    optional  default true
key_detail_title        string     optional
key_detail_description  string     optional
is_hot_deal             boolean    optional  default false
hot_deal_start          datetime   optional
hot_deal_end            datetime   optional
```

> `discounted_price` is auto-calculated as `price - discount_amount`. `discount_amount` cannot exceed `price`.

**GET /products/ — Response**
```json
[
  {
    "id": "uuid",
    "name": "Fresh Basmati Rice",
    "slug": "fresh-basmati-rice",
    "price": "120.00",
    "discount_amount": "20.00",
    "discounted_price": "100.00",
    "unit": "per kg",
    "first_image": "http://example.com/media/products/images/rice.jpg",
    "in_stock": true,
    "is_hot_deal": false,
    "brand_name": "Pran",
    "brand_slug": "pran",
    "category_name": "Rice & Grains",
    "category_slug": "rice-grains",
    "total_sold": 100,
    "avg_rating": "4.5"
  }
]
```

**GET /products/<slug>/ — Response**
```json
{
  "id": "uuid",
  "name": "Fresh Basmati Rice",
  "slug": "fresh-basmati-rice",
  "description": "<p>Rich aroma...</p>",
  "sku": "RICE-001",
  "price": "120.00",
  "discount_amount": "20.00",
  "discounted_price": "100.00",
  "unit": "per kg",
  "in_stock": true,
  "key_detail_title": "Why choose this?",
  "key_detail_description": "Aged for 2 years.",
  "is_hot_deal": false,
  "hot_deal_start": null,
  "hot_deal_end": null,
  "total_sold": 100,
  "avg_rating": "4.5",
  "brand": { "id": "uuid", "name": "Pran", "slug": "pran", "icon": "..." },
  "category": { "id": "uuid", "name": "Rice & Grains", "slug": "rice-grains", "icon": "..." },
  "tags": [{ "id": "uuid", "name": "Organic" }],
  "images": [
    { "id": "uuid", "image": "http://example.com/media/products/images/rice.jpg", "is_primary": true }
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

## Product Images

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products/<slug>/images/` | Upload images to a product |
| DELETE | `/products/<slug>/images/` | Delete an image |
| POST | `/products/<slug>/images/<image_id>/set-primary/` | Set an image as primary |

**POST /products/<slug>/images/ — Payload** `multipart/form-data`
```
images        file[]   required  (repeat field for multiple)
is_primary    boolean  optional  clears existing primary and marks first upload as primary
```

**DELETE /products/<slug>/images/ — Payload** `application/json`
```json
{ "image_id": "uuid" }
```

**POST /products/<slug>/images/<image_id>/set-primary/ — No payload required**

**Response**
```json
[
  { "id": "uuid", "image": "http://example.com/media/products/images/rice.jpg", "is_primary": true }
]
```

---

## Hot Deals

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/hot-deals/` | List active hot deal products |

Returns products where `is_hot_deal=true`. If `hot_deal_start`/`hot_deal_end` are set, only returns products within that window. Supports same query params as `GET /products/`.

---

## Error Response

```json
{
  "success": false,
  "message": "Something went wrong",
  "data": null,
  "errors": {
    "price": ["This field is required."],
    "discount_amount": ["Discount amount cannot be greater than price."]
  },
  "meta": { "timestamp": "2024-01-01T00:00:00Z" }
}
```

**Common status codes:** `200 OK` · `400 Bad Request` · `404 Not Found`
