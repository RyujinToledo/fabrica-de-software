/**
 * Gate da baseline de gitleaks da fabrica (RF-030).
 *
 * Modo padrao, sem argumentos: valida a baseline do proprio repositorio da fabrica.
 * Modo --projeto <diretorio>: valida que um projeto gerado herdou a baseline intacta.
 *
 * Toda regra customizada da baseline ganha um fixture que DEVE ser detectado e a
 * baseline roda contra um fixture limpo que NAO pode gerar achado. As amostras sao
 * montadas em tempo de execucao a partir de pedacos: o padrao literal escrito direto
 * no codigo faria o proprio gitleaks barrar este arquivo no pre-commit.
 */

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
	existsSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const RAIZ_FABRICA = resolve(import.meta.dirname, "..");
const BASELINE = join(RAIZ_FABRICA, ".gitleaks.toml");

interface RegraComFixture {
	id: string;
	amostras: string[];
}

const REGRAS: RegraComFixture[] = [
	{
		id: "senha-em-comando-sudo",
		amostras: [
			[
				"echo",
				"s3nh4-de-teste",
				"|",
				"sudo",
				"apt",
				"install",
				"ferramenta",
			].join(" "),
		],
	},
	{
		id: "senha-em-comando-curl",
		amostras: [
			[
				"curl",
				"-u",
				"admin:s3nh4-f0rt3-1234",
				"https://api.exemplo.com/v1",
			].join(" "),
		],
	},
	{
		id: "senha-em-comando-mysql",
		amostras: [
			["mysql", "-h", "db.exemplo.com", "-ps3nh4-f0rt3-1234", "app"].join(" "),
		],
	},
	{
		id: "senha-em-comando-psql",
		amostras: [
			[
				"PGPASSWORD",
				"=",
				"s3nh4-f0rt3-1234",
				"psql",
				"-h",
				"db.exemplo.com",
				"-U",
				"app",
			].join(" "),
			[
				"psql",
				'"host=db.exemplo.com dbname=app password=s3nh4-f0rt3-1234"',
			].join(" "),
		],
	},
	{
		id: "uri-postgresql-com-senha",
		amostras: [
			[
				"postgres://",
				"app_user:",
				"s3nh4-f0rt3-1234",
				"@db.exemplo.com:5432/app",
			].join(""),
		],
	},
	{
		id: "chave-api-openai-openrouter",
		amostras: [
			[
				"sk",
				"-",
				"proj",
				"-",
				"kQ7mN2pL5vR8tU1wS4dF6gH0jZ3cE7bA9kM4nB8xY2zW6",
			].join(""),
		],
	},
	{
		id: "segredo-better-auth",
		amostras: [
			["BETTER", "_AUTH_SECRET=", "b3t7r4uth-s3cr3t-v4l1d0-2026"].join(""),
		],
	},
	{
		id: "credencial-s3",
		amostras: [
			[
				"AWS_SECRET",
				"_ACCESS_KEY=",
				"aB3xY9/kQ7mN2pL5vR8tU1wS4dF6gH0jZ3cE7bA9",
			].join(""),
		],
	},
	{
		id: "credencial-twilio",
		amostras: [
			["AC", "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"].join(""),
			["TWILIO_AUTH", "_TOKEN=", "0f1e2d3c4b5a69788796a5b4c3d2e1f0"].join(""),
		],
	},
	{
		id: "chave-api-resend",
		amostras: [["re_", "9W8Z4KQm2Xv7Hp3Ld6Rt1Yb5Nc8Sa0Fd"].join("")],
	},
	{
		id: "jwt-assinado",
		amostras: [
			[
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
				".",
				"eyJzdWIiOiIxMjM0NTY3ODkwIn0",
				".",
				"SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
			].join(""),
		],
	},
	{
		id: "chave-privada-em-texto",
		amostras: [["-----BEGIN ", "OPENSSH", " PRIVATE KEY-----"].join("")],
	},
];

const TEXTO_LIMPO = [
	"Projeto de exemplo sem credenciais versionadas.",
	"Senha de banco e digitada em prompt interativo do sistema.",
	"Chave de API e injetada por variavel de ambiente fora do repositorio.",
	"Instalacao de ferramentas pede privilegio minimo ao usuario.",
	"",
].join("\n");

interface Vazamento {
	RuleID: string;
}

function falhar(mensagem: string): never {
	console.error(`[baseline-gitleaks] FALHOU: ${mensagem}`);
	process.exit(1);
}

function hashDoArquivo(arquivo: string): string {
	return createHash("sha256").update(readFileSync(arquivo)).digest("hex");
}

