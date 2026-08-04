import { useEffect, useMemo, useState } from "react";
import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import type { Timestamp } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";

interface HistoricoItem {
  descricao: string;
  data: string;
}

interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  whatsappDigits: string;
  pedidoOracao: string;
  origem: string;
  status: string;
  dispositivo: string;
  criadoEm: Timestamp | null;
  responsavel?: string;
  cadastradoPor?: string;
  localAbordagem?: string;
  historico?: HistoricoItem[];
}

const OPCOES_STATUS = [
  { valor: "novo", texto: "Novo" },
  { valor: "contatado", texto: "Contatado" },
  { valor: "em_acompanhamento", texto: "Em acompanhamento" },
  { valor: "visitou_culto", texto: "Visitou o culto" },
  { valor: "integrado", texto: "Integrado" },
];

const ORDEM_STATUS = {
  novo: 0,
  contatado: 1,
  em_acompanhamento: 2,
  visitou_culto: 3,
  integrado: 4,
} as const;

type StatusValido = keyof typeof ORDEM_STATUS;

function atingiuEtapa(statusAtual: string, etapaDesejada: StatusValido) {
  const nivelAtual =
    ORDEM_STATUS[statusAtual as StatusValido] ?? ORDEM_STATUS.novo;

  return nivelAtual >= ORDEM_STATUS[etapaDesejada];
}

function nomeDoStatus(status: string) {
  return (
    OPCOES_STATUS.find((opcao) => opcao.valor === status)?.texto ??
    "Não definido"
  );
}

