import { describe, expect, it } from "vitest";
import { buscarRag, montarBuscaRag } from "../src/db/busca.js";

describe("busca RAG", () => {
	it("monta SQL em portugues com rank e limite", () => {
		const { textoSql, parametros } = montarBuscaRag("pagamento via pix");
		expect(parametros).toEqual(["pagamento via pix"]);
		expect(textoSql).toContain("plainto_tsquery('portuguese'");
		expect(textoSql).toContain("ts_rank_cd");
		expect(textoSql).toContain("ORDER BY rank DESC LIMIT 20");
		for (const tabela of [
			"projetos",
			"mensagens",
			"requisitos",
			"prds",
			"adrs",
			"tasks",
		]) {
			expect(textoSql).toContain(`FROM ${tabela}`);
		}
	});

	it("rejeita termo vazio", () => {
		expect(() => montarBuscaRag("   ")).toThrow();
	});

	it("delega ao executor com o SQL montado", async () => {
		let capturado = "";
		const linhas = await buscarRag(async (textoSql) => {
			capturado = textoSql;
			return [];
		}, "nota fiscal");
		expect(linhas).toEqual([]);
		expect(capturado).toContain("FROM requisitos");
	});
});

describe("busca RAG integrada", () => {
	it.skipIf(!process.env.DATABASE_URL)(
		"retorna o documento certo no topo em menos de 50 ms (p50)",
		async () => {
			const { default: postgres } = await import("postgres");
			const sql = postgres(process.env.DATABASE_URL as string, { max: 1 });
			try {
				await sql`TRUNCATE prds, adrs, requisitos, mensagens, sessoes, tasks, projetos CASCADE`;
				const [projeto] = await sql`
					INSERT INTO projetos (nome, descricao) VALUES ('Padaria', 'projeto de teste')
					RETURNING id`;
				await sql`
					INSERT INTO prds (projeto_id, codigo, titulo, conteudo)
					VALUES (${projeto.id}, 'PRD-001', 'Pagamento', 'pagamento via pix com comprovante')`;
				await sql`
					INSERT INTO prds (projeto_id, codigo, titulo, conteudo)
					VALUES (${projeto.id}, 'PRD-002', 'Entrega', 'entrega com bicicleta na cidade')`;
				const tempos: number[] = [];
				let topo = "";
				for (let i = 0; i < 5; i++) {
					const inicio = performance.now();
					const linhas = await buscarRag(async (textoSql, parametros) => {
						return (await sql.unsafe(
							textoSql,
							parametros as string[],
						)) as never;
					}, "pagamento pix");
					tempos.push(performance.now() - inicio);
					topo = (linhas[0] as { codigo?: string }).codigo ?? "";
				}
				tempos.sort((a, b) => a - b);
				const p50 = tempos[Math.floor(tempos.length / 2)];
				expect(topo).toContain("PRD-001");
				expect(p50).toBeLessThan(50);
			} finally {
				await sql.end();
			}
		},
	);
});
