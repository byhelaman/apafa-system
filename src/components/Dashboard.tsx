import { useEffect, useState } from "react";

// interface Partner {
//   partner_id: string
//   first_names: string
//   status: string
// }


export function Dashboard() {
  // const [data, setData] = useState<Partner[] | null>(null);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/profiles')
      const data = await response.json()
      console.log(data);
    }

    fetchData();
  }, []);



  return (
    <>
      board...
      {/* <div className="mt-10 px-6">
        {data ? data.map(item => (
          <div key={item.partner_id}>
            <span>{item.first_names}</span>
            <span>{item.status}</span>
          </div>
        )) : null}
      </div> */}
    </>
  );
}

// import { useEffect, useState } from "react";

// interface Partner {
//   email: string
//   partner_id: string
//   code: string;
//   role: string
// }


// export function Dashboard() {
//   const [data, setData] = useState<Partner[] | null>(null);
//   // const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchData() {
//       const response = await fetch('/api/profiles')
//       const data = await response.json()
//       setData(data);
//     }

//     fetchData();
//   }, []);


//   return (
//     <>
//       <div className="mt-10 px-6">
//         {data ? data.map(item => (
//           <div key={item.partner_id} className="flex flex-col mb-2">
//             <span>{item.email}</span>
//             <span>{item.partner_id}</span>
//             <span>{item.role}</span>
//           </div>
//         )) : null}
//       </div>
//     </>
//   );
// }
