import {
	QueryClient,
	QueryClientProvider,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { useState } from "react";

const API = import.meta.env.VITE_API_URL ?? "";

interface Fase {
	fase: string;
	atual: boolean;
}

interface Evento {
	momento: string;
	nivel: "info" | "erro";
	fase: string;
	mensagem: string;
}

async function lerLogs(aba: string, texto: string): Promise<Evento[]> {
	const params = new URLSearchParams();
	if (aba !== "todos") {
		params.set("nivel", aba);
	}
	if (texto) {
		params.set("texto", texto);
	}
	const res = await fetch(`${API}/logs?${params}`, { credentials: "include" });
	if (!res.ok) {
		throw new Error(`logs: ${res.status}`);
	}
	return (await res.json()) as Evento[];
}

async function lerFases(): Promise<Fase[]> {
	const res = await fetch(`${API}/fases`, { credentials: "include" });
	if (!res.ok) {
		throw new Error(`fases: ${res.status}`);
	}
	return (await res.json()) as Fase[];
}

const NOMES: Record<string, string> = {
	elicitacao: "Elicitacao",
	painel_especialistas: "Painel de Especialistas",
	choque: "Choque de Realidade",
	design: "Consultoria de Design",
	coerencia: "Coerencia",
	decomposicao: "Decomposicao Tecnica",
	geracao_tasks: "Geracao de Tasks",
	execucao: "Execucao Concorrente",
	integracao: "Integracao e Validacao",
	homologacao: "Homologacao",
	deploy: "Deploy",
};

const PARADAS = new Set([
	"elicitacao",
	"choque",
	"design",
	"homologacao",
	"deploy",
]);

function Cartao({ fase, atual }: Fase) {
	const [aberto, setAberto] = useState(atual);
	const cliente = useQueryClient();
	const [motivo, setMotivo] = useState("");
	const aprovar = useMutation({
		mutationFn: async (aprovado: boolean) => {
			const res = await fetch(`${API}/transicoes`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					fase,
					chave: `painel-${fase}-${Date.now()}`,
					artefatoPresente: true,
					aprovado,
					motivo,
				}),
			});
			if (!res.ok) {
				throw new Error(`transicao: ${res.status}`);
			}
		},
		onSuccess: () => cliente.invalidateQueries({ queryKey: ["fases"] }),
	});
	return (
		<article className="rounded-lg border border-slate-700 bg-slate-900 p-4 hover:border-cyan-500/50">
			<header className="flex items-center justify-between">
				<h2 className="text-base text-slate-100">{NOMES[fase] ?? fase}</h2>
				<span
					className={
						atual
							? "rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-400"
							: "rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-300"
					}
				>
					{atual ? "atual" : "pendente"}
				</span>
			</header>
			<button
				type="button"
				onClick={() => setAberto((v) => !v)}
				className="mt-2 rounded-md bg-slate-700 px-4 py-2 text-sm text-slate-200 transition-colors duration-150 hover:bg-slate-600"
			>
				{aberto ? "Recolher" : "Inspecionar"}
			</button>
			{aberto && (
				<div className="mt-3">
					{PARADAS.has(fase) ? (
						<div className="flex flex-col gap-2">
							<input
								value={motivo}
								onChange={(e) => setMotivo(e.target.value)}
								placeholder="Motivo da decisao"
								className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500"
							/>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={() => aprovar.mutate(true)}
									className="rounded-md bg-cyan-600 px-4 py-2 text-sm text-white transition-colors duration-150 hover:bg-cyan-500"
								>
									Aprovar
								</button>
								<button
									type="button"
									onClick={() => aprovar.mutate(false)}
									className="rounded-md bg-rose-600 px-4 py-2 text-sm text-white transition-colors duration-150 hover:bg-rose-500"
								>
									Rejeitar
								</button>
							</div>
							{aprovar.isError && (
								<p className="text-sm text-rose-400">
									Transicao bloqueada: confira o artefato.
								</p>
							)}
						</div>
					) : (
						<p className="text-sm text-slate-400">
							Fase automatica, sem decisao humana.
						</p>
					)}
				</div>
			)}
		</article>
	);
}

