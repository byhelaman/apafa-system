import { type FormEvent, useState } from "react";
import Modal from './Modal';

export default function SearchForm() {
  const { message, handleSubmit, data, isModalOpen, setIsModalOpen } = useSearchForm();

  return (
    <div>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        className="w-full flex flex-col gap-2 px-6"
      >
        <InputField id="search" name="search" placeholder="Search..." />
        <button
          type="submit"
          className="border rounded-lg bg-dark_blue text-lg text-white py-3"
        >
          Buscar
        </button>
        {message && <span className="text-red">{message}</span>}
      </form>
      {data && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={data}
        />
      )}
    </div>
  );
}

function useSearchForm() {
  const [message, setMessage] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const response = await fetch("/api/search", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.message) {
      return setMessage(result.message);
    }

    setData(result);
    setIsModalOpen(true);
  };

  return { message, handleSubmit, data, isModalOpen, setIsModalOpen };
}

interface InputFieldProps {
  type?: string;
  id: string;
  name: string;
  placeholder?: string;
  className?: string;
  value?: string;
}

function InputField({
  type = "text",
  id,
  name,
  placeholder,
  className = "",
}: InputFieldProps) {
  const base = "border rounded-lg text-lg placeholder:text-soft_blue px-4 py-2";
  return (
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      className={`${base} ${className}`}
    />
  );
}
