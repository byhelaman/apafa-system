interface CardUserProps {
  data?: {
    email?: string;
    user_id?: string;
    role?: string;
  }
}


export function CardUser({ data = {} }: CardUserProps) {
  return (
    <div className="">
      <div className="">
        <span>{data.email}</span>
        <span>{data.user_id}</span>
        <span>{data.role}</span>
      </div>
      <button>X</button>
    </div>
  )
}