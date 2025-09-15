// src/components/ui/Button.jsx
const Button = ({ children, ...props }) => (
  <button
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    {...props}
  >
    {children}
  </button>
);

export default Button;