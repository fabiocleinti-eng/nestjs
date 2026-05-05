# AI Agent Instructions for Contato NestJS API

## Project Overview
This is a **NestJS TypeScript REST API** for a **Contact Agenda Management System** with user authentication, role-based authorization, and full CRUD operations for contacts. The project implements security best practices with JWT authentication and validates all user inputs.

## Architecture & Core Patterns

### Module Organization
The project follows NestJS modular architecture with clear separation of concerns:

- **UsersModule** (`src/users/`): Authentication, user management, JWT strategy
- **ContatosModule** (`src/contatos/`): Contact CRUD operations with user isolation
- **AppModule** (`src/app.module.ts`): Root module orchestrating all features

### Authentication Flow
1. User signs up via `POST /auth/signup` (CreateUserDto validates name, email, password)
2. System hashes password with bcrypt and checks email uniqueness
3. User logs in via `POST /auth/login` (LoginDto validates email/password)
4. System returns JWT token with payload: `{sub: userId, email, role}`
5. Clients include token in Authorization header: `Bearer <token>`
6. JwtStrategy validates token and populates `req.user` with decoded payload

### Contact Isolation Pattern
- Each contact belongs to a user (userId foreign key)
- All contact operations require `JwtAuthGuard` - authenticated users only
- Service methods receive `userId` from request context
- Users can only access/modify their own contacts
- Business rule enforced: at least one contact method (phone OR email) required

### Role-Based Authorization
- `UserRole.ADMIN`: Can view all users via `GET /users`
- `UserRole.USER`: Default role, can only manage own contacts
- `@Roles(UserRole.ADMIN)` decorator marks admin-only endpoints
- Future: RolesGuard can be applied to restrict other endpoints

## Data Models & Validation

### User Entity
```typescript
- id: number (auto-generated)
- name: string (required)
- email: string (required, must be unique)
- password: string (hashed with bcrypt, min 6 chars)
- role: UserRole (ADMIN | USER, default: USER)
- createdAt, updatedAt: Date
```

### Contato Entity
```typescript
- id: number (auto-generated)
- userId: number (foreign key to User)
- name: string (required)
- phoneNumber: string (optional)
- email: string (optional, must be valid if provided)
- createdAt, updatedAt: Date
```

**Validation Rule**: At least ONE of (phoneNumber, email) must be provided - enforced in service.create() and service.update()

## Development Workflow

### Installation & Setup
```bash
npm install
npm run start:dev  # Starts development server with watch mode on port 3000
```

### Building & Production
```bash
npm run build      # Compiles TypeScript to dist/
npm run start:prod # Runs compiled app (dist/main.js)
```

### Quality & Testing
```bash
npm run lint       # ESLint with auto-fix
npm run format     # Prettier formatting
npm run test       # Unit tests (Jest)
npm run test:watch # Watch mode for tests
npm run test:cov   # Coverage report
npm run test:e2e   # E2E tests with supertest
```

## API Endpoints Reference

### Authentication (Public)
- `POST /auth/signup` - Create user account
- `POST /auth/login` - Obtain JWT token

### User Management (Protected)
- `GET /users` - List all users (admin only)

### Contact Management (Protected)
- `POST /contatos` - Create contact
- `GET /contatos` - List user's contacts
- `GET /contatos/:id` - Get specific contact
- `PATCH /contatos/:id` - Update contact
- `DELETE /contatos/:id` - Delete contact

All `/contatos` endpoints require valid JWT bearer token.

## Critical Implementation Details

### JWT Configuration
- **Secret Key**: Currently hardcoded as `'your-secret-key'` in [src/users/users.module.ts](src/users/users.module.ts)
- **Expiration**: 24 hours (`expiresIn: '24h'`)
- **Production TODO**: Move secret to environment variable `JWT_SECRET`

### In-Memory Storage
- All data stored in service-level arrays (users[], contatos[])
- IDs auto-increment with counters (userIdCounter, contatoIdCounter)
- **Production TODO**: Replace with database (TypeORM/Prisma) and implement proper persistence

### Password Security
- Passwords hashed with bcrypt (10 salt rounds) via `UsersService.create()`
- Never returned in responses (destructured with rest operator)
- Validated on login via `UsersService.validatePassword()`

### Error Handling
- `ConflictException`: Email already exists
- `UnauthorizedException`: Invalid login credentials
- `NotFoundException`: Contact/User not found
- `BadRequestException`: Missing required contact method
- `ForbiddenException`: Unauthorized role access

## Project-Specific Conventions

### DTOs & Validation
- All DTOs in dedicated `dto/` folders per module
- Use `class-validator` decorators (`@IsEmail`, `@IsNotEmpty`, `@MinLength`, etc.)
- DTOs handle input validation before reaching service logic
- Response DTOs exclude sensitive fields (passwords)

### File Structure Pattern
```
module-name/
├── entities/          # Domain models
├── dto/               # Data transfer objects
├── guards/            # Authorization guards
├── strategies/        # Passport strategies
├── decorators/        # Custom decorators
├── module.service.ts  # Business logic
├── module.controller.ts  # HTTP handlers
└── module.module.ts   # Module configuration
```

### Request Context Pattern
- Controllers inject userId from JWT payload: `@Request() req` → `req.user.userId`
- Services receive userId as parameter to enforce data isolation
- No global context sharing - explicit parameter passing

## Important Notes for AI Agents

### Testing Current State
```bash
# Signup
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Protected endpoint (include returned token)
curl -X GET http://localhost:3000/contatos \
  -H "Authorization: Bearer <token_from_login>"
```

### Future Enhancements
- [ ] Database integration (TypeORM with PostgreSQL or Prisma)
- [ ] Refresh token mechanism
- [ ] Email verification on signup
- [ ] Rate limiting
- [ ] Contact categories/tags
- [ ] Contact sharing between users
- [ ] Audit logging for admin operations
- [ ] API documentation (Swagger/OpenAPI)

### Known Limitations
- Single-server deployment (no clustering)
- Data lost on server restart (in-memory storage)
- No concurrent request handling optimizations
- JWT secret hardcoded (security risk in production)
- No input sanitization beyond validation

## Dependencies Notes
- **@nestjs/jwt**: JWT signing/verification
- **@nestjs/passport**: Authentication framework integration
- **passport-jwt**: JWT extraction and validation strategy
- **bcrypt**: Password hashing (10 rounds)
- **class-validator/class-transformer**: DTO validation and serialization
