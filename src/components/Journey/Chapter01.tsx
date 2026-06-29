import Section from "../Common/Section";
import FadeText from "../Common/FadeText";
import bg from "../../assets/backgrounds/chapter01.png";

export default function Chapter01() {
  return (
    <Section id="chapter01" backgroundImage={bg}>
      <FadeText>
        <h2 className="text-6xl font-bold text-white md:text-8xl">
          FAZ TEMPO...
        </h2>
      </FadeText>

      <FadeText delay={1}>
        <h3 className="mt-10 text-4xl text-gray-200 md:text-6xl">
          NÃO FAZ?
        </h3>
      </FadeText>
    </Section>
  );
}