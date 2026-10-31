/**
 * TOTP de teste (RFC 6238) com WebCrypto, sem dependencia nova.
 * So para provar o ciclo 2FA do Better Auth no teste integrado.
 */

export function base32ParaBytes(base32: string): Uint8Array<ArrayBuffer> {
	const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
	const limpo = base32.replace(/=+$/, "").toUpperCase();
	let bits = 0;
	let valor = 0;
	const saida: number[] = [];
	for (const letra of limpo) {
		valor = (valor << 5) | alfabeto.indexOf(letra);
		bits += 5;
		if (bits >= 8) {
			saida.push((valor >>> (bits - 8)) & 0xff);
			bits -= 8;
		}
	}
	return new Uint8Array(saida);
}

export async function codigoTotp(segredoBase32: string): Promise<string> {
	const chave = await crypto.subtle.importKey(
		"raw",
		base32ParaBytes(segredoBase32),
		{ name: "HMAC", hash: "SHA-1" },
		false,
		["sign"],
	);
	const contador = new DataView(new ArrayBuffer(8));
	contador.setBigUint64(0, BigInt(Math.floor(Date.now() / 1000 / 30)));
	const assinatura = new Uint8Array(
		await crypto.subtle.sign("HMAC", chave, contador),
	);
	const deslocamento = assinatura[assinatura.length - 1] & 0x0f;
	const numero =
		((assinatura[deslocamento] & 0x7f) << 24) |
		(assinatura[deslocamento + 1] << 16) |
		(assinatura[deslocamento + 2] << 8) |
		assinatura[deslocamento + 3];
	return String(numero % 10 ** 6).padStart(6, "0");
}
