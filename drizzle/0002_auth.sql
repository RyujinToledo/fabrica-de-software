-- Migration 0002: tabelas do Better Auth (TASK-005, ADR-005).
-- Esquema extraido de `getAuthTables` com as opcoes exatas da fabrica
-- (email+senha, 2FA, admin). Revisado a mao; o teste integrado prova o uso.
-- Nomes e colunas seguem o padrao do adapter drizzle do Better Auth.

CREATE TABLE "user" (
	id text PRIMARY KEY,
	name text NOT NULL,
	email text NOT NULL UNIQUE,
	"emailVerified" boolean NOT NULL DEFAULT false,
	image text,
	"createdAt" timestamptz NOT NULL DEFAULT now(),
	"updatedAt" timestamptz NOT NULL DEFAULT now(),
	"twoFactorEnabled" boolean DEFAULT false,
	role text,
	banned boolean DEFAULT false,
	"banReason" text,
	"banExpires" timestamptz
);

CREATE TABLE session (
	id text PRIMARY KEY,
	"expiresAt" timestamptz NOT NULL,
	token text NOT NULL UNIQUE,
	"createdAt" timestamptz NOT NULL DEFAULT now(),
	"updatedAt" timestamptz NOT NULL DEFAULT now(),
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
	"impersonatedBy" text
);
CREATE INDEX idx_session_user ON session ("userId");

CREATE TABLE account (
	id text PRIMARY KEY,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamptz,
	"refreshTokenExpiresAt" timestamptz,
	scope text,
	password text,
	"createdAt" timestamptz NOT NULL DEFAULT now(),
	"updatedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_account_user ON account ("userId");

CREATE TABLE verification (
	id text PRIMARY KEY,
	identifier text NOT NULL,
	value text NOT NULL,
	"expiresAt" timestamptz NOT NULL,
	"createdAt" timestamptz NOT NULL DEFAULT now(),
	"updatedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_verification_identifier ON verification (identifier);

CREATE TABLE "twoFactor" (
	id text PRIMARY KEY,
	secret text NOT NULL,
	"backupCodes" text NOT NULL,
	"userId" text NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
	verified boolean DEFAULT true,
	"failedVerificationCount" integer DEFAULT 0,
	"lockedUntil" timestamptz
);
CREATE INDEX idx_two_factor_user ON "twoFactor" ("userId");
