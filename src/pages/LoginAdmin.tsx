import { useState } from "react";
import type { FormEvent } from "react";
import { FirebaseError } from "firebase/app";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";

import { auth } from "../firebase";

function LoginAdmin() {
  const navigate = useNavigate();
  const location = useLocation();

const mensagemDaSessao =
  typeof location.state === "object" &&
  location.state !== null &&
  "mensagem" in location.state
    ? String(location.state.mensagem)
    : "";

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");

    if (!email.trim() || !senha) {
      setErro("Preencha o e-mail e a senha.");
      return;
    }

    try {
      setCarregando(true);

      await setPersistence(auth, browserSessionPersistence);

await signInWithEmailAndPassword(auth, email.trim(), senha);

      navigate("/adm/painel", { replace: true });
    } catch (error) {
      console.error("Erro no login administrativo:", error);

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-credential":
          case "auth/user-not-found":
          case "auth/wrong-password":
            setErro("E-mail ou senha inválidos.");
            break;

          case "auth/invalid-email":
            setErro("Digite um endereço de e-mail válido.");
            break;

          case "auth/too-many-requests":
            setErro(
              "Muitas tentativas de acesso. Aguarde alguns minutos e tente novamente.",
            );
            break;

          case "auth/network-request-failed":
            setErro("Falha de conexão. Verifique sua internet.");
            break;

          default:
            setErro("Não foi possível entrar. Tente novamente.");
        }
      } else {
        setErro("Ocorreu um erro inesperado. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-6">
      <section className="w-full max-w-md rounded-2xl border border-[#2a2a2a] bg-[#111] p-8 shadow-2xl">
        <p className="mb-2 text-center text-sm font-semibold uppercase tracking-[3px] text-[#C89C3D]">
          Filho, Volta Pra Casa
        </p>

        <h1 className="mb-3 text-center text-3xl font-bold text-white">
          Área administrativa
        </h1>

        <p className="mb-8 text-center text-gray-400">
          Acesso exclusivo para administradores autorizados.
        </p>

        <form className="space-y-5" onSubmit={fazerLogin}>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={carregando}
              className="w-full rounded-xl border border-gray-700 bg-[#181818] p-4 text-white outline-none transition focus:border-[#C89C3D] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="senha"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Senha
            </label>

            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              disabled={carregando}
              className="w-full rounded-xl border border-gray-700 bg-[#181818] p-4 text-white outline-none transition focus:border-[#C89C3D] disabled:cursor-not-allowed disabled:opacity-60"
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
            disabled={carregando}
            className="w-full rounded-xl bg-[#C89C3D] p-4 font-bold uppercase tracking-[2px] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
          {mensagemDaSessao && (
  <div className="mb-5 rounded-xl border border-amber-700/60 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
    {mensagemDaSessao}
  </div>
)}
        </form>

        <a
          href="/"
          className="mt-6 block text-center text-sm text-gray-400 transition hover:text-white"
        >
          Voltar para o site
        </a>
      </section>
    </main>
  );
}

export default LoginAdmin;