import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

function formatWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function Form() {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [pedidoOracao, setPedidoOracao] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const whatsappDigits = whatsapp.replace(/\D/g, "");

    if (whatsappDigits.length !== 11) {
      setErro("Digite um WhatsApp válido com DDD. Exemplo: (62) 99999-9999");
      return;
    }

    setErro("");
    setEnviando(true);

    try {
      await addDoc(collection(db, "leads"), {
        nome: nome.trim(),
        whatsapp,
        whatsappDigits,
        pedidoOracao: pedidoOracao.trim(),
        origem: "Landing Filho Volta pra Casa",
        status: "novo",
        dispositivo: window.innerWidth <= 768 ? "mobile" : "desktop",
        criadoEm: serverTimestamp(),
      });

      setEnviado(true);
      setNome("");
      setWhatsapp("");
      setPedidoOracao("");
    } catch (error) {
      console.error(error);
      setErro("Não foi possível enviar agora. Tente novamente em instantes.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section
  id="form"
  className="flex min-h-screen snap-start items-start justify-center bg-black px-8 pt-12 md:items-center md:pt-0"
>
      <div className="w-full max-w-xl">
        {!enviado ? (
          <>
            <h2 className="mb-6 pt-14 text-center text-5xl font-bold leading-[0.9] text-white md:mb-4 md:pt-0">
              Você não chegou
              <br />
              até aqui por acaso.
            </h2>

            <p className="mb-10 text-center text-lg leading-relaxed text-gray-400">
              Deixe seu contato. Alguém preparado vai falar com você com amor,
              respeito e cuidado.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                placeholder="Como você gostaria de ser chamado?"
                required
                className="w-full rounded-xl border border-gray-700 bg-[#111] p-5 text-white placeholder:text-gray-500 outline-none transition focus:border-[#C89C3D]"
              />

              <input
                type="tel"
                value={whatsapp}
                onChange={(event) => setWhatsapp(formatWhatsapp(event.target.value))}
                placeholder="(62) 99999-9999"
                required
                maxLength={15}
                className="w-full rounded-xl border border-gray-700 bg-[#111] p-5 text-white placeholder:text-gray-500 outline-none transition focus:border-[#C89C3D]"
              />

              <textarea
                rows={5}
                value={pedidoOracao}
                onChange={(event) => setPedidoOracao(event.target.value)}
                placeholder="Se desejar, conte como podemos orar por você."
                className="w-full rounded-xl border border-gray-700 bg-[#111] p-5 text-white placeholder:text-gray-500 outline-none transition focus:border-[#C89C3D]"
              />

              {erro && (
                <p className="text-center text-sm text-red-400">
                  {erro}
                </p>
              )}

              <button
                type="submit"
                disabled={enviando}
                className="w-full rounded-xl bg-[#C89C3D] p-5 text-lg font-bold uppercase tracking-[2px] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {enviando ? "ENVIANDO..." : "QUERO CONVERSAR"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#C89C3D]/15 text-4xl">
              ❤️
            </div>

            <h2 className="text-5xl font-bold leading-tight text-white">
              Enviado
              <br />
              com sucesso!
            </h2>

            <p className="mt-8 text-xl leading-relaxed text-gray-300">
              Em breve alguém da nossa equipe falará com você.
            </p>

            <p className="mt-10 text-lg leading-relaxed text-gray-400">
              Enquanto isso, lembre-se:
            </p>

            <p className="mt-4 text-3xl font-bold leading-tight text-[#C89C3D]">
              Sempre existe
              <br />
              um caminho de volta.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}