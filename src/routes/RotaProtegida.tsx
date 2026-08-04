import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";

import { auth } from "../firebase";

interface RotaProtegidaProps {
  children: ReactNode;
}

const TEMPO_LIMITE_INATIVIDADE = 15 * 60 * 1000; // 15 minutos

function RotaProtegida({ children }: RotaProtegidaProps) {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<User | null>(null);
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    const cancelarObservacao = onAuthStateChanged(auth, (usuarioAtual) => {
      setUsuario(usuarioAtual);
      setVerificando(false);
    });

    return cancelarObservacao;
  }, []);

  useEffect(() => {
    if (!usuario) {
      return;
    }

    let temporizador: ReturnType<typeof setTimeout>;

    async function encerrarPorInatividade() {
      try {
        await signOut(auth);

        navigate("/adm", {
          replace: true,
          state: {
            mensagem:
              "Sua sessão foi encerrada após 15 minutos sem atividade.",
          },
        });
      } catch (error) {
        console.error("Erro ao encerrar sessão por inatividade:", error);
      }
    }

    function reiniciarTemporizador() {
      clearTimeout(temporizador);

      temporizador = setTimeout(
        encerrarPorInatividade,
        TEMPO_LIMITE_INATIVIDADE,
      );
    }

    const eventosDeAtividade = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    eventosDeAtividade.forEach((evento) => {
      window.addEventListener(evento, reiniciarTemporizador);
    });

    reiniciarTemporizador();

    return () => {
      clearTimeout(temporizador);

      eventosDeAtividade.forEach((evento) => {
        window.removeEventListener(evento, reiniciarTemporizador);
      });
    };
  }, [usuario, navigate]);

  if (verificando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] px-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-[#C89C3D]" />

          <p className="text-sm uppercase tracking-[2px] text-gray-400">
            Verificando acesso...
          </p>
        </div>
      </main>
    );
  }

  if (!usuario) {
    return <Navigate to="/adm" replace />;
  }

  return children;
}

export default RotaProtegida;