function escanear(diretorio: string): Vazamento[] {
	const pasta = mkdtempSync(join(tmpdir(), "baseline-gitleaks-"));
	const relatorio = join(pasta, "relatorio.json");

	try {
		const resultado = spawnSync(
			"gitleaks",
			[
				"detect",
				"--no-git",
				"--source",
				diretorio,
				"-c",
				BASELINE,
				"--report-format",
				"json",
				"--report-path",
				relatorio,
				"--exit-code",
				"0",
			],
			{ encoding: "utf8" },
		);

		if (resultado.error) {
			falhar(
				`gitleaks nao executou (esta no PATH?): ${resultado.error.message}`,
			);
		}

		const bruto = existsSync(relatorio)
			? readFileSync(relatorio, "utf8").trim()
			: "";
		return bruto ? (JSON.parse(bruto) as Vazamento[]) : [];
	} finally {
		rmSync(pasta, { recursive: true, force: true });
	}
}

function escanearAmostras(amostras: string[]): Vazamento[] {
	const pasta = mkdtempSync(join(tmpdir(), "baseline-gitleaks-fixture-"));

	try {
		amostras.forEach((amostra, indice) => {
			writeFileSync(join(pasta, `exemplo-${indice + 1}.txt`), `${amostra}\n`);
		});
		return escanear(pasta);
	} finally {
		rmSync(pasta, { recursive: true, force: true });
	}
}

function idsDaBaseline(texto: string): string[] {
	const ids: string[] = [];

	for (const linha of texto.split("\n")) {
		const achado = /^\s*id\s*=\s*"([^"]+)"/.exec(linha);
		if (achado) {
			ids.push(achado[1]);
		}
	}

	return ids;
}

function conferirSincronismo(texto: string, origem: string): void {
	if (!/useDefault\s*=\s*true/.test(texto)) {
		falhar(
			`${origem} nao estende as regras padrao do gitleaks (useDefault = true)`,
		);
	}

	const ids = idsDaBaseline(texto);
	const idsEsperados = REGRAS.map((regra) => regra.id);

	for (const id of idsEsperados) {
		if (!ids.includes(id)) {
			falhar(`${origem} nao declara a regra ${id}`);
		}
	}

	for (const id of ids) {
		if (!idsEsperados.includes(id)) {
			falhar(
				`a regra ${id} existe em ${origem} mas nao tem fixture no script; adicione a amostra em REGRAS`,
			);
		}
	}
}

function conferirEficacia(): void {
	for (const regra of REGRAS) {
		const achados = escanearAmostras(regra.amostras);
		const detectou = achados.some((achado) => achado.RuleID === regra.id);

		if (!detectou) {
			falhar(`a regra ${regra.id} nao detectou nenhuma das amostras proibidas`);
		}
	}

	const limpos = escanearAmostras([TEXTO_LIMPO]);

	if (limpos.length > 0) {
		falhar(
			`a baseline acusou texto limpo (${limpos.map((v) => v.RuleID).join(", ")})`,
		);
	}
}

function validarFabrica(): void {
	if (!existsSync(BASELINE)) {
		falhar(`baseline ausente em ${BASELINE}`);
	}

	conferirSincronismo(readFileSync(BASELINE, "utf8"), "baseline da fabrica");
	conferirEficacia();
	console.log(
		`[baseline-gitleaks] OK: baseline da fabrica valida, ${REGRAS.length} regras customizadas exercitadas.`,
	);
}

function validarProjeto(diretorio: string): void {
	const arquivo = join(resolve(diretorio), ".gitleaks.toml");

	if (!existsSync(arquivo)) {
		falhar(
			`${arquivo} nao existe; o projeto precisa herdar a baseline da fabrica`,
		);
	}

	conferirSincronismo(readFileSync(arquivo, "utf8"), arquivo);

	if (hashDoArquivo(arquivo) !== hashDoArquivo(BASELINE)) {
		falhar(
			`${arquivo} difere da baseline da fabrica; regra de projeto novo vai na baseline, nao no projeto`,
		);
	}

	console.log(
		`[baseline-gitleaks] OK: ${diretorio} usa a baseline intacta da fabrica.`,
	);
}

const indiceProjeto = process.argv.indexOf("--projeto");
const diretorioProjeto =
	indiceProjeto === -1 ? undefined : process.argv[indiceProjeto + 1];

if (indiceProjeto !== -1 && !diretorioProjeto) {
	falhar("--projeto exige o caminho do diretorio do projeto");
}

if (diretorioProjeto) {
	validarProjeto(diretorioProjeto);
} else {
	validarFabrica();
}
