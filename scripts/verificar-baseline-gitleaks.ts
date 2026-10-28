/**
 * Gate da baseline de gitleaks da fabrica (RF-030).
 *
 * Modo padrao, sem argumentos: valida a baseline do proprio repositorio da fabrica.
 * Modo --projeto <diretorio>: valida que um projeto gerado herdou a baseline intacta.
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
const ID_REGRA = "senha-em-comando-sudo";

// Montado por partes de proposito: o padrao literal escrito direto no codigo
// faria o proprio gitleaks barrar este arquivo no pre-commit.
const PADRAO_PROIBIDO = [
	"echo",
	"senha-de-teste",
	"|",
	"sudo",
	"apt",
	"install",
	"foo",
].join(" ");

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

function escanear(diretorio: string, config: string): Vazamento[] {
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
				config,
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

		const bruto = readFileSync(relatorio, "utf8").trim();
		return bruto ? (JSON.parse(bruto) as Vazamento[]) : [];
	} finally {
		rmSync(pasta, { recursive: true, force: true });
	}
}

function conferirRegra(config: string, origem: string): void {
	if (!config.includes(ID_REGRA)) {
		falhar(`${origem} nao declara a regra ${ID_REGRA}`);
	}
	if (!/useDefault\s*=\s*true/.test(config)) {
		falhar(
			`${origem} nao estende as regras padrao do gitleaks (useDefault = true)`,
		);
	}
}

function conferirEficacia(): void {
	const pasta = mkdtempSync(join(tmpdir(), "baseline-gitleaks-fixture-"));

	try {
		writeFileSync(join(pasta, "README.md"), `${PADRAO_PROIBIDO}\n`);
		const vazamentos = escanear(pasta, BASELINE);
		const acertou = vazamentos.some(
			(vazamento) => vazamento.RuleID === ID_REGRA,
		);

		if (!acertou) {
			falhar(`a regra ${ID_REGRA} nao detectou o padrao proibido`);
		}

		writeFileSync(
			join(pasta, "README.md"),
			"instalacao sem senha no comando\n",
		);
		const limpos = escanear(pasta, BASELINE);

		if (limpos.length > 0) {
			falhar(
				`a baseline acusou texto limpo (${limpos.map((v) => v.RuleID).join(", ")})`,
			);
		}
	} finally {
		rmSync(pasta, { recursive: true, force: true });
	}
}

function validarFabrica(): void {
	if (!existsSync(BASELINE)) {
		falhar(`baseline ausente em ${BASELINE}`);
	}

	conferirRegra(readFileSync(BASELINE, "utf8"), "baseline da fabrica");
	conferirEficacia();
	console.log(
		`[baseline-gitleaks] OK: baseline da fabrica valida, regra ${ID_REGRA} ativa.`,
	);
}

function validarProjeto(diretorio: string): void {
	const arquivo = join(resolve(diretorio), ".gitleaks.toml");

	if (!existsSync(arquivo)) {
		falhar(
			`${arquivo} nao existe; o projeto precisa herdar a baseline da fabrica`,
		);
	}

	conferirRegra(readFileSync(arquivo, "utf8"), arquivo);

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
