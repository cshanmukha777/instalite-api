# Development notes

- Keep request/response handling in controllers and all Prisma calls in service modules.
- Whitelist accepted fields instead of passing `req.body` into Prisma.
- Add regression tests for status codes, empty delete bodies, missing records, uniqueness conflicts, and ignored fields when extending the API.
- Do not commit local environment files or database credentials.
