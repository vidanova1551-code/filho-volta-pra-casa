import Section from "../Common/Section";
import FadeText from "../Common/FadeText";
import bg from "../../assets/backgrounds/decision.png";

export default function Decision() {
  return (
    <Section id="decision" backgroundImage={bg}>
      <FadeText>
        <h2 className="text-5xl font-bold text-white md:text-7xl">
          Hoje...
        </h2>
      </FadeText>

      <FadeText delay={1}>
        <p className="mt-10 text-3xl leading-relaxed text-gray-200 md:text-5xl">
          VOCÊ PODE TOMAR
          <br />
          UMA DECISÃO.
        </p>
      </FadeText>

      <FadeText delay={2}>
        <a
          href="#form"
          className="mt-16 inline-block rounded-full bg-[#C89C3D] px-12 py-5 text-lg font-bold uppercase tracking-[4px] text-black transition hover:bg-white"
        >
          EU QUERO VOLTAR
        </a>
      </FadeText>
    </Section>
  );
}