import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  visible: boolean;
  onClose: () => void;
  timeout?: number;
}

export default function Toast({
  message,
  type,
  onClose,
  visible,
  timeout = 7800,
}: ToastProps) {
  const [show, setShow] = useState(visible);
  console.log("visible", visible);
  useEffect(() => {
    setShow(visible);
    setTimeout(() => {
      setShow(false);
      onClose();
    }, timeout);
  }, [visible]);

  const backgroundColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const textColor = type === "success" ? "text-green-100" : "text-red-100";

  return show ? (
    <div
      className={`fixed bottom-0 right-0 mb-4 mr-4 rounded-md p-4 shadow-md ${backgroundColor} ${textColor}`}
      onClick={() => {
        setShow(false);
        onClose();
      }}
    >
      {message}
    </div>
  ) : null;
}