function classeDoStatus(status: string) {
  switch (status) {
    case "novo":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "contatado":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "em_acompanhamento":
      return "border-purple-200 bg-purple-50 text-purple-700";

    case "visitou_culto":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "integrado":
      return "border-green-300 bg-green-100 text-green-800";

    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
}

function formatarData(timestamp: Timestamp | null) {
  if (!timestamp) {
    return "Processando data...";
  }

  return timestamp.toDate().toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatarDataHistorico(data: string) {
  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    return data;
  }

  return dataConvertida.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function PainelAdmin() {
  const navigate = useNavigate();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [leadSelecionado, setLeadSelecionado] = useState<Lead | null>(null);

  const [responsavel, setResponsavel] = useState("");
  const [localAbordagem, setLocalAbordagem] = useState("");
  const [cadastradoPor, setCadastradoPor] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const consulta = query(
      collection(db, "leads"),
      orderBy("criadoEm", "desc"),
    );

    const cancelarObservacao = onSnapshot(
      consulta,
      (resultado) => {
        const dados = resultado.docs.map((documento) => {
          const dadosDoDocumento = documento.data();

          return {
            id: documento.id,
            nome: dadosDoDocumento.nome ?? "",
            whatsapp: dadosDoDocumento.whatsapp ?? "",
            whatsappDigits: dadosDoDocumento.whatsappDigits ?? "",
            pedidoOracao: dadosDoDocumento.pedidoOracao ?? "",
            origem: dadosDoDocumento.origem ?? "",
            status: dadosDoDocumento.status ?? "novo",
            dispositivo: dadosDoDocumento.dispositivo ?? "",
            criadoEm: dadosDoDocumento.criadoEm ?? null,
            responsavel: dadosDoDocumento.responsavel ?? "",
            cadastradoPor: dadosDoDocumento.cadastradoPor ?? "",
            localAbordagem: dadosDoDocumento.localAbordagem ?? "",
            historico: dadosDoDocumento.historico ?? [],
          } satisfies Lead;
        });

        setLeads(dados);
        setCarregando(false);
        setErro("");

        setLeadSelecionado((leadAtual) => {
          if (!leadAtual) {
            return null;
          }

          return dados.find((lead) => lead.id === leadAtual.id) ?? leadAtual;
        });
      },
      (error) => {
        console.error("Erro ao carregar contatos:", error);
        setErro("Não foi possível carregar os contatos.");
        setCarregando(false);
      },
    );

    return cancelarObservacao;
  }, []);

  const leadsFiltrados = useMemo(() => {
    const texto = busca.trim().toLowerCase();

    return leads.filter((lead) => {
      const correspondeAoStatus =
        filtroStatus === "todos" || lead.status === filtroStatus;

      const correspondeABusca =
        !texto ||
        lead.nome.toLowerCase().includes(texto) ||
        lead.whatsapp.includes(texto) ||
        lead.whatsappDigits.includes(texto) ||
        (lead.responsavel ?? "").toLowerCase().includes(texto);

      return correspondeAoStatus && correspondeABusca;
    });
  }, [leads, busca, filtroStatus]);

  const indicadores = useMemo(
    () => ({
      novos: leads.filter((lead) => lead.status === "novo").length,

      contatados: leads.filter((lead) =>
        atingiuEtapa(lead.status, "contatado"),
      ).length,

      pedidosOracao: leads.filter(
        (lead) => lead.pedidoOracao.trim().length > 0,
      ).length,

      visitaram: leads.filter((lead) =>
        atingiuEtapa(lead.status, "visitou_culto"),
      ).length,

      integrados: leads.filter((lead) =>
        atingiuEtapa(lead.status, "integrado"),
      ).length,
    }),
    [leads],
  );

  function abrirFicha(lead: Lead) {
    setLeadSelecionado(lead);

    setResponsavel(lead.responsavel ?? "");

    setLocalAbordagem(
      lead.localAbordagem ||
        (lead.origem === "Landing Filho Volta pra Casa"
          ? "Formulário do site"
          : lead.origem),
    );

    setCadastradoPor(
      lead.cadastradoPor ||
        (lead.origem === "Landing Filho Volta pra Casa"
          ? "A própria pessoa pelo site"
          : ""),
    );
  }

  function fecharFicha() {
    setLeadSelecionado(null);
    setResponsavel("");
    setLocalAbordagem("");
    setCadastradoPor("");
  }

  async function atualizarStatus(lead: Lead, novoStatus: string) {
    try {
      await updateDoc(doc(db, "leads", lead.id), {
        status: novoStatus,
        atualizadoEm: serverTimestamp(),

        historico: arrayUnion({
          descricao: `Situação alterada para: ${nomeDoStatus(novoStatus)}`,
          data: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Erro ao atualizar situação:", error);
      alert("Não foi possível atualizar a situação.");
    }
  }

  async function salvarFicha() {
    if (!leadSelecionado) {
      return;
    }

    try {
      setSalvando(true);

      await updateDoc(doc(db, "leads", leadSelecionado.id), {
        responsavel: responsavel.trim(),
        localAbordagem: localAbordagem.trim(),
        cadastradoPor: cadastradoPor.trim(),
        atualizadoEm: serverTimestamp(),

        historico: arrayUnion({
          descricao: "Informações de acompanhamento atualizadas.",
          data: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Erro ao salvar ficha:", error);
      alert("Não foi possível salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  }

  function abrirWhatsapp(lead: Lead) {
    const numero = lead.whatsappDigits.replace(/\D/g, "");

    if (!numero) {
      alert("Este contato não possui um número de WhatsApp válido.");
      return;
    }

    window.open(
      `https://wa.me/55${numero}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function sairDoPainel() {
    try {
      await signOut(auth);
      navigate("/adm", { replace: true });
    } catch (error) {
      console.error("Erro ao sair do painel:", error);
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f4f6] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-[3px] text-[#9A7425]">
              Projeto Filho, Volta Pra Casa
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              Central de Reconciliação
            </h1>

            <p className="mt-2 text-gray-500">
              Acompanhamento geral das pessoas que solicitaram contato.
            </p>
          </div>

          <button
            type="button"
            onClick={sairDoPainel}
            className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
          >
            Sair
          </button>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <span className="text-2xl">❤️</span>

            <p className="mt-3 text-sm font-medium text-gray-500">
              Novos contatos
            </p>

            <strong className="mt-1 block text-4xl text-gray-900">
              {indicadores.novos}
            </strong>
          </article>

          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <span className="text-2xl">📲</span>

            <p className="mt-3 text-sm font-medium text-gray-500">
              Contatados
            </p>

            <strong className="mt-1 block text-4xl text-gray-900">
              {indicadores.contatados}
            </strong>
          </article>

          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <span className="text-2xl">🙏</span>

            <p className="mt-3 text-sm font-medium text-gray-500">
              Pedidos de oração
            </p>

            <strong className="mt-1 block text-4xl text-gray-900">
              {indicadores.pedidosOracao}
            </strong>
          </article>

          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <span className="text-2xl">🏠</span>

            <p className="mt-3 text-sm font-medium text-gray-500">
              Visitaram o culto
            </p>

            <strong className="mt-1 block text-4xl text-gray-900">
              {indicadores.visitaram}
            </strong>
          </article>

          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <span className="text-2xl">👥</span>

            <p className="mt-3 text-sm font-medium text-gray-500">
              Integrados
            </p>

            <strong className="mt-1 block text-4xl text-gray-900">
              {indicadores.integrados}
            </strong>
          </article>
        </section>

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-200 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Pessoas cadastradas
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {leadsFiltrados.length} contato(s) encontrado(s).
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Pesquisar nome, telefone..."
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#C89C3D]"
              />

              <select
                value={filtroStatus}
                onChange={(event) => setFiltroStatus(event.target.value)}
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-[#C89C3D]"
              >
                <option value="todos">Todas as situações</option>

                {OPCOES_STATUS.map((opcao) => (
                  <option key={opcao.valor} value={opcao.valor}>
                    {opcao.texto}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {carregando ? (
            <div className="p-12 text-center text-gray-500">
              Carregando contatos...
            </div>
          ) : erro ? (
            <div className="p-12 text-center text-red-600">{erro}</div>
          ) : leadsFiltrados.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              Nenhum contato encontrado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm text-gray-500">
                    <th className="px-5 py-4 font-semibold">Nome</th>
                    <th className="px-5 py-4 font-semibold">WhatsApp</th>
                    <th className="px-5 py-4 font-semibold">Responsável</th>
                    <th className="px-5 py-4 font-semibold">Situação</th>
                    <th className="px-5 py-4 font-semibold">Cadastro</th>
                    <th className="px-5 py-4 font-semibold">Ações</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {leadsFiltrados.map((lead) => (
                    <tr
                      key={lead.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => abrirFicha(lead)}
                          className="text-left font-semibold text-gray-900 hover:text-[#9A7425]"
                        >
                          {lead.nome}
                        </button>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {lead.whatsapp}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {lead.responsavel || "Não definido"}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={lead.status}
                          onChange={(event) =>
                            atualizarStatus(lead, event.target.value)
                          }
                          className={`rounded-lg border px-3 py-2 text-sm font-semibold outline-none ${classeDoStatus(
                            lead.status,
                          )}`}
                        >
                          {OPCOES_STATUS.map((opcao) => (
                            <option key={opcao.valor} value={opcao.valor}>
                              {opcao.texto}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-500">
                        {formatarData(lead.criadoEm)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => abrirWhatsapp(lead)}
                            className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                          >
                            WhatsApp
                          </button>

                          <button
                            type="button"
                            onClick={() => abrirFicha(lead)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                          >
                            Ver ficha
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {leadSelecionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              fecharFicha();
            }
          }}
        >
          <section className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <header className="flex items-start justify-between border-b border-gray-200 p-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[2px] text-[#9A7425]">
                  Ficha de acompanhamento
                </p>

                <h2 className="mt-1 text-3xl font-bold text-gray-900">
                  {leadSelecionado.nome}
                </h2>

                <p className="mt-1 text-gray-500">
                  {leadSelecionado.whatsapp}
                </p>
              </div>

              <button
                type="button"
                onClick={fecharFicha}
                className="rounded-lg px-3 py-2 text-xl text-gray-500 hover:bg-gray-100"
                aria-label="Fechar ficha"
              >
                ✕
              </button>
            </header>

            <div className="space-y-6 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="responsavel"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Responsável
                  </label>

                  <input
                    id="responsavel"
                    type="text"
                    value={responsavel}
                    onChange={(event) => setResponsavel(event.target.value)}
                    placeholder="Nome do responsável"
                    className="w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#C89C3D]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cadastradoPor"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Quem cadastrou
                  </label>

                  <input
                    id="cadastradoPor"
                    type="text"
                    value={cadastradoPor}
                    onChange={(event) => setCadastradoPor(event.target.value)}
                    placeholder="Quem realizou o cadastro"
                    className="w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#C89C3D]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="localAbordagem"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Onde foi abordado
                  </label>

                  <input
                    id="localAbordagem"
                    type="text"
                    value={localAbordagem}
                    onChange={(event) =>
                      setLocalAbordagem(event.target.value)
                    }
                    placeholder="Site, rua, evento..."
                    className="w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#C89C3D]"
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-gray-700">
                    Data do cadastro
                  </p>

                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-700">
                    {formatarData(leadSelecionado.criadoEm)}
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-gray-700">
                  Pedido de oração
                </p>

                <div className="min-h-24 whitespace-pre-wrap rounded-xl border border-gray-200 bg-amber-50 p-4 text-gray-700">
                  {leadSelecionado.pedidoOracao ||
                    "Nenhum pedido de oração informado."}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => abrirWhatsapp(leadSelecionado)}
                  className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                >
                  Abrir conversa no WhatsApp
                </button>

                <button
                  type="button"
                  onClick={salvarFicha}
                  disabled={salvando}
                  className="rounded-xl bg-[#C89C3D] px-5 py-3 font-semibold text-black transition hover:bg-[#d8b55d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {salvando ? "Salvando..." : "Salvar informações"}
                </button>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  Histórico
                </h3>

                <div className="space-y-3">
                  <article className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="font-semibold text-gray-900">
                      Cadastro realizado
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {formatarData(leadSelecionado.criadoEm)}
                    </p>
                  </article>

                  {(leadSelecionado.historico ?? [])
                    .slice()
                    .reverse()
                    .map((item, indice) => (
                      <article
                        key={`${item.data}-${indice}`}
                        className="rounded-xl border border-gray-200 bg-white p-4"
                      >
                        <p className="font-semibold text-gray-900">
                          {item.descricao}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {formatarDataHistorico(item.data)}
                        </p>
                      </article>
                    ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default PainelAdmin;