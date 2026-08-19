"use strict";
// OpenAPI 3 spec dibangun programatik.
// ponytail: paths CRUD di-generate lewat helper (DRY). Kalau butuh dokumentasi
//           request-body per-field yang detail, isi `schemas` di components.
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const idParam = {
    name: "id",
    in: "path",
    required: true,
    schema: { type: "string" },
};
const listQuery = [
    { name: "page", in: "query", schema: { type: "integer", default: 1 } },
    { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
    { name: "search", in: "query", schema: { type: "string" } },
];
// generate 5 path standar CRUD untuk satu resource
function crudPaths(path, tag, schemaRef) {
    const ref = { $ref: `#/components/schemas/${schemaRef}` };
    const body = {
        required: true,
        content: { "application/json": { schema: ref } },
    };
    return {
        [`/api/${path}`]: {
            get: {
                tags: [tag],
                summary: `List ${tag}`,
                parameters: listQuery,
                responses: { "200": { description: "OK" } },
            },
            post: {
                tags: [tag],
                summary: `Create ${tag}`,
                security: [{ bearerAuth: [] }],
                requestBody: body,
                responses: { "201": { description: "Created" }, "400": { description: "Bad request" }, "401": { description: "Unauthorized" } },
            },
        },
        [`/api/${path}/{id}`]: {
            get: {
                tags: [tag],
                summary: `Get ${tag} by id`,
                parameters: [idParam],
                responses: { "200": { description: "OK" }, "404": { description: "Not found" } },
            },
            put: {
                tags: [tag],
                summary: `Update ${tag}`,
                security: [{ bearerAuth: [] }],
                parameters: [idParam],
                requestBody: body,
                responses: { "200": { description: "Updated" }, "404": { description: "Not found" }, "401": { description: "Unauthorized" } },
            },
            delete: {
                tags: [tag],
                summary: `Delete ${tag}`,
                security: [{ bearerAuth: [] }],
                parameters: [idParam],
                responses: { "200": { description: "Deleted" }, "404": { description: "Not found" }, "401": { description: "Unauthorized" } },
            },
        },
    };
}
// schema komponen (ringkas — field utama untuk contoh request body di Swagger UI)
const schemas = {
    Category: {
        type: "object",
        required: ["name"],
        properties: {
            name: { type: "string" },
            description: { type: "string" },
            icon: { type: "string" },
        },
    },
    Location: {
        type: "object",
        required: ["name"],
        properties: {
            name: { type: "string" },
            region: { type: "number" },
            coordinates: { type: "array", items: { type: "number" }, example: [106.8, -6.2] },
            isOnline: { type: "boolean" },
        },
    },
    Event: {
        type: "object",
        required: ["name", "category", "location", "startDate", "endDate"],
        properties: {
            name: { type: "string" },
            category: { type: "string", description: "Category ObjectId" },
            location: { type: "string", description: "Location ObjectId" },
            description: { type: "string" },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            isOnline: { type: "boolean" },
            isFeatured: { type: "boolean" },
            isPublished: { type: "boolean" },
            banner: { type: "string" },
        },
    },
    Ticket: {
        type: "object",
        required: ["name", "price", "quantity", "events"],
        properties: {
            name: { type: "string" },
            price: { type: "number" },
            quantity: { type: "number" },
            events: { type: "string", description: "Event ObjectId" },
            description: { type: "string" },
        },
    },
    Order: {
        type: "object",
        required: ["ticket", "quantity"],
        description: "createdBy, events, total dihitung otomatis dari token & tiket",
        properties: {
            ticket: { type: "string", description: "Ticket ObjectId" },
            quantity: { type: "number", minimum: 1 },
        },
    },
    Banner: {
        type: "object",
        required: ["title", "image"],
        properties: {
            title: { type: "string" },
            image: { type: "string" },
            isShow: { type: "boolean" },
        },
    },
    RegisterInput: {
        type: "object",
        required: ["fullName", "userName", "email", "password", "confirmPassword"],
        properties: {
            fullName: { type: "string" },
            userName: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string" },
            confirmPassword: { type: "string" },
        },
    },
    LoginInput: {
        type: "object",
        required: ["identifier", "password"],
        properties: {
            identifier: { type: "string", description: "email atau userName" },
            password: { type: "string" },
        },
    },
};
exports.swaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "Ticketing Management API (ACARA)",
        version: "1.0.0",
        description: "Event management & ticketing backend",
    },
    servers: [{ url: "http://localhost:3000", description: "local" }],
    tags: [
        { name: "auth" },
        { name: "categories" },
        { name: "locations" },
        { name: "events" },
        { name: "tickets" },
        { name: "orders" },
        { name: "banners" },
    ],
    paths: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ "/api/auth/register": {
            post: {
                tags: ["auth"],
                summary: "Register user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/RegisterInput" },
                        },
                    },
                },
                responses: { "201": { description: "Created" }, "400": { description: "Validation failed" } },
            },
        }, "/api/auth/login": {
            post: {
                tags: ["auth"],
                summary: "Login (email/userName + password)",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": { schema: { $ref: "#/components/schemas/LoginInput" } },
                    },
                },
                responses: { "200": { description: "OK, returns token" }, "401": { description: "Invalid credentials" } },
            },
        }, "/api/auth/me": {
            get: {
                tags: ["auth"],
                summary: "Current user profile",
                security: [{ bearerAuth: [] }],
                responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" } },
            },
        } }, crudPaths("categories", "categories", "Category")), crudPaths("locations", "locations", "Location")), crudPaths("events", "events", "Event")), crudPaths("tickets", "tickets", "Ticket")), crudPaths("orders", "orders", "Order")), crudPaths("banners", "banners", "Banner")),
    components: {
        schemas,
        securitySchemes: {
            bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        },
    },
};
