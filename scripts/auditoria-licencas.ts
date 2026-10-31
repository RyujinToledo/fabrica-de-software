import { execFileSync } from "node:child_process";

/**
 * Auditoria de licencas (TASK-012, RNF-010).
 * Barra copyleft viral (GPL/AGPL). LGPL passa.
 * Roda no CI logo apos o audit de vulnerabilidades.
 */

export function proibida(licenca: string): boolean {
	const normalizada = licenca.trim();
	if (/lesser/i.test(normalizada)) {
		return false;
	}
	return /(^|[^a-z])gpl/i.test(normalizada) || /agpl/i.test(normalizada);
}

export function conferir(mapa: Record<string, string[]>): string[] {
	const achados: string[] = [];
	for (const [licenca, pacotes] of Object.entries(mapa)) {
		if (proibida(licenca)) {
			achados.push(`${licenca}: ${pacotes.join(", ")}`);
		}
	}
	return achados;
}

if (import.meta.filename === process.argv[1]) {
	const bruto = execFileSync("pnpm", ["licenses", "list", "--json"], {
		encoding: "utf8",
		stdio: ["pipe", "pipe", "pipe"],
	});
	const porLicenca: Record<string, string[]> = {};
	const lista = JSON.parse(bruto) as Record<string, { name: string }[]>;
	for (const [licenca, pacotes] of Object.entries(lista)) {
		porLicenca[licenca] = pacotes.map((p) => p.name);
	}
	const achados = conferir(porLicenca);
	if (achados.length > 0) {
		console.error(`[licencas] BLOQUEADO:\n${achados.join("\n")}`);
		process.exit(1);
	}
	console.log("[licencas] ok: nenhuma GPL/AGPL no grafo de dependencias.");
}
