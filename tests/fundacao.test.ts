import { describe, expect, it } from "vitest";
import { healthCheck } from "../src/index.ts";

describe("fundacao da fabrica", () => {
	it("expõe healthCheck com status ok", () => {
		const resultado = healthCheck();
		expect(resultado.status).toBe("ok");
		expect(typeof resultado.timestamp).toBe("number");
	});
});
