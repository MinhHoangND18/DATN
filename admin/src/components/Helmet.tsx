import { Helmet as HelmetWrapper } from "react-helmet";

function Helmet(props: HelmetProps) {
  return (
    <HelmetWrapper>
      <title>{props.title}</title>
      <meta name="description" content={props.description} />
    </HelmetWrapper>
  );
}

Helmet.defaultProps = {
  title: "Quản lý phòng khám",
  description: "",
};

export default Helmet;
