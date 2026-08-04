import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

function formatarWhatsapp(valor: string) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);

  if (numeros.length <= 2) {
    return numeros;
  }

  if (numeros.length <= 7) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  }

  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

function CadastroEvangelismo() {
  const nomeInputRef = useRef<HTMLInputElement | null>(null);

  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [bairro, setBairro] = useState("");
  const [localAbordagem, setLocalAbordagem] = useState("");
  const [evangelista, setEvangelista] = useState("");
  const [pedidoOracao, setPedidoOracao] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    nomeInputRef.current?.focus();
  }, []);

  function limparFormulario() {
    setNome("");
    setWhatsapp("");
    setBairro("");
    setLocalAbordagem("");
    setEvangelista("");
    setPedidoOracao("");
  }

  async function enviarCadastro(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const whatsappDigits = whatsapp.replace(/\D/g, "");

    if (nome.trim().length < 2) {
      setErro("Digite o nome da pessoa.");
      nomeInputRef.current?.focus();
      return;
    }

    if (whatsappDigits.length !== 11) {
      setErro(
        "Digite um WhatsApp válido com DDD. Exemplo: (62) 99999-9999.",
      );
      return;
    }

    if (!localAbordagem.trim()) {
      setErro("Informe onde a pessoa foi abordada.");
      return;
    }

    if (!evangelista.trim()) {
      setErro("Informe o nome do evangelista.");
      return;
    }

    try {
      setEnviando(true);
      setErro("");

      await addDoc(collection(db, "leads"), {
        nome: nome.trim(),
        whatsapp,
        whatsappDigits,
        bairro: bairro.trim(),
        pedidoOracao: pedidoOracao.trim(),
        origem: "Evangelismo de rua",
        status: "novo",
        dispositivo: window.innerWidth <= 768 ? "mobile" : "desktop",
        cadastradoPor: evangelista.trim(),
        localAbordagem: localAbordagem.trim(),
        responsavel: "",
        historico: [],
        criadoEm: serverTimestamp(),
      });

      limparFormulario();
      setEnviado(true);

      window.setTimeout(() => {
        setEnviado(false);
        nomeInputRef.current?.focus();
      }, 1500);
    } catch (error) {
      console.error("Erro ao cadastrar contato:", error);

      setErro(
        "Não foi possível enviar o cadastro agora. Tente novamente.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-8 md:px-6">
      <section className="mx-auto w-full max-w-xl">
        <header className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[3px] text-[#C89C3D]">
            Projeto Filho, Volta Pra Casa
          </p>

          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Cadastro de evangelismo
          </h1>

          <p className="mt-3 text-gray-400">
            Preencha os dados e envie para a Central de Reconciliação.
          </p>
        </header>

        {enviado ? (
          <div className="rounded-2xl border border-green-800 bg-green-950/40 p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15 text-3xl">
              ✓
            </div>

            <h2 className="text-2xl font-bold text-white">
              Cadastro enviado!
            </h2>

            <p className="mt-3 text-green-200">
              Pronto para o próximo cadastro.
            </p>
          </div>
        ) : (
          <form
            onSubmit={enviarCadastro}
            className="space-y-5 rounded-2xl border border-[#2a2a2a] bg-[#111] p-5 shadow-2xl md:p-8"
          >
            <div>
              <label
                htmlFor="nome"
                className="mb-2 block text-sm font-semibold text-gray-300"
              >
                Nome da pessoa
              </label>

              <input
                ref={nomeInputRef}
                id="nome"
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                placeholder="Como ela gostaria de ser chamada?"
                disabled={enviando}
                required
                className="w-full rounded-xl border border-gray-700 bg-[#181818] p-4 text-white placeholder:text-gray-500 outline-none transition focus:border-[#C89C3D] disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="whatsapp"
                className="mb-2 block text-sm font-semibold text-gray-300"
              >
                WhatsApp
              </label>

              <input
                id="whatsapp"
                type="tel"
                value={whatsapp}
                onChange={(event) =>
                  setWhatsapp(formatarWhatsapp(event.target.value))
                }
                placeholder="(62) 99999-9999"
                maxLength={15}
                disabled={enviando}
                required
                className="w-full rounded-xl border border-gray-700 bg-[#181818] p-4 text-white placeholder:text-gray-500 outline-none transition focus:border-[#C89C3D] disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="bairro"
                className="mb-2 block text-sm font-semibold text-gray-300"
              >
                Bairro
              </label>

              <input
                id="bairro"
                type="text"
                value={bairro}
                onChange={(event) => setBairro(event.target.value)}
                placeholder="Bairro onde a pessoa mora"
                disabled={enviando}
                className="w-full rounded-xl border border-gray-700 bg-[#181818] p-4 text-white placeholder:text-gray-500 outline-none transition focus:border-[#C89C3D] disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="localAbordagem"
                className="mb-2 block text-sm font-semibold text-gray-300"
              >
                Onde foi abordada
              </label>

              <input
                id="localAbordagem"
                type="text"
                value={localAbordagem}
                onChange={(event) =>
                  setLocalAbordagem(event.target.value)
                }
                placeholder="Semáforo, praça, evento..."
                disabled={enviando}
                required
                className="w-full rounded-xl border border-gray-700 bg-[#181818] p-4 text-white placeholder:text-gray-500 outline-none transition focus:border-[#C89C3D] disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="evangelista"
                className="mb-2 block text-sm font-semibold text-gray-300"
              >
                Nome do evangelista
              </label>

              <input
                id="evangelista"
                type="text"
                value={evangelista}
                onChange={(event) => setEvangelista(event.target.value)}
                placeholder="Quem realizou o cadastro?"
                disabled={enviando}
                required
                className="w-full rounded-xl border border-gray-700 bg-[#181818] p-4 text-white placeholder:text-gray-500 outline-none transition focus:border-[#C89C3D] disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="pedidoOracao"
                className="mb-2 block text-sm font-semibold text-gray-300"
              >
                Pedido de oração ou observação
              </label>

              <textarea
                id="pedidoOracao"
                rows={4}
                value={pedidoOracao}
                onChange={(event) =>
                  setPedidoOracao(event.target.value)
                }
                placeholder="Campo opcional"
                disabled={enviando}
                className="w-full resize-none rounded-xl border border-gray-700 bg-[#181818] p-4 text-white placeholder:text-gray-500 outline-none transition focus:border-[#C89C3D] disabled:opacity-60"
              />
            </div>

            {erro && (
              <div
                role="alert"
                className="rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300"
              >
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="w-full rounded-xl bg-[#C89C3D] p-4 font-bold uppercase tracking-[2px] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {enviando ? "Enviando..." : "Enviar contato"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

export default CadastroEvangelismo;