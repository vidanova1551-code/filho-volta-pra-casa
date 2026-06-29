import Section from "../Common/Section";
import FadeText from "../Common/FadeText";
import bg from "../../assets/backgrounds/chapter03.png";

export default function Chapter03() {
  return (
    <Section id="chapter03" backgroundImage={bg}>
      <FadeText>
        <h2 className="text-5xl font-bold leading-tight text-white md:text-7xl">
          EU VI ...
        </h2>
      </FadeText>

      <FadeText delay={1}>
        <p className="mt-12 text-3xl leading-relaxed text-gray-200 md:text-5xl">
          TODAS AS VEZES
          <br />
          QUE VOCÊ QUIS VOLTAR...
        </p>
      </FadeText>
    </Section>
  );
}