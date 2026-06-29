import Section from "../Common/Section";
import FadeText from "../Common/FadeText";
import bg from "../../assets/backgrounds/chapter04.png";

export default function Chapter04() {
  return (
    <Section id="chapter04" backgroundImage={bg}>
      <FadeText>
        <h2 className="text-4xl font-bold text-white md:text-6xl">
          ...MAS ALGUMA COISA
        </h2>
      </FadeText>

      <FadeText delay={1}>
        <h3 className="mt-10 text-5xl font-light text-[#C89C3D] md:text-7xl">
          SEMPRE TE IMPEDIU.
        </h3>
      </FadeText>
    </Section>
  );
}