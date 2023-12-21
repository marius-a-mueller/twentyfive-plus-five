const Button = ({ id, icon, callback }) => {
  return (
    <div
      id={id}
      onClick={(event) => callback(event)}
      className="px-2 cursor-pointer active:text-green-500 flex justify-center items-center m-5"
    >
      <i className={"fa-lg " + icon}></i>
    </div>
  );
};

export default Button;
