import Section from "../Common/Section";
import FadeText from "../Common/FadeText";
import bg from "../../assets/backgrounds/chapter02.png";

export default function Chapter02() {
  return (
    <Section id="chapter02" backgroundImage={bg}>
      <FadeText>
        <h2 className="text-6xl font-bold text-white md:text-8xl">
          EU SEI.
        </h2>
      </FadeText>
    </Section>
  );
}