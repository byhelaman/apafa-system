import { type FormEvent, useState } from "react";

export default function SearchForm() {
  const { message, handleSubmit } = useSearchForm();

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2 px-6">
      <InputField id="search" name="search" />
      <button type="submit" className="border rounded-lg bg-dark_blue text-lg text-white py-3">Buscar</button>
      {message && <span className="text-red">{message}</span>}
    </form>
  );
}

function useSearchForm() {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const response = await fetch("/api/search", {
      method: "POST",
      body: formData,
    });

    const data = await response.json(); // object

    if (data.message) {
      setMessage(data.message);
    }

  }

  return { message, handleSubmit };
}

function InputField({ type = "text", id, name, placeholder, className }: InputFieldProps) {
  const base = "border rounded-lg text-lg placeholder:text-soft_blue px-4 py-2"

  return (
    <input type={type} id={id} name={name} placeholder={placeholder} className={`${base} ${className}`} />
  );
}

interface InputFieldProps {
  type?: string;
  id: string;
  name: string;
  placeholder?: string;
  className?: string;
}