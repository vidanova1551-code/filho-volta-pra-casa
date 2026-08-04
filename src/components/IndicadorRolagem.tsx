interface IndicadorRolagemProps {
  texto?: string;
}

function IndicadorRolagem({
  texto = "Deslize para continuar",
}: IndicadorRolagemProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-4 left-1/2 z-40 flex w-full max-w-sm -translate-x-1/2 flex-col items-center px-4 text-center"
    >
      <p className="text-xs font-semibold uppercase tracking-[2px] text-white/90 drop-shadow-lg md:text-sm">
        {texto}
      </p>

      <div className="mt-1 flex flex-col items-center text-[#C89C3D] drop-shadow-lg">
        <span className="animate-bounce text-3xl leading-none">⌄</span>
        <span className="-mt-4 animate-bounce text-3xl leading-none [animation-delay:150ms]">
          ⌄
        </span>
      </div>
    </div>
  );
}

export default IndicadorRolagem;