function Login({ aoEntrar }: { aoEntrar: () => void }) {
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [erro, setErro] = useState("");
	return (
		<form
			className="flex flex-col gap-2"
			onSubmit={async (e) => {
				e.preventDefault();
				setErro("");
				const res = await fetch(`${API}/api/auth/sign-in/email`, {
					method: "POST",
					headers: { "content-type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ email, password: senha }),
				});
				if (!res.ok) {
					setErro("Login recusado. Confira email e senha.");
					return;
				}
				aoEntrar();
			}}
		>
			<input
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Email"
				type="email"
				className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500"
			/>
			<input
				value={senha}
				onChange={(e) => setSenha(e.target.value)}
				placeholder="Senha"
				type="password"
				className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500"
			/>
			<button
				type="submit"
				className="rounded-md bg-cyan-600 px-4 py-2 text-sm text-white transition-colors duration-150 hover:bg-cyan-500"
			>
				Entrar
			</button>
			{erro && <p className="text-sm text-rose-400">{erro}</p>}
		</form>
	);
}

function Painel() {
	const [filtro, setFiltro] = useState("");
	const [aba, setAba] = useState("todos");
	const [filtroLog, setFiltroLog] = useState("");
	const fases = useQuery({
		queryKey: ["fases"],
		queryFn: lerFases,
		retry: false,
	});
	const logs = useQuery({
		queryKey: ["logs", aba, filtroLog],
		queryFn: () => lerLogs(aba, filtroLog),
		retry: false,
	});
	const visiveis = (fases.data ?? []).filter((f) =>
		(NOMES[f.fase] ?? f.fase).toLowerCase().includes(filtro.toLowerCase()),
	);
	return (
		<div className="flex min-h-screen bg-slate-950">
			<aside className="hidden w-60 flex-col gap-4 border-r border-slate-700 bg-slate-900 p-4 md:flex">
				<h1 className="text-lg text-slate-100">Fabrica</h1>
				<nav className="flex flex-col gap-1 text-sm">
					{["Dashboard", "Pipeline", "Artefatos", "Logs", "Configuracoes"].map(
						(item) => (
							<span key={item} className="rounded px-2 py-1 text-slate-400">
								{item}
							</span>
						),
					)}
				</nav>
				<div className="mt-auto text-xs tabular-nums text-slate-400">
					<p>worktrees: 0/3</p>
					<p>containers: 0</p>
				</div>
			</aside>
			<main className="flex-1 p-4">
				<div className="mb-4 flex items-center justify-between">
					<h1 className="text-xl text-slate-100">Pipeline</h1>
					<input
						value={filtro}
						onChange={(e) => setFiltro(e.target.value)}
						placeholder="Filtrar por fase"
						className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500"
					/>
				</div>
				{fases.isError && (
					<div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
						<p className="mb-2 text-sm text-amber-400">
							Sem acesso a API. Entre com sua conta da fabrica.
						</p>
						<Login aoEntrar={() => fases.refetch()} />
					</div>
				)}
				<div className="grid gap-4 md:grid-cols-2">
					{visiveis.map((f) => (
						<Cartao key={f.fase} fase={f.fase} atual={f.atual} />
					))}
				</div>
				<section className="mt-6 rounded-lg border border-slate-700 bg-slate-900 p-4">
					<div className="mb-3 flex flex-wrap items-center gap-2">
						<h2 className="mr-2 text-base text-slate-100">Logs</h2>
						{["todos", "info", "erro"].map((t) => (
							<button
								key={t}
								type="button"
								onClick={() => setAba(t)}
								className={
									aba === t
										? "rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-400"
										: "rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-300"
								}
							>
								{t}
							</button>
						))}
						<input
							value={filtroLog}
							onChange={(e) => setFiltroLog(e.target.value)}
							placeholder="Filtrar logs"
							className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-100 focus:border-cyan-500"
						/>
					</div>
					<pre className="terminal max-h-64 overflow-auto text-xs text-slate-400">
						{(logs.data ?? [])
							.map((e) => `${e.momento} [${e.nivel}] ${e.fase}: ${e.mensagem}`)
							.join("\n") || "Sem eventos."}
					</pre>
				</section>
			</main>
		</div>
	);
}

const rotaRaiz = createRootRoute({ component: Painel });
const rotaPipeline = createRoute({
	getParentRoute: () => rotaRaiz,
	path: "/",
	component: Painel,
});
const roteador = createRouter({
	routeTree: rotaRaiz.addChildren([rotaPipeline]),
});

export function App({ cliente }: { cliente?: QueryClient }) {
	const [query] = useState(() => cliente ?? new QueryClient());
	return (
		<QueryClientProvider client={query}>
			<RouterProvider router={roteador} />
		</QueryClientProvider>
	);
}
