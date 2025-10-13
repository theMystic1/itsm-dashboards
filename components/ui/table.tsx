"use client";

import { IProps } from "@/types/type";

export const TableOverflow: React.FC<IProps> = ({ children, className }) => {
  return (
    <div className={`w-full overflow-x-auto h-full min-h-[600px] ${className}`}>
      {children}
    </div>
  );
};

export const Table: React.FC<IProps> = ({ children }) => {
  return (
    <table className="w-full text-left whitespace-nowrap overflow-y-auto ">
      {children}
    </table>
  );
};

export const Thead: React.FC<IProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

export const Tbody: React.FC<IProps> = ({ children }) => {
  return <tbody>{children}</tbody>;
};

export const Th: React.FC<IProps> = ({ children, className }) => {
  return (
    <th className={`md:px-5 px-2 py-3 text-dark-150 ${className}`}>
      {children}
    </th>
  );
};

export const Tr: React.FC<IProps> = ({ children, className, onClick }) => {
  return (
    <tr className={className} onClick={onClick}>
      {children}
    </tr>
  );
};

export const Td: React.FC<IProps> = ({ children, className, onClick }) => {
  return (
    <td
      className={`md:px-5 sm:px-2 px-1 py-4 text-xs capitalize ${className}`}
      onClick={onClick}
    >
      {children}
    </td>
  );
};

// export const RadioCheck = ({
//   checked,
//   setChecked,
// }: {
//   checked: boolean;
//   setChecked: () => void;
// }) => {
//   return (
//     <button
//       className="h-3.5 w-3.5 rounded-[2.6px] border border-gray-400 flex justify-center items-center"
//       onClick={setChecked}
//     >
//       {checked ? <FcCheckmark size={12} /> : null}
//     </button>
//   );
// };
