const Label = ({ id, text, customClass }) => {
  return (
    <div id={id} className={(customClass ? customClass : " text-2xl") + " flex justify-center items-center"}>
      {text}
    </div>
  );
};

export default Label;
