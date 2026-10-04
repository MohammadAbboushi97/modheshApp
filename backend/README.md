# offers (NestJS)

Port of the Spring Boot `offers` service to NestJS 11 + TypeORM 0.3 + better-sqlite3.

## Run

```bash
npm install
npm run start:dev
```

Server listens on `PORT` (default `8080`).

## HTTP endpoints (parity with the Spring Boot service)

| Method | Path                        | Description                          |
| ------ | --------------------------- | ------------------------------------ |
| POST   | `/api/v1/store/create`      | Create a store                       |
| POST   | `/api/v1/offers/create`     | Create an offer                      |
| GET    | `/api/v1/offers/getAll`     | List all offers                      |
| GET    | `/api/images/homeImage`     | Stream `app-logo.png`                |
| GET    | `/api/images/all`           | Metadata for `app-logo{,1}.png`      |
| GET    | `/api/images/mobile`        | All PNGs as base64 data-URIs         |

## Notes on the port

- H2 (Java, embedded) is replaced with **better-sqlite3** (embedded, file-based). Schema is auto-synced via `synchronize: true`. Switch to migrations for production.
- MapStruct-generated mappers are replaced with hand-written `@Injectable()` mappers.
- Spring `@RestController` / `@RequestMapping` → Nest `@Controller` / `@Get` / `@Post`.
- Spring `@Autowired` constructor DI → Nest constructor DI.
- `application.properties` → `.env` (loaded by `@nestjs/config`).
- Static images live under `static/images/` (configurable via `IMAGE_STORAGE_PATH`).
