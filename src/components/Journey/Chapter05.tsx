import Section from "../Common/Section";
import FadeText from "../Common/FadeText";
import bg from "../../assets/backgrounds/chapter05.png";

export default function Chapter05() {
  return (
    <Section id="chapter05" backgroundImage={bg}>
      <FadeText>
        <h2 className="text-6xl font-bold text-white md:text-8xl">
          MESMO ASSIM...
        </h2>
      </FadeText>
    </Section>
  );
}