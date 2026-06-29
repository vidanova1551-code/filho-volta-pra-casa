import Section from "../Common/Section";
import FadeText from "../Common/FadeText";
import bg from "../../assets/backgrounds/chapter06.png";

export default function Chapter06() {
  return (
    <Section id="chapter06" backgroundImage={bg}>
      <FadeText>
        <h2 className="text-5xl font-bold leading-relaxed text-white md:text-7xl">
          Eu nunca deixei
          <br />
          de esperar por você.
        </h2>
      </FadeText>
    </Section>
  );
}