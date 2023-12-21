const Button = ({ id, icon, callback }) => {
  return (
    <button
      id={id}
      onClick={(event) => callback(event)}
      className={"px-2 cursor-pointer active:text-green-500 flex justify-center items-center m-5 fa-lg " + icon}
    ></button>
  );
};
//<i className={"fa-lg " + icon}></i>

export default Button;
